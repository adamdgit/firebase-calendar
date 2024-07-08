import { screen, render } from "@testing-library/react"; 
import UserEvents from "../UserEvents";

const mockFunction = jest.fn();
const mockEvents = [{
  id: "1",
  author: "adam",
  title: "mock-title",
  datetime: new Date().getTime(),
  description: "mock-description"
}]

describe("Render", () => {

  it("renders a users calendar events from firebase", () => {

    const {container } = render(<UserEvents      
      setEventItems={mockFunction}
      eventItems={mockEvents}
      setNeedsUpdate={mockFunction}
      setMessage={mockFunction}
      currMonth={0}
      currYear={0}
    />)

    expect(container.classList.contains('events')).toBe(true)
  
  })
  
})

