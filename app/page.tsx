'use client'

import { useState } from "react";
import Calendar from "./components/Calendar";
import Navbar from "./components/Navbar";
import UserEvents from "./components/UserEvents";

export type calendarEventProps = {
  id: string,
  date: string,
  time: string,
  description: string,
  authorEmail: string
}

// TODO: get events only for a given month
const temp = [
  {
    id: "1",
    date: "04/12/2024",
    time: "15:00:00",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem, nostrum repudiandae est at eos itaque ipsum nihil aperiam voluptate rerum suscipit laborum impedit quos labore nisi harum, voluptates optio quisquam!",
    authorEmail: "adammdemol@gmail.com"
  },
  {
    id: "2",
    date: "04/01/2024",
    time: "01:30:00",
    description: "test 2",
    authorEmail: "adammdemol@gmail.com"
  },
  {
    id: "3",
    date: "04/01/2024",
    time: "06:30:00",
    description: "test 3",
    authorEmail: "adammdemol@gmail.com"    
  }
]

export default function Home() {

  const [eventItems, setEventItems] = useState<calendarEventProps[]>(temp);
  const [updateMsg, setUpdateMsg] = useState("");
  const [needsUpdate, setNeedsUpdate] = useState(false);

  return (
    <>
      <Navbar />
      <main className="page-wrap">
        <div className="events">
          <h3>This months events:</h3>
          <UserEvents 
            setEventItems={setEventItems}
            eventItems={eventItems}
          />
        </div>
        <div className="calendar-wrap">
          <Calendar 
            eventItems={eventItems}
            setEventItems={setEventItems}
          />
        </div>
      </main>
    </>
  );
}
