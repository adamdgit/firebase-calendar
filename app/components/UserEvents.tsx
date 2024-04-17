'use client'

import { useState } from "react";
import EventItem from "./EventItem";
import type { firebaseEventObj } from "./Home";

type lsItemsProps = {
  eventItems: firebaseEventObj[],
  setEventItems: (args: firebaseEventObj[]) => void,
  setNeedsUpdate: (args: boolean) => void,
  setMessage: (args: string) => void,
  currMonth: number,
  currYear: number
}

export default function UserEvents({ eventItems, setEventItems, setNeedsUpdate, setMessage, currMonth, currYear }
  : lsItemsProps) {

  // currMonth returns a number, monthMap maps the number to the word
  const [monthMap] = useState([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]);

  return (
    <div className="events">
      <h3>{eventItems.length > 0 ? `${eventItems.length} Events for ${monthMap[currMonth]} ${currYear}`: "No events found"}</h3><br/>
      <div className="event-items-wrap">
        {
          eventItems.sort((a,b) => a.datetime - b.datetime).map((item, i) => 
            <EventItem 
              key={item.id} 
              item={item} 
              eventItems={eventItems}
              setEventItems={setEventItems} 
              setNeedsUpdate={setNeedsUpdate}
              setMessage={setMessage}
            />
          )
        }
      </div>
    </div>
  )
}
