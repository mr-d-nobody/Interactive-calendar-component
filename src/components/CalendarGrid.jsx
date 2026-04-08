import { format, isSameMonth } from "date-fns"

export default function CalendarGrid({
  days,
  currentDate,
  handleClick,
  hoverHandlers,
  getClass
}) {
  return (
    <>
      <div className="grid grid-cols-7 text-center text-sm font-medium mb-2">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map(day => {
          const isCurrent = isSameMonth(day, currentDate)
          const isWeekend = day.getDay() === 0 || day.getDay() === 6

          return (
            <div
              key={day}
              onClick={() => handleClick(day)}
              onMouseEnter={() => hoverHandlers.enter(day)}
              onMouseLeave={() => hoverHandlers.leave()}
              className={`p-2 cursor-pointer transition ${
                getClass(day)
              } ${!isCurrent ? "text-gray-500" : ""} ${
                isWeekend ? "text-red-400" : ""
              }`}
            >
              {format(day, "d")}
            </div>
          )
        })}
      </div>
    </>
  )
}