'use client'

import { useMemo, useState } from "react";
import EventItem from "./EventItem";
import type { calendarEventProps } from "../page"

type lsItemsProps = {
  eventItems: calendarEventProps[],
  setEventItems: (args: calendarEventProps[]) => void
}

export default function UserEvents({ eventItems, setEventItems } : lsItemsProps) {
  
  const [months, setMonths] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  useMemo(() => {

    let tempMonths:string[] = [];
    eventItems.map(item => {
      tempMonths.push(new Date(item.date).toLocaleString('en-au', {month: 'long', year: 'numeric'}))
    });
    // remove duplicates using set and spread operator
    setMonths([...new Set(tempMonths)]);

    let tempYears:string[] = [];
    eventItems.map(item => {
      tempYears.push(new Date(item.date).toLocaleString('en-au', {year: 'numeric'}))
    });
    // remove duplicates using set and spread operator
    setYears([...new Set(tempYears)]);

  }, [eventItems]);

  return (
    <div className="event-items-wrap">
    {
      years.map(year => (
        <div key={year} className="event-year">
          <h3>{year}</h3>
          {
          months?.sort((a, b) => Date.parse(a) - Date.parse(b)).map(month => 
            new Date(month).toLocaleString('en-au', {year: 'numeric'}) === year ? 
            <div key={month} className="event-month">
              <h4>{month}</h4>
              {
                eventItems?.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
                .map((item, i) => 
                  new Date(item.date).toLocaleString('en-au', {month: 'long', year: 'numeric'}) === month ? 
                    <EventItem 
                      key={item.id} 
                      item={item} 
                      setEventItems={setEventItems} 
                    />
                  : null
                )
              }
            </div> : null
          )
          }
        </div>
      ))
    }
    </div>
  )
}
