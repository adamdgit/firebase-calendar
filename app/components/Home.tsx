'use client'

import { useEffect, useState } from "react";
import Calendar from "./Calendar";
import Navbar from "./Navbar";
import UserEvents from "./UserEvents";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import UpdateMessage from "./UpdateMessage";
import { User, getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { UserRecord } from "firebase-admin/auth";

export type firebaseEventObj = {
  id: string,
  author: string,
  title: string,
  datetime: number, // milliseconds
  description: string
};

export default function Home({ currentUser } : { currentUser: UserRecord | null }) {

  const [userData, setUserData] = useState<UserRecord | null>(currentUser);

  const [eventItems, setEventItems] = useState<firebaseEventObj[]>([]);
  const [message, setMessage] = useState("");
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [currYear, setCurrYear] = useState(new Date().getFullYear());
  const [currMonth, setCurrMonth] = useState(new Date().getMonth());
  // currMonth returns a number, monthMap maps the number to the word
  const [monthMap] = useState([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]);

  async function getUserEvents() {
    // Only want to fetch events for selected month
    const firstDayOfMonth = new Date(currYear, currMonth, 1);
    const lastDayOfMonth = new Date(currYear, currMonth + 1, 0);

    try {
      const docRef = await getDocs(query(collection(db, "events"),
        where('author', '==', userData?.email),
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

  // on mount check if the user is already logged in
  useEffect(() => {
    onAuthStateChanged(auth, async (userCred) => {
      // if user exists, set user data
      if (!userCred) {
        setUserData(null);
      }
    });
  },[])

  // if user is logged in, get events from firebase
  useEffect(() => {
    if (!userData) return
    getUserEvents();
  },[currMonth, currYear, userData]);

  return (
    <main className="page-wrap">
      {userData ? 
        <>
          <div className="events">
            <h3>Events for {monthMap[currMonth]} {currYear}:</h3><br/>
            <UserEvents 
              setEventItems={setEventItems}
              eventItems={eventItems}
              setNeedsUpdate={setNeedsUpdate}
              setMessage={setMessage}
            />
          </div>
          <Calendar 
            eventItems={eventItems}
            setEventItems={setEventItems}
            setCurrYear={setCurrYear}
            currYear={currYear}
            setCurrMonth={setCurrMonth}
            currMonth={currMonth}
            setNeedsUpdate={setNeedsUpdate}
            setMessage={setMessage}
          />
          <UpdateMessage 
            message={message}
            needsUpdate={needsUpdate}
            setNeedsUpdate={setNeedsUpdate}
          />
        </>
        :
        <p style={{textAlign: 'center', marginTop: '1rem'}}>Please login to use this app.</p>
      }
    </main>
  );
}
