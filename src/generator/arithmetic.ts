import type { Operation, Problem, TaskParams } from '../types';

// Канонический порядок операций — используется для группировки, когда перемешивание выключено.
export const ALL_OPERATIONS: Operation[] = ['add', 'sub', 'mul', 'div'];

// Случайное целое в диапазоне [min, max] включительно.
function randInt(min: number, max: number): number {
  if (max < min) max = min;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Сложение: a, b ∈ [1, max], причём a + b ≤ max (результат остаётся в пределах).
function genAdd(max: number): Problem {
  const a = randInt(1, Math.max(1, max - 1));
  const b = randInt(1, Math.max(1, max - a));
  return { a, b, op: 'add', answer: a + b };
}

// Вычитание: a ∈ [1, max], b ∈ [1, a] → результат a − b ≥ 0.
function genSub(max: number): Problem {
  const a = randInt(1, max);
  const b = randInt(1, a);
  return { a, b, op: 'sub', answer: a - b };
}

// Умножение: множители ≥ 2, произведение ≤ max (гарантировано выбором a ≤ √max).
function genMul(max: number): Problem {
  if (max < 4) {
    const a = randInt(1, max);
    return { a, b: 1, op: 'mul', answer: a };
  }
  const a = randInt(2, Math.floor(Math.sqrt(max)));
  const b = randInt(2, Math.floor(max / a));
  return { a, b, op: 'mul', answer: a * b };
}

// Деление без остатка: делимое d = b·c ≤ max, делитель b ≥ 2, частное c ≥ 2.
function genDiv(max: number): Problem {
  if (max < 4) {
    const d = randInt(1, max);
    return { a: d, b: 1, op: 'div', answer: d };
  }
  const b = randInt(2, Math.floor(Math.sqrt(max)));
  const c = randInt(2, Math.floor(max / b));
  return { a: b * c, b, op: 'div', answer: c };
}

function genOne(op: Operation, max: number): Problem {
  switch (op) {
    case 'add':
      return genAdd(max);
    case 'sub':
      return genSub(max);
    case 'mul':
      return genMul(max);
    case 'div':
      return genDiv(max);
  }
}

// Распределяем total примеров по k операциям максимально равномерно.
// Первые (total % k) операций получают на один пример больше.
function distribute(total: number, k: number): number[] {
  const base = Math.floor(total / k);
  const remainder = total % k;
  return Array.from({ length: k }, (_, i) => base + (i < remainder ? 1 : 0));
}

// Перемешивание Фишера–Йетса на месте.
function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// После перемешивания стараемся, чтобы две одинаковые операции не шли подряд (best-effort):
// для каждого «дубля» ищем дальше элемент с другой операцией и меняем местами.
function reduceAdjacentDuplicates(problems: Problem[]): void {
  for (let i = 1; i < problems.length; i++) {
    if (problems[i].op !== problems[i - 1].op) continue;
    for (let j = i + 1; j < problems.length; j++) {
      if (problems[j].op !== problems[i - 1].op) {
        [problems[i], problems[j]] = [problems[j], problems[i]];
        break;
      }
    }
  }
}

/**
 * Генерирует набор примеров по заданным параметрам.
 * Гарантии: только натуральные числа, деление без остатка, все значения ≤ maxNumber.
 */
export function generateProblems(params: TaskParams): Problem[] {
  const selected = new Set(params.operations);
  const ops = ALL_OPERATIONS.filter((op) => selected.has(op));
  if (ops.length === 0) return [];

  const max = Math.max(2, Math.floor(params.maxNumber));
  const count = Math.max(0, Math.floor(params.count));

  const perOp = distribute(count, ops.length);
  const problems: Problem[] = [];
  ops.forEach((op, idx) => {
    for (let i = 0; i < perOp[idx]; i++) {
      problems.push(genOne(op, max));
    }
  });

  if (params.shuffle) {
    shuffleInPlace(problems);
    reduceAdjacentDuplicates(problems);
  }
  // Если перемешивание выключено — примеры уже сгруппированы в каноническом порядке операций.

  return problems;
}
