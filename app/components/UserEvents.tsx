'use client'

import EventItem from "./EventItem";
import type { firebaseEventObj } from "../page"

type lsItemsProps = {
  eventItems: firebaseEventObj[],
  setEventItems: (args: firebaseEventObj[]) => void
}

let currentMonth: String;

export default function UserEvents({ eventItems, setEventItems } : lsItemsProps) {
  // get current year and months via first event date.
  // events are retrieved from firebase based on selected month only
  eventItems.length < 1 ? null : currentMonth = new Date(eventItems[0].datetime).toLocaleString('en-us', { month: 'long', year: 'numeric' })

  return (
    <div className="event-items-wrap">
      <h3>Events for {currentMonth}:</h3>
      {
        eventItems.sort((a,b) => a.datetime - b.datetime).map((item, i) => 
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
