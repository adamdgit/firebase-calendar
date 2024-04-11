export default function Tooltip( props: { message: string, name: string }) {
  return (
    <div className={props.name === "edit" ? "edit-tooltip" 
    : props.name === "remove" ? "remove-tooltip" : ""}>
      <div className="arrow-up"></div>
      {props.message}
    </div>
  )
}
