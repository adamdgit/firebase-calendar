'use client'

import { useEffect, useState } from "react";
import Calendar from "./components/Calendar";
import Navbar from "./components/Navbar";
import UserEvents from "./components/UserEvents";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./lib/config";

export type firebaseEventObj = {
  id: string,
  author: string,
  title: string,
  datetime: number, // milliseconds
  description: string
};

export default function Home() {

  const [eventItems, setEventItems] = useState<firebaseEventObj[]>([]);
  const [updateMsg, setUpdateMsg] = useState("");
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [currYear, setCurrYear] = useState(new Date().getFullYear());
  const [currMonth, setCurrMonth] = useState(new Date().getMonth());

  async function getUserEvents() {
    // Only want to fetch events for selected month
    const firstDayOfMonth = new Date(currYear, currMonth, 1);
    const lastDayOfMonth = new Date(currYear, currMonth + 1, 0);

    try {
      const docRef = await getDocs(query(collection(db, "events"),
        where('author', '==', 'adammdemol@gmail.com'),
        where('datetime', '>=', firstDayOfMonth),
        where('datetime', '<=', lastDayOfMonth)
      ));

      const tempData: firebaseEventObj[] = [];
      docRef.forEach(doc => {
        // iterate over each document and add the correct data
        tempData.push({
          id: doc.id,
          author: doc.data().author,
          title: doc.data().title,
          datetime: doc.data().datetime.seconds * 1000,
          description: doc.data().description
        });
      });
      setEventItems(tempData);
    } catch (err) {
      console.error(err);
    }
  };

  // on mount, get users documents from firebase
  useEffect(() => {
    getUserEvents();
  },[currMonth, currYear]);

  return (
    <>
      <Navbar />
      <main className="page-wrap">
        <div className="events">
          <UserEvents 
            setEventItems={setEventItems}
            eventItems={eventItems}
          />
        </div>
        <Calendar 
          eventItems={eventItems}
          setEventItems={setEventItems}
          setCurrYear={setCurrYear}
          currYear={currYear}
          setCurrMonth={setCurrMonth}
          currMonth={currMonth}
        />
      </main>
    </>
  );
}
