
// populate body of calendar with accurate days of selected month & year
export function calcCalendarDays(
  monthSelect: number, 
  yearSelect: number) {

  const data: Date[] = []; 
  // Date variables to calculate previous, current and next months dates
  let selectedMonth = Number(monthSelect);
  let selectedYear = Number(yearSelect);
  let currentMonth = new Date(selectedYear, selectedMonth, 1);
  let firstDayPrevMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  // getDay() returns day as int 0=sun, 1=mon.. 6=sat etc
  let firstDayMonth = new Date(selectedYear, selectedMonth, 1, 0).getDay();
  // Sunday is counted as 0, must convert to 7 for calculations below
  if (firstDayMonth == 0) { firstDayMonth = 7; }
  let calc = (firstDayPrevMonth + 1) - (firstDayMonth - 1);
  let prevMonth = new Date(selectedYear, selectedMonth - 1, calc);
  let lastDayMonth = new Date(selectedYear, selectedMonth + 1, 0).getDay();
  let nextMonth = new Date(selectedYear, selectedMonth + 1, 1);

  // show some days from previous month
  for (let i = (firstDayPrevMonth + 1) - firstDayMonth; i < firstDayPrevMonth; i++) {
    let prevMonthDays = new Date(prevMonth);
    prevMonth.setDate(prevMonth.getDate() + 1);
    data.push(prevMonthDays);
  }
  // current month calc
  while (currentMonth.getMonth() === selectedMonth) {
    let currentMonthDay = new Date(currentMonth);
    currentMonth.setDate(currentMonth.getDate() + 1);
    data.push(currentMonthDay);
  }
  // show some days from next month
  for (let i = 1; i <= 7 - lastDayMonth; i++) {
    let nextMonthDays = new Date(nextMonth);
    nextMonth.setDate(nextMonth.getDate() + 1);
    data.push(nextMonthDays);
  }

  return data;
}
