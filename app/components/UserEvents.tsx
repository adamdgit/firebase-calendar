'use client'

import { useMemo, useState } from "react";
import EventItem from "./EventItem";
import type { calendarEventProps } from "../page"

type lsItemsProps = {
  eventItems: calendarEventProps[],
  setEventItems: (args: calendarEventProps[]) => void
}

export default function UserEvents({ eventItems, setEventItems } : lsItemsProps) {

  // get current year and months via first event date.
  // events are retrieved from firebase based on selected month only
  const currentMonth = new Date(eventItems[0]
    .date).toLocaleString('en-us', { month: 'long', year: 'numeric' })
  
  return (
    <div className="event-items-wrap">
      <h3>Events for {currentMonth}:</h3>
      {
        eventItems?.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        .map((item, i) => 
          <EventItem 
            key={item.id} 
            item={item} 
            setEventItems={setEventItems} 
          />
        )
      }
    </div>
  )
}
