import { format } from "date-fns"

export default function Clock({ now }) {
  return (
    <div className="bg-gray-700 p-3 rounded text-center">
      <div className="text-lg font-semibold">
        {format(now, "hh:mm:ss a")}
      </div>
      <div className="text-sm text-gray-300">
        {format(now, "EEEE, dd MMM yyyy")}
      </div>
    </div>
  )
}