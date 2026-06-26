import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useNotes from "../hooks/useNotes";
import NoteCard from "../components/notes/NoteCard";
import NoteEditor from "../components/notes/NoteEditor";

const NotesPage = ({ user, triggerNew, onTriggerDone }) => {
  const { notes, loading, createNote, removeNote, editNote, togglePin } = useNotes(user.uid);
  const [search, setSearch] = useState("");
  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    if (triggerNew) {
      handleNew();
      onTriggerDone();
    }
  }, [triggerNew]);

  const handleNew = async () => {
    const id = await createNote();
    setTimeout(() => {
      setActiveNote({ id, title: "", body: "", pinned: false });
    }, 300);
  };

  const filtered = notes.filter((n) => {
    const q = search.toLowerCase();
    return n.title?.toLowerCase().includes(q) || n.body?.toLowerCase().includes(q);
  });

  const pinned = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);

  return (
    <>
      <div className="min-h-screen px-5 pb-32" style={{ background: "#1C1C1E" }}>
        {/* header */}
        <div className="pt-16 pb-4">
          <h1
            className="text-[32px] font-bold text-white tracking-tight"
            style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
          >
            Notes
          </h1>
        </div>

        {/* search */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6"
          style={{ background: "#2C2C2E" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#636366" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-white text-[15px] outline-none w-full placeholder:text-[#636366]"
          />
        </div>

        {/* loading */}
        {loading && (
          <div className="flex justify-center pt-20">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-3xl"
            >
              📝
            </motion.div>
          </div>
        )}

        {/* empty state */}
        {!loading && notes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center pt-24 gap-3"
          >
            <span className="text-5xl">📝</span>
            <p className="text-white font-semibold text-[17px]">No notes yet</p>
            <p className="text-[14px]" style={{ color: "#636366" }}>
              Tap + to create your first note
            </p>
          </motion.div>
        )}

        {/* pinned section */}
        {pinned.length > 0 && (
          <div className="mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#636366" }}>
              Pinned
            </p>
            <div style={{ columns: "2", columnGap: "12px" }}>
              <AnimatePresence>
                {pinned.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={removeNote}
                    onPin={togglePin}
                    onClick={() => setActiveNote(note)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* all notes section */}
        {unpinned.length > 0 && (
          <div>
            {pinned.length > 0 && (
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#636366" }}>
                Notes
              </p>
            )}
            <div style={{ columns: "2", columnGap: "12px" }}>
              <AnimatePresence>
                {unpinned.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={removeNote}
                    onPin={togglePin}
                    onClick={() => setActiveNote(note)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* editor overlay */}
      <AnimatePresence>
        {activeNote && (
          <NoteEditor
            note={activeNote}
            onClose={() => setActiveNote(null)}
            onEdit={editNote}
            onDelete={removeNote}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default NotesPage;