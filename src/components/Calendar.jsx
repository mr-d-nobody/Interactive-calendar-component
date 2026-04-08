import { useState, useEffect } from "react"
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isSameDay
} from "date-fns"

import Clock from "./Clock"
import NotesPanel from "./NotesPanel"
import CalendarGrid from "./CalendarGrid"

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [now, setNow] = useState(new Date())

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [hoverDate, setHoverDate] = useState(null)

  const [notes, setNotes] = useState([])
  const [input, setInput] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState("")

  // clock
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // load notes
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("calendar-notes") || "[]")
    setNotes(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem("calendar-notes", JSON.stringify(notes))
  }, [notes])

  const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })

  function handleClick(day) {
    setError("")

    if (startDate && !endDate && isSameDay(day, startDate)) {
      setStartDate(null)
      return
    }

    if (startDate && endDate && isSameDay(day, startDate) && isSameDay(day, endDate)) {
      setStartDate(null)
      setEndDate(null)
      return
    }

    if (!startDate || (startDate && endDate)) {
      setStartDate(day)
      setEndDate(null)
    } else if (day < startDate) {
      setStartDate(day)
    } else if (isSameDay(day, startDate)) {
      setStartDate(null)
    } else {
      setEndDate(day)
    }
  }

  function saveNote() {
    if (!startDate && !endDate) {
      setError("Select at least one date.")
      return
    }

    if (!input.trim()) {
      setError("Note cannot be empty.")
      return
    }

    const start = startDate || endDate
    const end = endDate || startDate

    if (editingId) {
      setNotes(notes.map(n =>
        n.id === editingId ? { ...n, text: input, start, end } : n
      ))
      setEditingId(null)
    } else {
      const newNote = {
        id: Date.now(),
        text: input,
        start,
        end
      }
      setNotes([newNote, ...notes])
    }

    setInput("")
    setError("")
  }

  function editNote(note) {
    setInput(note.text)
    setEditingId(note.id)
    setStartDate(new Date(note.start))
    setEndDate(new Date(note.end))
  }

  function deleteNote(id) {
    setNotes(notes.filter(n => n.id !== id))
  }

  function getClass(day) {
    if (startDate && isSameDay(day, startDate))
      return "bg-blue-500 text-white rounded-l-full"

    if (endDate && isSameDay(day, endDate))
      return "bg-blue-500 text-white rounded-r-full"

    if (startDate && endDate && day > startDate && day < endDate)
      return "bg-blue-900/40"

    if (startDate && hoverDate && !endDate && day >= startDate && day <= hoverDate)
      return "bg-blue-900/30"

    return "hover:bg-gray-700"
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  function prevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  return (
    <div className="text-gray-100 p-6">

      <div className="max-w-6xl mx-auto bg-gray-800 shadow-xl rounded-xl overflow-hidden">

        
        <div className="relative h-60">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-4 right-4 text-white">
            <h2 className="text-2xl font-bold">{format(currentDate, "MMMM")}</h2>
            <p>{format(currentDate, "yyyy")}</p>
          </div>

          <div
            className="absolute bottom-0 w-full h-16 bg-gray-800"
            style={{ clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 100%)" }}
          />
        </div>

        <div className="flex flex-col md:flex-row p-4 gap-6">

          {/* LEFT */}
          <div className="md:w-1/3 space-y-4">

            <Clock now={now} />

            <NotesPanel
              input={input}
              setInput={setInput}
              saveNote={saveNote}
              notes={notes}
              editNote={editNote}
              deleteNote={deleteNote}
              error={error}
              editingId={editingId}
            />

          </div>

          
          <div className="md:w-2/3">

            <div className="flex justify-between items-center mb-3">
              <button onClick={prevMonth}>←</button>
              <h2 className="font-semibold">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <button onClick={nextMonth}>→</button>
            </div>

            <CalendarGrid
              days={days}
              currentDate={currentDate}
              handleClick={handleClick}
              getClass={getClass}
              hoverHandlers={{
                enter: (d) => setHoverDate(d),
                leave: () => setHoverDate(null)
              }}
            />

          </div>

        </div>
      </div>
    </div>
  )
}