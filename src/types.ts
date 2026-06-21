// Арифметические операции, поддерживаемые генератором.
export type Operation = 'add' | 'sub' | 'mul' | 'div';

// Параметры генерации набора примеров. Хранятся только на стороне клиента.
export interface TaskParams {
  /** Сколько всего примеров сгенерировать. */
  count: number;
  /** Верхняя граница для чисел и результатов (все значения натуральные, ≤ maxNumber). */
  maxNumber: number;
  /** Какие операции использовать. */
  operations: Operation[];
  /** Перемешивать ли примеры, чтобы одинаковые операции не шли подряд. */
  shuffle: boolean;
}

// Один сгенерированный пример: a <op> b = answer.
export interface Problem {
  a: number;
  b: number;
  op: Operation;
  answer: number;
}
