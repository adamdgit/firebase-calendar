'use client'

import { useEffect, useState } from "react";
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

  // currMonth returns a number, monthMap maps the number to the month
  const [monthMap] = useState([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]);
  const [dayWrappers, setDayWrappers] = useState<string[]>();

  useEffect(() => {
    // use set to remove duplicates, use the days to group events by day
    setDayWrappers([...new Set(eventItems.map(item => {
      return new Date(item.datetime).getDate().toString();
    }))]);
  },[eventItems])

  return (
    <div className="events">
      <h3>{eventItems.length > 0 ? `${eventItems.length} Events for ${monthMap[currMonth]} ${currYear}`: `Your calendar for ${monthMap[currMonth]} ${currYear} is empty`}</h3><br/>
      <div className="event-items-wrap">
        {
          dayWrappers?.map(day => {
            return <div key={day} className="day-wrapper">
            <span className="day-title">
              {new Date(`${currMonth+1}-${day}-${currYear}`)
              .toLocaleDateString("en-au", {day: 'numeric', weekday: 'long'}).toString()}
            </span>
            {
              eventItems.sort((a,b) => a.datetime - b.datetime).map(item => {
                if (day === new Date(item.datetime).getDate().toString()) {
                  return <EventItem 
                    key={item.id} 
                    item={item} 
                    eventItems={eventItems}
                    setEventItems={setEventItems} 
                    setNeedsUpdate={setNeedsUpdate}
                    setMessage={setMessage}
                  /> 
                }} 
              )
            }
          </div>
          })
        }
      </div>
    </div>
  )
}
