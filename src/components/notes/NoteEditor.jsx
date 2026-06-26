import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NoteEditor = ({ note, onClose, onEdit, onDelete }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [body, setBody] = useState(note?.body || "");
  const saveTimer = useRef(null);
  const bodyRef = useRef(null);

  // auto-save 600ms after last keystroke
  useEffect(() => {
    if (!note) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onEdit(note.id, { title, body });
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [title, body]);

  useEffect(() => {
    bodyRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#1C1C1E" }}
    >
      {/* header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4"
        style={{ borderBottom: "0.5px solid #2C2C2E" }}>
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
          Notes
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { onDelete(note.id); onClose(); }}
          style={{ color: "#FF453A", fontSize: "14px" }}
        >
          Delete
        </motion.button>
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
          Auto-saving…
        </span>
      </div>
    </motion.div>
  );
};

export default NoteEditor;