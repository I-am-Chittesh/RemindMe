import { motion } from "framer-motion";
import { useState, useRef } from "react";

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#636366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const NoteCard = ({ note, onDelete, onPin, onClick }) => {
  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);
  const longPressTimer = useRef(null);
  const didLongPress = useRef(false);

  const handlePressStart = () => {
    didLongPress.current = false;
    setPressing(true);
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setPressing(false);
      onPin(note.id, note.pinned);
    }, 500);
  };

  const handlePressEnd = () => {
    clearTimeout(longPressTimer.current);
    setPressing(false);
  };

  const handleClick = () => {
    if (didLongPress.current) return;
    onClick();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: pressing ? 0.95 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22 }}
      onClick={handleClick}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      className="relative cursor-pointer rounded-2xl p-4 break-inside-avoid"
      style={{
        background: "#2C2C2E",
        border: note.pinned ? "0.5px solid #FFD60A" : "0.5px solid #3A3A3C",
        marginBottom: "12px",
      }}
    >
      {/* pin indicator */}
      {note.pinned && (
        <div className="absolute top-3 right-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#FFD60A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="17" x2="12" y2="22" />
            <path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24V17z" />
          </svg>
        </div>
      )}

      {/* delete on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovering ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        className="absolute bottom-3 right-3"
        onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
      >
        <motion.button whileTap={{ scale: 0.85 }}>
          <TrashIcon />
        </motion.button>
      </motion.div>

      {/* content */}
      {note.title ? (
        <p className="text-white font-semibold text-[15px] mb-1 pr-6 leading-snug">
          {note.title}
        </p>
      ) : null}

      {note.body ? (
        <p className="text-[13px] leading-relaxed pr-2" style={{ color: "#AEAEB2" }}>
          {note.body.length > 120 ? note.body.slice(0, 120) + "…" : note.body}
        </p>
      ) : null}

      {!note.title && !note.body && (
        <p className="text-[13px]" style={{ color: "#636366" }}>Empty note</p>
      )}
    </motion.div>
  );
};

export default NoteCard;