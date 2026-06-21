// Русский словарь. Все видимые строки (UI и заголовки PDF) идут через t(),
// чтобы позже можно было добавить другие языки без правки компонентов.
export const ru: Record<string, string> = {
  'app.title': 'Variora',
  'app.subtitle': 'Генератор математических задач',

  'task.title': 'Примеры для 4–5 класса',
  'task.hint': 'Только натуральные числа, деление без остатка.',

  'field.count': 'Количество примеров',
  'field.maxNumber': 'Максимальное число',
  'field.operations': 'Операции',
  'field.shuffle': 'Перемешать примеры',

  'op.add': 'Сложение',
  'op.sub': 'Вычитание',
  'op.mul': 'Умножение',
  'op.div': 'Деление',

  'button.worksheet': 'Скачать примеры',
  'button.answers': 'Скачать ответы',
  'button.both': 'Скачать оба файла',
  'button.regenerate': 'Новые примеры',
  'button.working': 'Готовим PDF…',

  'error.noOperations': 'Выберите хотя бы одну операцию.',

  'pdf.worksheetTitle': 'Примеры. 4–5 класс',
  'pdf.answersTitle': 'Ответы. 4–5 класс',
  'pdf.name': 'Имя: ',
  'pdf.date': 'Дата: ',
  'pdf.code': 'Код: ',
};
