'use client'

import { useState } from "react"
import type { calendarEventProps } from "../page"

type eventPopupProps = {
  popupIsVisible: boolean,
  setPopupIsVisible: (args: boolean) => void,
  selectedDate: string,
  setEventItems: (args: calendarEventProps[]) => void
}

export default function EventPopup(
  { popupIsVisible, setPopupIsVisible, selectedDate, setEventItems } 
  : eventPopupProps ) {

  const [description, setDescription] = useState<string>('')

  async function insertEventToDatabase() {
    //setEventItems()
  };
  
  return (
    <div className={popupIsVisible ? "event-popup is-visible" : "event-popup"}>
      <div className="arrow-up arrow-popup"></div>
      <span className="event-heading">Add new event</span>
      <button className="btn-close-popup" onClick={() => setPopupIsVisible(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" width={"20px"} height={"20px"} viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>
      </button>
      <span className="popup-heading">Selected date: {selectedDate}</span>
      <span>Selected time: </span>
      <span>Event info: </span>
      <textarea onChange={(e) => setDescription(e.target.value)}></textarea>
      <button className="btn-submit" onClick={() => insertEventToDatabase()}>Create event</button>
    </div>
  )
};
