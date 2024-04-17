import { useEffect } from "react"

type MessageProps = {
  message: string, 
  needsUpdate: boolean, 
  setNeedsUpdate: (args: boolean) => void
}

export default function UpdateMessage({message, needsUpdate, setNeedsUpdate} : MessageProps) {

  useEffect(() => {
    setTimeout(() => {
      setNeedsUpdate(false)
    }, 2500)
  }, [needsUpdate])

  return (
    <div 
      className='message-tooltip'
      style={needsUpdate ? {opacity: '1', top: 'var(--navHeight)'} : {}}>
      {message}
    </div>
  )
}
