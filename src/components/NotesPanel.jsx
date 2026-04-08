import { format } from "date-fns"

export default function NotesPanel({
  input,
  setInput,
  saveNote,
  notes,
  editNote,
  deleteNote,
  error,
  editingId
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Notes</h3>

      {error && (
        <div className="text-red-400 text-sm bg-red-900/30 p-2 rounded">
          {error}
        </div>
      )}

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Select a date or range, then write note..."
        className="w-full border border-gray-600 bg-gray-700 text-white rounded p-2 text-sm"
      />

      <button
        onClick={saveNote}
        className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
      >
        {editingId ? "Update Note" : "Save Note"}
      </button>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {notes.map(note => (
          <div key={note.id} className="bg-gray-700 border border-gray-600 p-2 rounded text-sm">
            <div className="text-xs text-gray-400 mb-1">
              {format(new Date(note.start), "d MMM")} →{" "}
              {format(new Date(note.end), "d MMM")}
            </div>

            <div className="mb-1">{note.text}</div>

            <div className="flex gap-2 text-xs">
              <button onClick={() => editNote(note)} className="text-blue-400">
                Edit
              </button>
              <button onClick={() => deleteNote(note.id)} className="text-red-400">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}