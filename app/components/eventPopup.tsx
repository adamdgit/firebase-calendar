'use client'

import { useState } from "react"
import type { firebaseEventObj } from "../page"
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/config";

type eventPopupProps = {
  popupIsVisible: boolean,
  setPopupIsVisible: (args: boolean) => void,
  selectedDate: string,
  eventItems: firebaseEventObj[],
  setEventItems: (args: firebaseEventObj[]) => void
}

// Converts selected date and time to javascript friendly format for Date() method
const fixDateFormat = (selectedDate: string, hours: string, mins: string) => {
    // Javascript date offical spec: YYYY-MM-DDTHH:mm:ss.sssZ
    // selectedDate = MM/DD/YYY
    let fixedDate = selectedDate.split("/")[2] + "-" 
    + selectedDate.split("/")[0] + "-"
    + selectedDate.split("/")[1];
    let dateTime = fixedDate + "T" + hours + ":" + mins + ":00Z"
    return dateTime
};

export default function EventPopup(
  { popupIsVisible, setPopupIsVisible, selectedDate, eventItems, setEventItems } 
  : eventPopupProps ) {

  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState<string>('');
  const [hours, setHours] = useState('00');
  const [mins, setMins] = useState('00');

  async function addEventToFirebase() {
    const dateTime = fixDateFormat(selectedDate, hours, mins);

    const data = {
      author: "adammdemol@gmail.com",
      title: title,
      datetime: new Date(dateTime),
      description: description
    }

    try {
      const docRef = await addDoc(collection(db, "events"), data);
      // if document has been added successfully, update the events, 
      const updatedData: firebaseEventObj = {
        id: docRef.id,
        author: data.author,
        title: data.title,
        datetime: new Date(dateTime).getTime(),
        description: data.description
      };
      setEventItems([...eventItems, updatedData]);
      // reset inputs
      setHours("00");
      setMins("00");
      setDescription("");
      setPopupIsVisible(false);
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div className={popupIsVisible ? "event-popup is-visible" : "event-popup"}>
      <div className="arrow-up arrow-popup"></div>
      <span className="event-heading">Add new event</span>
      <input className="event-title" name="title" type="text" onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" />
      <button className="btn-close-popup" onClick={() => setPopupIsVisible(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" width={"20px"} height={"20px"} viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>
      </button>
      <span className="popup-date-time">
        <span className="popup-date">
          <svg width={20} height={20} fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"/></svg>
          Date: {selectedDate}
        </span>
        <span className="popup-time">
          <svg width={20} height={20} fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
          Time:
          <input name="hours" type="text" onChange={(e) => setHours(e.target.value)} placeholder="HH" />
          <input name="mins" type="text" onChange={(e) => setMins(e.target.value)} placeholder="MM" />
        </span>
      </span>

      <span>Event info: </span>
      <textarea className="popup-desc" onChange={(e) => setDescription(e.target.value)}></textarea>
      <button className="btn-submit" onClick={() => addEventToFirebase()}>Create event</button>
    </div>
  )
};
