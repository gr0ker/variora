import { jsPDF } from 'jspdf';
import type { Operation, Problem, TaskParams } from '../types';
import { t } from '../i18n';
import { registerCyrillicFont, FONT_NAME } from './fonts/dejavu';

const OP_SYMBOL: Record<Operation, string> = {
  add: '+',
  sub: '−', // настоящий минус U+2212 — лучше смотрится, есть в шрифте
  mul: '×',
  div: '÷',
};

// Геометрия страницы A4 (мм).
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 15;
const GUTTER = 12;
const LINE_H = 14; // высота строки — место, чтобы ученик вписал ответ
const COLS = 2;
const COL_W = (PAGE_W - MARGIN * 2 - GUTTER * (COLS - 1)) / COLS;

interface DocOptions {
  title: string;
  /** Подставлять ли ответ (лист ответов) вместо места для записи (лист с примерами). */
  withAnswer: boolean;
  /** Печатать ли строку «Имя / Дата» (только на листе с примерами). */
  nameLine: boolean;
  /** Общий код пары — печатается в шапке для сопоставления листов. */
  code: string;
}

function exprText(p: Problem): string {
  return `${p.a} ${OP_SYMBOL[p.op]} ${p.b} =`;
}

async function buildDoc(problems: Problem[], options: DocOptions): Promise<jsPDF> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  await registerCyrillicFont(doc);

  // Заголовок.
  doc.setFontSize(18);
  doc.text(options.title, MARGIN, MARGIN + 4);

  // Код пары — мелким шрифтом справа в шапке, для сопоставления листов.
  doc.setFontSize(10);
  doc.text(`${t('pdf.code')}${options.code}`, PAGE_W - MARGIN, MARGIN + 4, { align: 'right' });

  let headerBottom = MARGIN + 12;

  // Строка для имени и даты (лист с примерами).
  if (options.nameLine) {
    doc.setFontSize(11);
    doc.text(`${t('pdf.name')}________________________`, MARGIN, headerBottom);
    doc.text(`${t('pdf.date')}____________`, MARGIN + COL_W + GUTTER, headerBottom);
    headerBottom += 8;
  }

  // Примеры в две колонки.
  doc.setFontSize(13);
  const startY = headerBottom + 6;
  let y = startY;

  for (let i = 0; i < problems.length; i++) {
    const col = i % COLS;

    if (col === 0) {
      if (i > 0) y += LINE_H;
      if (y > PAGE_H - MARGIN) {
        doc.addPage();
        doc.setFont(FONT_NAME, 'normal');
        doc.setFontSize(13);
        y = MARGIN + 6;
      }
    }

    const x = MARGIN + col * (COL_W + GUTTER);
    const label = `${i + 1}) ${exprText(problems[i])}`;
    doc.text(label, x, y);

    if (options.withAnswer) {
      const after = x + doc.getTextWidth(label) + 2;
      doc.text(String(problems[i].answer), after, y);
    } else {
      // Линия для записи ответа.
      const after = x + doc.getTextWidth(label) + 3;
      const lineEnd = x + COL_W;
      if (lineEnd > after) doc.line(after, y + 1, lineEnd, y + 1);
    }
  }

  return doc;
}

// Лист с примерами: ученик вписывает ответы прямо в него.
// token — общий код пары: попадает в имя файла и в шапку листа.
export async function buildWorksheet(
  problems: Problem[],
  _params: TaskParams,
  token: string,
): Promise<void> {
  const doc = await buildDoc(problems, {
    title: t('pdf.worksheetTitle'),
    withAnswer: false,
    nameLine: true,
    code: token,
  });
  doc.save(`variora-primery-${token}.pdf`);
}

// Лист с ответами (тот же token, что и у соответствующего листа с примерами).
export async function buildAnswers(
  problems: Problem[],
  _params: TaskParams,
  token: string,
): Promise<void> {
  const doc = await buildDoc(problems, {
    title: t('pdf.answersTitle'),
    withAnswer: true,
    nameLine: false,
    code: token,
  });
  doc.save(`variora-otvety-${token}.pdf`);
}
