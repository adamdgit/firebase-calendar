// sets hour and minute options for the html select dropdown
export function setDropDownValues() {
  const hourValues: string[] = [
    "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", 
    "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"
  ];

  const hourReadable: string[] = [
    "12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", 
    "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"
  ];

  const minuteValues: string[] = [];

  for (let i = 0; i < 60; i++) {
    if (i < 10) {
      minuteValues.push(`0${i}`)
    }
    else {
      minuteValues.push(i.toString())
    }
  }
  return [minuteValues, hourValues, hourReadable];
}
