export const QUESTIONS = [
  { text: 'Сколько часов Гугл просидел в кинотеатре из-за потерянного наушника?', choices: ['20 минут', '1 час', '3 часа', 'Он до сих пор там'], correct: 2 },
  { text: 'Куда Гугл поступает в универ?', choices: ['Oxford', 'Hogwarts', 'University of Edinburgh', 'Binəqədi Dövlət Universiteti'], correct: 2 },
  { text: "What was Google's greatest academic enemy?", choices: ['Calculus', 'SAT Reading', 'Physics', 'Azerbaijani language'], correct: 2 },
  { text: 'Какой у Гугла SAT?', choices: ['1090', '1300', '1490', '1600, просто College Board украл 110 баллов'], correct: 2 },
  { text: 'Что надо ответить на "Guess what?"', choices: ['What?', "I don't care", 'Chicken butt!', 'Удали мой номер'], correct: 2 },
  { text: 'Какую группу Гугл способен приплести буквально к чему угодно?', choices: ['Radiohead', 'Linkin Park', 'Twenty One Pilots', 'Imagine Dragons'], correct: 2 },
  { text: 'Что Гугл написал Гейбу Ньюэллу?', choices: ['"Когда Half-Life 3?"', '"Дай Steam Deck"', '"Я поступил в Edinburgh, через 4 года приду к вам работать как AI спец"', '"Пофикси CS2"'], correct: 2 },
  { text: 'Какой проект Гугл реально деплоил на AWS с PostgreSQL, Nginx и HTTPS?', choices: ['Казино', 'Сайт знакомств', 'BeatRush', 'Калькулятор ИМТ'], correct: 2 },
  { text: 'Какой инструмент Гугл внезапно купил?', choices: ['Скрипку', 'Бас-гитару', 'Электронные барабаны', 'Аккордеон'], correct: 2 },
  { text: 'Что Гугл скорее всего сделает после фразы "всё, сегодня отдыхаю"?', choices: ['Ляжет спать', 'Посмотрит фильм', 'Пойдёт гулять', 'Найдёт новый проект и будет ебаться с ним до 4 утра'], correct: 3 },
  { text: 'Что Гугл реально делал в Minecraft?', choices: ['Построил компьютер внутри Minecraft', 'Написал собственный мод', 'Управлял игрой голосом через Python', 'Прошёл игру без клавиатуры'], correct: 2 },
  { text: 'Какое самое триггерное слово для Гугла?', choices: ['Physics', 'Deadline', 'joy', 'Unconditional'], correct: 2 },
  { text: 'Что Гугл скорее всего сделает после возникновения технической проблемы?', choices: ['Забьёт', 'Позовёт мастера', 'Купит новое устройство', 'Откроет 17 терминалов и сам будет выяснять, какого хуя оно не работает'], correct: 3 },
  { text: 'Зачем Гугл однажды создал Boosty?', choices: ['Продавать курсы', 'Собирать деньги на университет', 'Собирать на виниловый проигрыватель, чтобы ебать уши соседям', 'Финансировать Minecraft-сервер'], correct: 2 },
  { text: 'Что является естественным состоянием Гугла?', choices: ['Спокойствие', 'Отдых', 'Стабильный режим сна', 'Одновременно 7 проектов, экзамен, дедлайн и какая-нибудь абсолютно ненужная новая идея'], correct: 3 },
] as const

export const publicQuestions = QUESTIONS.map(({ text, choices }) => ({ text, choices }))

export function rank(score: number) {
  if (score <= 2) return 'WHO THE FUCK ARE YOU?'
  if (score <= 5) return 'RANDOM NPC'
  if (score <= 8) return 'FRIEND OF A FRIEND'
  if (score <= 10) return 'CERTIFIED HOMIE'
  if (score <= 12) return 'LORE ENJOYER'
  if (score <= 14) return 'LORE KEEPER'
  return 'GO OUTSIDE. NOW.'
}
