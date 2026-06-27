import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NoteEditor = ({ note, onClose, onEdit, onDelete }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [body, setBody] = useState(note?.body || "");
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef(null);
  const bodyRef = useRef(null);

  // auto-save 600ms after last keystroke
  useEffect(() => {
    if (!note) return;
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onEdit(note.id, { title, body });
      setSaved(true);
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [title, body]);

  useEffect(() => {
    bodyRef.current?.focus();
  }, []);

  const handleManualSave = () => {
    clearTimeout(saveTimer.current);
    onEdit(note.id, { title, body });
    setSaved(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#1C1C1E" }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between px-5 pt-14 pb-4"
        style={{ borderBottom: "0.5px solid #2C2C2E" }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="flex items-center gap-1"
          style={{ color: "#007AFF", fontSize: "16px" }}
        >
          <svg width="10" height="16" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9l8 8" stroke="#007AFF" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Note
        </motion.button>

        <div className="flex items-center gap-4">
          {/* manual save button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleManualSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{
              background: saved ? "#1C3A2A" : "#1C2F3A",
              border: `0.5px solid ${saved ? "#30D158" : "#007AFF"}`,
            }}
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.svg
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="#30D158" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="save"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </motion.svg>
              )}
            </AnimatePresence>
            <span
              className="text-[13px] font-medium"
              style={{ color: saved ? "#30D158" : "#007AFF" }}
            >
              {saved ? "Saved" : "Save"}
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { onDelete(note.id); onClose(); }}
            style={{ color: "#FF453A", fontSize: "14px" }}
          >
            Delete
          </motion.button>
        </div>
      </div>

      {/* editor body */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-32">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-white text-[22px] font-bold mb-3 outline-none placeholder:text-[#48484A]"
          style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
        />
        <textarea
          ref={bodyRef}
          placeholder="Start typing…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full bg-transparent text-[16px] outline-none resize-none leading-relaxed placeholder:text-[#48484A]"
          style={{
            color: "#AEAEB2",
            minHeight: "60vh",
            fontFamily: "-apple-system, 'SF Pro Text', Inter, sans-serif",
          }}
        />
      </div>

      {/* bottom hint */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <span className="text-[12px]" style={{ color: "#48484A" }}>
          {saved ? "All changes saved" : "Auto-saving…"}
        </span>
      </div>
    </motion.div>
  );
};

export default NoteEditor;