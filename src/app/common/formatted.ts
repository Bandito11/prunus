
const MONTHSLABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export function formattedTime(date: Date) {
  let time = '';
  if (date.getHours() === 0) {
    time = `12:`;
  } else {
    if (date.getHours() > 12) {
      if ((date.getHours() - 12) < 10) {
        time = `0${date.getHours() - 12}:`;
      } else {
        time = `${date.getHours() - 12}:`;
      }
    } else {
      time = `${date.getHours()}:`;
    }
  }
  if (date.getMinutes() < 10) {
    time += `0${date.getMinutes()}:`;
  } else {
    time += `${date.getMinutes()}:`;
  }
  if (date.getSeconds() < 10) {
    time += `0${date.getSeconds()}`;
  } else {
    time += `${date.getSeconds()}`;
  }
  if (date.getHours() > 12) {
    time += ' PM';
  } else {
    time += ' AM';
  }
  return time;
}

export function formattedDate(date: Date, opts?: string) {
  let currentDate;
  if (opts === 'stats') {
    if (date.getMonth() < 10) {
      currentDate = `${MONTHSLABELS[date.getMonth()].substring(0, 3)} 0${date.getDate()}, ${date.getFullYear()}`;
    } else {
      currentDate = `${MONTHSLABELS[date.getMonth()].substring(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
    }
  } else {
    if (date.getMonth() < 10) {
      currentDate = `${MONTHSLABELS[date.getMonth()]} 0${date.getDate()}, ${date.getFullYear()}`;
    } else {
      currentDate = `${MONTHSLABELS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
  }
  return currentDate;
}

export function shortFormattedDate(date: string) {
  const currentDate = {
    // tslint:disable-next-line:radix
    year: parseInt(date.substring(0, 4)),
    // tslint:disable-next-line:radix
    month: parseInt(date.substring(5, 7)) - 1,
    // tslint:disable-next-line:radix
    day: parseInt(date.substring(8, date.length))
  };
  let chosenDate = '';
  if (currentDate.month < 10) {
    chosenDate = `${MONTHSLABELS[currentDate.month].substring(0, 3)} 0${currentDate.day}, ${currentDate.year}`;
  } else {
    chosenDate = `${MONTHSLABELS[currentDate.month].substring(0, 3)} ${currentDate.day}, ${currentDate.year}`;
  }
  return chosenDate;
}
