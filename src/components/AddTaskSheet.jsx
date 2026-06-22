import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RECURRENCE_OPTIONS = [
  { value: "none", label: "No repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const AddTaskSheet = ({ isOpen, onClose, onAdd, prefilledDate }) => {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [recurrence, setRecurrence] = useState("none");

  useEffect(() => {
    if (prefilledDate) {
      setDate(new Date(prefilledDate).toISOString().split("T")[0]);
    }
  }, [prefilledDate]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    let reminderTime = null;
    if (date && time) {
      reminderTime = new Date(`${date}T${time}`).toISOString();
    }

    onAdd({
      title: title.trim(),
      note: note.trim(),
      reminderTime,
      recurrence,
    });

    setTitle("");
    setNote("");
    setDate("");
    setTime("");
    setRecurrence("none");
    onClose();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 rounded-t-apple-xl z-50 px-5 pt-3 pb-10"
            style={{
              background: "#2C2C2E",
              borderTop: "0.5px solid #3A3A3C",
            }}
          >
            <div
              className="w-9 h-1 rounded-full mx-auto mb-5"
              style={{ background: "#3A3A3C" }}
            />

            <h2
              className="text-[17px] font-semibold text-white mb-4"
              style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
            >
              New reminder
            </h2>

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full rounded-apple px-4 py-3 text-[15px] outline-none mb-3 border border-transparent focus:border-apple-blue transition-colors text-white placeholder-apple-gray"
              style={{ background: "#3A3A3C" }}
            />

            <input
              type="text"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-apple px-4 py-3 text-[15px] outline-none mb-3 border border-transparent focus:border-apple-blue transition-colors text-white placeholder-apple-gray"
              style={{ background: "#3A3A3C" }}
            />

            <div className="flex gap-2 mb-3">
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 rounded-apple px-3 py-3 text-[14px] outline-none border border-transparent focus:border-apple-blue transition-colors text-white"
                style={{ background: "#3A3A3C" }}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1 rounded-apple px-3 py-3 text-[14px] outline-none border border-transparent focus:border-apple-blue transition-colors text-white"
                style={{ background: "#3A3A3C" }}
              />
            </div>

            <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
              {RECURRENCE_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRecurrence(option.value)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-colors"
                  style={{
                    background: recurrence === option.value ? "#007AFF" : "#3A3A3C",
                    color: recurrence === option.value ? "#FFFFFF" : "#8E8E93",
                  }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="w-full text-white font-semibold text-[16px] rounded-apple py-3.5 transition-opacity"
              style={{
                background: "#007AFF",
                opacity: title.trim() ? 1 : 0.4,
                fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif",
              }}
            >
              Set Reminder
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddTaskSheet;