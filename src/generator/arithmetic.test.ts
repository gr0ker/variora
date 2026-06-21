import { describe, it, expect } from 'vitest';
import { generateProblems, ALL_OPERATIONS } from './arithmetic';
import type { Operation, Problem, TaskParams } from '../types';

const baseParams: TaskParams = {
  count: 20,
  maxNumber: 100,
  operations: [...ALL_OPERATIONS],
  shuffle: false,
};

// Проверка инвариантов одного примера.
function expectValidProblem(p: Problem, max: number): void {
  // Все числа натуральные (целые ≥ 1) и в пределах max.
  for (const value of [p.a, p.b, p.answer]) {
    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(max);
  }
  expect(p.a).toBeGreaterThanOrEqual(1);
  expect(p.b).toBeGreaterThanOrEqual(1);

  switch (p.op) {
    case 'add':
      expect(p.a + p.b).toBe(p.answer);
      break;
    case 'sub':
      expect(p.a - p.b).toBe(p.answer);
      expect(p.answer).toBeGreaterThanOrEqual(0); // результат не отрицательный
      break;
    case 'mul':
      expect(p.a * p.b).toBe(p.answer);
      break;
    case 'div':
      expect(p.a % p.b).toBe(0); // деление без остатка
      expect(p.a / p.b).toBe(p.answer);
      break;
  }
}

describe('generateProblems', () => {
  it('генерирует точно запрошенное количество примеров', () => {
    for (const count of [0, 1, 7, 20, 53]) {
      const problems = generateProblems({ ...baseParams, count });
      expect(problems).toHaveLength(count);
    }
  });

  it('соблюдает инварианты (натуральные числа, без остатка, ≤ max) на большом прогоне', () => {
    for (let run = 0; run < 200; run++) {
      const max = 10 + Math.floor(Math.random() * 990);
      const problems = generateProblems({ ...baseParams, count: 40, maxNumber: max, shuffle: true });
      for (const p of problems) expectValidProblem(p, max);
    }
  });

  it('использует только выбранные операции', () => {
    const subsets: Operation[][] = [['add'], ['mul', 'div'], ['add', 'sub', 'mul']];
    for (const operations of subsets) {
      const problems = generateProblems({ ...baseParams, operations, count: 30 });
      const used = new Set(problems.map((p) => p.op));
      for (const op of used) expect(operations).toContain(op);
    }
  });

  it('возвращает пустой массив, если операции не выбраны', () => {
    expect(generateProblems({ ...baseParams, operations: [] })).toEqual([]);
  });

  it('распределяет примеры по операциям почти поровну', () => {
    const problems = generateProblems({ ...baseParams, count: 20, operations: [...ALL_OPERATIONS] });
    const counts = ALL_OPERATIONS.map((op) => problems.filter((p) => p.op === op).length);
    for (const c of counts) expect(c).toBe(5);
  });

  it('без перемешивания группирует операции в каноническом порядке', () => {
    const problems = generateProblems({ ...baseParams, count: 12, shuffle: false });
    const order = problems.map((p) => p.op);
    const firstIndex = ALL_OPERATIONS.map((op) => order.indexOf(op)).filter((i) => i >= 0);
    const sorted = [...firstIndex].sort((a, b) => a - b);
    expect(firstIndex).toEqual(sorted);
  });

  it('работает при малом max без ошибок и нарушения инвариантов', () => {
    for (const max of [2, 3, 4, 5]) {
      const problems = generateProblems({ ...baseParams, count: 16, maxNumber: max, shuffle: true });
      for (const p of problems) expectValidProblem(p, max);
    }
  });
});
