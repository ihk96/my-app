export function dateYearMonthGap(from: Date, to: Date) {
  const years = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 30 * 12));
  const months = Math.floor(((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 30)) % 12);
  return { years, months };
}

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function addYears(date: Date, years: number) { 
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

export function addHours(date: Date, hours: number) {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

export function sameDay(date1: Date, date2: Date) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}


export function convertLocalDateTimeString(date: Date) : string {
  const str = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return str;
}

export function weekdayNumberToString(weekday: number): ("Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday") {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekdays[weekday] as ("Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday");
}

export function weekdayStringToNumber(weekday: string): number {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekdays.indexOf(weekday);
}