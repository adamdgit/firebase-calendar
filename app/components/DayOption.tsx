'use client'

import { useEffect, useMemo, useState } from "react";
import type { firebaseEventObj } from "../page"

type dayOptionProps = {
  day: Date,
  monthSelect: number,
  eventItems: firebaseEventObj[],
  setPopupIsVisible: (args: boolean) => void,
  setSelectedDate: (args: string) => void,
  selectedDate: string
}

export default function DayOption(
  { day, monthSelect, eventItems, setPopupIsVisible, setSelectedDate, selectedDate } 
  : dayOptionProps) {

  // number of events for this day 
  const [numEvents, setNumEvents] = useState(0);
  const [active, setActive] = useState(false);

  const handlePopup = (e: any) => {
    setPopupIsVisible(true);
    setSelectedDate(e.target.value)
  }

  // allows only one date to be highlighted at a time based on user selection
  useEffect(() => {
    if (new Date(day).toLocaleString('en-au', { day: '2-digit', month: '2-digit', year: '2-digit' })
      === new Date(selectedDate).toLocaleString('en-au', { day: '2-digit', month: '2-digit', year: '2-digit' })) 
    {
      setActive(true);
    } else {
      setActive(false)
    }
  },[selectedDate])

  useMemo(() => {
    // calculate number of items for each day
    let count = 0
    eventItems.map(item => {
      if (new Date(item.datetime).toLocaleString('en-au', { day: '2-digit', month: '2-digit', year: '2-digit' }) 
        === new Date(day).toLocaleString('en-au', { day: '2-digit', month: '2-digit', year: '2-digit' })) {
        count += 1
      }
    })
    setNumEvents(count)
  },[eventItems, day])

  return (
    <div style={active ? { position: 'relative', zIndex: '9999999' } : { position: 'relative' }}>
      <div 
        className="event-num"
        style={numEvents === 0 ? {display: 'none'} : {display: 'flex'}}>
        {numEvents === 0 ? null : numEvents}
      </div>
      <button
        onClick={(e) => handlePopup(e)}
        className={
          day.toLocaleString('en-us', { day: '2-digit', month: '2-digit', year: 'numeric' }) === new Date().toLocaleString('en-us', { day: '2-digit', month: '2-digit', year: 'numeric' }) ? "date today"
        : day.getMonth() === Number(monthSelect) ? "date"
        : "date notCurrentMonth"
        } 
        value={day.toLocaleString('en-us', { day: '2-digit', month: '2-digit', year: 'numeric' })}>
        {day.toLocaleString('en-us', { day: 'numeric' })}
      </button>
    </div>
  )
}
