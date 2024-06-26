'use client'

import { useEffect, useState } from 'react'
import { calcCalendarDays } from "../lib/calcDays"
import DayOption from './DayOption'
import type { firebaseEventObj } from "./Home";
import { UserRecord } from 'firebase-admin/auth';
import EventPopup from './EventPopup';

// create dynamic dates based on current year forward
const yearData: Number[] = []
yearData.push(Number(new Date().getFullYear()))
for (let i=1; i<10; i++) {
  yearData.push(Number(yearData[0]) +i)
}  

const monthData = [
  "January", "February", "March", "April", 
  "May", "June", "July", "August", "September",
  "October", "November", "December"
]

type calendarProps = {
  eventItems: firebaseEventObj[],
  setEventItems: (args: firebaseEventObj[]) => void,
  setCurrYear: (args: number) => void,
  currYear: number,
  setCurrMonth: (args: number) => void,
  currMonth: number,
  setNeedsUpdate: (args: boolean) => void,
  setMessage: (args: string) => void,
  userData: UserRecord | null
}

export default function Calendar(
  { eventItems, setEventItems, setCurrYear, currYear, setCurrMonth, currMonth, setNeedsUpdate, setMessage, userData }
  : calendarProps) {

  const [calendarData, setCalendarData] = useState<Date[]>([])
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // on mount render current month days
  useEffect(() => {
    // set current month 
    setCalendarData(calcCalendarDays(currMonth, currYear));
  }, [])

  // whenever popup is visible, prevent mouse events for other elements
  useEffect(() => {
    if (popupIsVisible) {
      document.querySelector('body')!.style.pointerEvents = 'none';
    } else {
      document.querySelector('body')!.style.pointerEvents = 'all';
    }
  },[popupIsVisible])

  return (
    <div className="calendar-wrap" id="datepicker-container">
      <h3>Select a day to create new events.</h3><br/>
      <div className="calendar">
        <EventPopup 
          popupIsVisible={popupIsVisible} 
          setPopupIsVisible={setPopupIsVisible}
          selectedDate={selectedDate}
          eventItems={eventItems}
          setEventItems={setEventItems}
          setNeedsUpdate={setNeedsUpdate}
          setMessage={setMessage}
          userData={userData}
        />
        <div className="cal-header">
          <div className="cal-dates">
            <span className="cal-year">Year: 
              <select 
                onChange={(e) => {
                  setCalendarData(calcCalendarDays(currMonth, Number(e.target.value))), 
                  setCurrYear(Number(e.target.value))
                }}>
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
                defaultValue={new Date().getMonth()} 
                onChange={(e) => {
                  setCalendarData(calcCalendarDays(Number(e.target.value), currYear)), 
                  setCurrMonth(Number(e.target.value))
                }}>
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

        <div className="cal-days-wrap" data-month={currMonth} data-year={currYear} >
        {
          calendarData.map(day => (
            <DayOption 
              key={day.getTime()}
              monthSelect={currMonth}
              day={day}
              eventItems={eventItems}
              setPopupIsVisible={setPopupIsVisible}
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
            />
          ))
        }
        </div>
      </div>
    </div>
  )
}
