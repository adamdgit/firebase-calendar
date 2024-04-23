import { useState } from "react";
import type { firebaseEventObj } from "./Home";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { setDropDownValues } from "../lib/setDropDownValues";
import { UserRecord } from "firebase-admin/auth";

type eventItemProps = {
  item: firebaseEventObj,
  eventItems: firebaseEventObj[], 
  setEventItems: (args: firebaseEventObj[]) => void,
  setNeedsUpdate: (args: boolean) => void,
  setMessage: (args: string) => void
}

// Converts selected date and time to javascript friendly format for Date() method
const fixDateFormat = (date: string, hours: string, mins: string) => {
  let dateTime = date + "T" + hours + ":" + mins + ":00+10:00" // +10 for sydney time
  return dateTime
};

export default function EventItem({ item, eventItems, setEventItems, setNeedsUpdate, setMessage }
  : eventItemProps) {
  // convert UTC date from firebase to australian time, split on , to get only the hours and minutes
  const formatDate = new Date(item.datetime).toLocaleDateString("en-au", { hour: '2-digit', minute: '2-digit' }).split(",")[1];

  const [editEnabled, setEditEnabled] = useState(false);
  const [desc, setDesc] = useState(item.description);
  const [title, setTitle] = useState(item.title);
  const [date, setDate] = useState(() => {
    let tmpYear = new Date(item.datetime).getFullYear().toString();
    let tmpMonth = new Date(item.datetime).getMonth() < 10 ? "0" + 
      (new Date(item.datetime).getMonth() + 1).toString() : 
      (new Date(item.datetime).getMonth() + 1).toString()
    let tempDay = new Date(item.datetime).getDate().toString();
    return tmpYear + "-" + tmpMonth + "-" + tempDay;
  });
  const [hour, setHour] = useState(new Date(item.datetime).getHours() < 10 ? 
    "0" + new Date(item.datetime).getHours().toString() : 
    new Date(item.datetime).getHours().toString());
  const [mins, setMins] = useState(new Date(item.datetime).getMinutes() < 10 ? 
    "0" + new Date(item.datetime).getMinutes().toString() : 
    new Date(item.datetime).getMinutes().toString());
  const [minuteValues, hourValues, hourReadable] = setDropDownValues();
  
  async function deleteEventByID(id: string) {
    try {
      await deleteDoc(doc(db, "events", id));

      // filter out deleted event if firebase success
      const filteredEvents = eventItems.filter(a => a.id !== id);
      setEventItems(filteredEvents);

      // send update message
      setNeedsUpdate(true);
      setMessage("Event Deleted");
    } catch (err) {
      console.error(err);
    }
  };

  async function updateEventByID(id: string, author: string) {
    const formatedDate = fixDateFormat(date, hour, mins);

    const data = {
      author: author,
      title: title,
      datetime: new Date(formatedDate),
      description: desc
    }

    setEditEnabled(false);

    try {
      await updateDoc(doc(db, "events", id), data);

      // send update message
      setNeedsUpdate(true);
      setMessage("Event Updated");

      // update the selected event if the updateDoc is successful
      const updatedEvents = eventItems.map(item => {
        if (item.id === id) {
          return {
            id: item.id,
            author: data.author,
            title: data.title,
            datetime: new Date(formatedDate).getTime(),
            description: data.description
          }
        } else {
          return item;
        }
      })

      setEventItems(updatedEvents)

    } catch (err) {
      console.error(err);
    }
  };

  // edit version of event items, when editing is on
  if (editEnabled) {
    return (
      <li className="item-wrap" style={editEnabled ? {border: '1px solid red'} : {}}>
        <div className="item-text" data-id={item.id}>
          <input className="edit-input" type="text" name="title" defaultValue={item.title} onChange={(e) => setTitle(e.target.value)} /> 
        
          <div className="item-btns">
            <button onClick={() => setEditEnabled(!editEnabled)} className="btn-edit">
              <svg width={20} height={20} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 512 512">
                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
            </button>
            <button className="btn-remove" onClick={() => deleteEventByID(item.id)}>
              <svg width={20} height={20}
                xmlns="http://www.w3.org/2000/svg"  
                viewBox="0 0 448 512">
                  <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
              </svg>
            </button>
          </div>
        </div> 
        <input className="edit-input" type="text" name="description" defaultValue={item.description} onChange={(e) => setDesc(e.target.value)} />
        <div className="edit-datetime">
          <svg width={20} height={20} fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"/></svg>
          <input className="edit-input dates" type="date" name="date" 
            defaultValue={date}
            onChange={(e) => setDate(e.target.value)} />
          <select 
            className="edit-input"
            defaultValue={hour}
            onChange={(e) => setHour(e.target.value)}>
            {hourValues.map((h, i) => {
              return <option key={h} value={h}>{hourReadable[i]}</option>
            })}
          </select>
          <select 
            className="edit-input"
            defaultValue={mins}
            onChange={(e) => setMins(e.target.value)}>
            {minuteValues.map(m => {
              return <option key={m} value={m}>{m}</option>
            })}
          </select>
        </div> 
        <div className="edit-btns">
          <button className="btn-save" onClick={() => updateEventByID(item.id, item.author)}>Save</button>
          <button className="btn-cancel" onClick={() => setEditEnabled(false)}>Cancel</button>
        </div>
      </li>
    )
  }

  // default event item, shown when not in edit mode
  if (!editEnabled) {
    return (
      <li className="item-wrap" style={editEnabled ? {border: '1px solid red'} : {}}>
        <div className="item-text" data-id={item.id}>
          <span className="item-title">{item.title}</span>

          <div className="item-btns">
            <button onClick={() => setEditEnabled(!editEnabled)} className="btn-edit">
              <svg width={20} height={20} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 512 512">
                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
            </button>
            <button className="btn-remove" onClick={() => deleteEventByID(item.id)}>
              <svg width={20} height={20}
                xmlns="http://www.w3.org/2000/svg"  
                viewBox="0 0 448 512">
                  <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
              </svg>
            </button>
          </div>
        </div> 
        <span>{item.description}</span>
        <span className="item-date">
          <svg width={20} height={20} fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"/></svg>
          {formatDate}
        </span>
      </li>
    )
  }

  // return (
  //   <li className="item-wrap" style={editEnabled ? {border: '1px solid red'} : {}}>
  //     {editEnabled ? 
  //     <span className="edit-event"><div className="arrow-left"></div>Editing</span> 
  //     : <></>}

  //     <div className="item-text" data-id={item.id}>

  //       {editEnabled ? 
  //       <input className="edit-input" type="text" name="title" defaultValue={item.title} onChange={(e) => setTitle(e.target.value)} /> 
  //       : 
  //       <span className="item-title">{item.title}</span>}
        
  //       <div className="item-btns">
  //         <button onClick={() => setEditEnabled(!editEnabled)} className="btn-edit">
  //           <svg width={20} height={20} 
  //             xmlns="http://www.w3.org/2000/svg" 
  //             viewBox="0 0 512 512">
  //             <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
  //         </button>
  //         <button className="btn-remove" onClick={() => deleteEventByID(item.id)}>
  //           <svg width={20} height={20}
  //             xmlns="http://www.w3.org/2000/svg"  
  //             viewBox="0 0 448 512">
  //               <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
  //           </svg>
  //         </button>
  //       </div>
  //     </div>

  //     {editEnabled ? 
  //     <input className="edit-input" type="text" name="description" defaultValue={item.description} onChange={(e) => setDesc(e.target.value)} /> 
  //     : 
  //     <span>{item.description}</span>}

  //     {editEnabled ? 
  //     <div className="edit-datetime">
  //       <svg width={20} height={20} fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"/></svg>
  //       <input className="edit-input dates" type="date" name="date" 
  //         defaultValue={date}
  //         onChange={(e) => setDate(e.target.value)} />
  //       <select 
  //         className="edit-input"
  //         defaultValue={hour}
  //         onChange={(e) => setHour(e.target.value)}>
  //         {hourValues.map((h, i) => {
  //           return <option key={h} value={h}>{hourReadable[i]}</option>
  //         })}
  //       </select>
  //       <select 
  //         className="edit-input"
  //         defaultValue={mins}
  //         onChange={(e) => setMins(e.target.value)}>
  //         {minuteValues.map(m => {
  //           return <option key={m} value={m}>{m}</option>
  //         })}
  //       </select>
  //     </div>
  //     : 
  //     <span className="item-date">
  //     <svg width={20} height={20} fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"/></svg>
  //       {formatDate}
  //     </span>}

  //     {editEnabled ? <button className="btn-save" onClick={() => updateEventByID(item.id)}>Save</button> : <></>}

  //   </li>
  // )
}
