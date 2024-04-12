'use client'

import { useRef, useEffect, useState } from 'react'
import { calcCalendarDays } from "../lib/calcDays"
import DayOption from './DayOption'
import type { calendarEventProps } from "../page"
import EventPopup from './eventPopup'

// create dynamic dates based on current year forward
const yearData: Number[] = []
yearData.push(Number(new Date().getFullYear()))
for (let i=1; i<20; i++) {
  yearData.push(Number(yearData[0]) +i)
}  

const monthData = [
  "January", "February", "March", "April", 
  "May", "June", "July", "August", "September",
  "October", "November", "December"
]

type calendarProps = {
  eventItems: calendarEventProps[],
  setEventItems: (args: calendarEventProps[]) => void,
}

export default function Calendar(
  { eventItems, setEventItems }: calendarProps) {

  const monthSelect = useRef<HTMLSelectElement>(null);
  const yearSelect = useRef<HTMLSelectElement>(null);
  const [calendarData, setCalendarData] = useState<Date[]>([])
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // on mount render current month days
  useEffect(() => {
    // set current month 
    setCalendarData(calcCalendarDays(monthSelect.current!.value, yearSelect.current!.value));
  }, [])

  function showHideCalendarMonths() {
    // on change year or month gets updated
    // need to render new calendar by adding new days to calendar data state
    setCalendarData(calcCalendarDays(monthSelect.current!.value, yearSelect.current!.value))
  }

  return (
    <div className="calendar-wrap" id="datepicker-container">
      <div className="calendar">
        <EventPopup 
          popupIsVisible={popupIsVisible} 
          setPopupIsVisible={setPopupIsVisible}
          selectedDate={selectedDate}
          setEventItems={setEventItems}
        />
        <div className="cal-header">

          <div className="cal-dates">
            <span className="cal-year">Year: 
              <select ref={yearSelect} onChange={() => showHideCalendarMonths()}>
                {
                  yearData.map(year => (
                    <option 
                      key={year.toString()} 
                      value={year.toString()}>
                      {year.toString()}
                    </option>
                  ))
                }
              </select>
            </span>
            <span className="cal-month">Month: 
              <select 
                ref={monthSelect} 
                defaultValue={new Date().getMonth()} 
                onChange={() => showHideCalendarMonths()}>
                {
                  monthData.map((month, i) => (
                    <option
                      key={month} 
                      value={i}>
                      {month}
                    </option>
                  ))
                }
              </select>
            </span>
          </div>

          <div className="cal-row">
            <div className="day">Mon</div>
            <div className="day">Tue</div>
            <div className="day">Wed</div>
            <div className="day">Thu</div>
            <div className="day">Fri</div>
            <div className="day">Sat</div>
            <div className="day">Sun</div>
          </div>
        </div>

        <div className="cal-days-wrap" data-month={monthSelect.current?.value} data-year={yearSelect.current?.value} >
        {
          calendarData.map((day, i) => (
            <DayOption 
              key={i}
              monthSelect={monthSelect.current}
              day={day}
              eventItems={eventItems}
              setPopupIsVisible={setPopupIsVisible}
              setSelectedDate={setSelectedDate}
            />
          ))
        }
        </div>
      </div>
    </div>
  )
}
