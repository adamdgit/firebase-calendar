// Converts selected date and time to javascript friendly format for Date() method
export function fixDateFormat(selectedDate: string, hours: string, mins: string) {
  // Javascript date offical spec: YYYY-MM-DDTHH:mm:ss.sssZ
  // selectedDate = MM/DD/YYY
  let fixedDate = selectedDate.split("/")[2] + "-" 
  + selectedDate.split("/")[0] + "-"
  + selectedDate.split("/")[1];
  let dateTime = fixedDate + "T" + hours + ":" + mins + ":00+10:00" // +10 for sydney
  return dateTime
};