'use client'

import EventItem from "./EventItem";
import type { firebaseEventObj } from "./Home";

type lsItemsProps = {
  eventItems: firebaseEventObj[],
  setEventItems: (args: firebaseEventObj[]) => void,
  setNeedsUpdate: (args: boolean) => void,
  setMessage: (args: string) => void
}

export default function UserEvents({ eventItems, setEventItems, setNeedsUpdate, setMessage }
  : lsItemsProps) {
  // get current year and months via first event date.
  // events are retrieved from firebase based on selected month only

  return (
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
  )
}
