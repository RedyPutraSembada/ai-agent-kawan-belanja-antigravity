import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

const INLINE_TOKEN_REGEX = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

/**
 * Parses **bold**, *italic*, and `code` inline markdown spans into docx TextRuns.
 */
function parseInlineRuns(
  text: string,
  options?: { color?: string; italics?: boolean; bold?: boolean }
): TextRun[] {
  const runs: TextRun[] = [];
  let lastIndex = 0;
  INLINE_TOKEN_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = INLINE_TOKEN_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(
        new TextRun({
          text: text.slice(lastIndex, match.index),
          color: options?.color,
          italics: options?.italics,
          bold: options?.bold,
        })
      );
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      runs.push(
        new TextRun({
          text: token.slice(2, -2),
          bold: true,
          color: options?.color,
          italics: options?.italics,
        })
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      runs.push(
        new TextRun({
          text: token.slice(1, -1),
          font: "Consolas",
          color: "1E293B",
          shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
        })
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      runs.push(
        new TextRun({
          text: token.slice(1, -1),
          italics: true,
          color: options?.color,
          bold: options?.bold,
        })
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    runs.push(
      new TextRun({
        text: text.slice(lastIndex),
        color: options?.color,
        italics: options?.italics,
        bold: options?.bold,
      })
    );
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text: "" }));
  }

  return runs;
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return false;
  const cells = trimmed
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|");
  return cells.every((cell) => /^:?-{2,}:?$/.test(cell.trim()));
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function buildDocxTable(tableLines: string[]): Table {
  const dataLines = tableLines.filter((line) => !isTableSeparator(line));
  const parsedRows = dataLines.map(splitTableRow);
  const colCount = Math.max(...parsedRows.map((r) => r.length), 1);

  const tableRows = parsedRows.map((cells, rowIdx) => {
    const isHeader = rowIdx === 0;
    const normalizedCells = Array.from({ length: colCount }, (_, i) => cells[i] ?? "");

    return new TableRow({
      tableHeader: isHeader,
      children: normalizedCells.map(
        (cellText) =>
          new TableCell({
            shading: isHeader
              ? { fill: "E0E7FF", type: ShadingType.CLEAR }
              : rowIdx % 2 === 1
              ? { fill: "F8FAFC", type: ShadingType.CLEAR }
              : undefined,
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: parseInlineRuns(cellText, {
                  bold: isHeader,
                  color: isHeader ? "1E1B4B" : "1E293B",
                }),
              }),
            ],
          })
      ),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
  });
}

export async function markdownToDocxBuffer(
  markdown: string,
  title: string
): Promise<Buffer> {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const children: Array<Paragraph | Table> = [];

  let i = 0;
  let inCodeBlock = false;
  const codeLines: string[] = [];

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (trimmed.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLines.length = 0;
      } else {
        inCodeBlock = false;
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 140 },
            shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
            border: {
              left: { color: "6366F1", size: 12, space: 8, style: BorderStyle.SINGLE },
            },
            children: [
              new TextRun({
                text: codeLines.join("\n"),
                font: "Consolas",
                size: 19,
                color: "0F172A",
              }),
            ],
          })
        );
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      i++;
      continue;
    }

    if (trimmed === "") {
      i++;
      continue;
    }

    // Markdown table block
    if (trimmed.startsWith("|")) {
      const tableBlock: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableBlock.push(lines[i]);
        i++;
      }
      if (tableBlock.length >= 2) {
        children.push(buildDocxTable(tableBlock));
        children.push(new Paragraph({ spacing: { after: 100 }, children: [] }));
        continue;
      }
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 120 },
          border: {
            bottom: { color: "CBD5E1", size: 6, space: 4, style: BorderStyle.SINGLE },
          },
          children: [],
        })
      );
      i++;
      continue;
    }

    // Headings (# to ####)
    const headingMatch = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingMap = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
        4: HeadingLevel.HEADING_4,
      } as const;

      children.push(
        new Paragraph({
          heading: headingMap[level as 1 | 2 | 3 | 4],
          spacing: { before: level === 1 ? 260 : 200, after: 100 },
          children: parseInlineRuns(headingMatch[2], {
            bold: true,
            color: level === 1 ? "1E1B4B" : "1E293B",
          }),
        })
      );
      i++;
      continue;
    }

    // Checkboxes (- [ ] or - [x])
    const checkMatch = /^[-*]\s+\[([ xX])\]\s+(.+)$/.exec(trimmed);
    if (checkMatch) {
      const checked = checkMatch[1].toLowerCase() === "x";
      children.push(
        new Paragraph({
          indent: { left: 360 },
          spacing: { before: 40, after: 60 },
          children: [
            new TextRun({ text: checked ? "☑ " : "☐ ", bold: true, color: "4F46E5" }),
            ...parseInlineRuns(checkMatch[2]),
          ],
        })
      );
      i++;
      continue;
    }

    // Bullet list
    const bulletMatch = /^[-*+]\s+(.+)$/.exec(trimmed);
    if (bulletMatch) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 40, after: 60 },
          children: parseInlineRuns(bulletMatch[1]),
        })
      );
      i++;
      continue;
    }

    // Numbered list
    const numMatch = /^(\d+)\.\s+(.+)$/.exec(trimmed);
    if (numMatch) {
      children.push(
        new Paragraph({
          indent: { left: 360, hanging: 240 },
          spacing: { before: 40, after: 60 },
          children: [
            new TextRun({ text: `${numMatch[1]}. `, bold: true, color: "334155" }),
            ...parseInlineRuns(numMatch[2]),
          ],
        })
      );
      i++;
      continue;
    }

    // Blockquote
    const quoteMatch = /^>\s*(.+)$/.exec(trimmed);
    if (quoteMatch) {
      children.push(
        new Paragraph({
          indent: { left: 320 },
          spacing: { before: 80, after: 100 },
          border: {
            left: { color: "6366F1", size: 16, space: 10, style: BorderStyle.SINGLE },
          },
          shading: { fill: "EEF2FF", type: ShadingType.CLEAR },
          children: parseInlineRuns(quoteMatch[1], {
            italics: true,
            color: "312E81",
          }),
        })
      );
      i++;
      continue;
    }

    // Normal paragraph
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 100, line: 300 },
        children: parseInlineRuns(trimmed),
      })
    );
    i++;
  }

  const doc = new Document({
    title,
    creator: "Kantor Virtual Marketing & Ads — Kawan Belanja",
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "Kawan Belanja (kawanbelanja.com) · Kantor Virtual Marketing & Ads",
                    size: 17,
                    color: "64748B",
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: `Dokumen: ${title} · Mode Aman: Draf Siap Pakai / Meta Ads PAUSED`,
                    size: 16,
                    color: "64748B",
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
