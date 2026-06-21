// Метка вида 20260621-183045 (локальное время) — общий идентификатор пары
// (лист с примерами + лист ответов). Попадает в имена файлов и печатается в PDF.
export function makeToken(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  );
}
