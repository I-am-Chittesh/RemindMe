import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RECURRENCE_OPTIONS = [
  { value: "none", label: "No repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const AddTaskSheet = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [recurrence, setRecurrence] = useState("none");

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
            className="fixed inset-0 bg-black/30 z-40"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-apple-darkcard/95 backdrop-blur-lg rounded-t-apple-xl z-50 px-5 pt-3 pb-10 shadow-apple-dark border-t border-white/20"
          >
            <div className="w-9 h-1 bg-gray-200 dark:bg-apple-darkborder rounded-full mx-auto mb-5" />

            <h2 className="text-[17px] font-semibold text-gray-900 dark:text-white mb-4">
              New reminder
            </h2>

            <input
              type="text"
              placeholder="Task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full bg-gray-50 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white placeholder-apple-gray rounded-apple px-4 py-3 text-[15px] outline-none mb-3 border border-gray-300 dark:border-white/10 focus:border-apple-blue focus:bg-gray-100 dark:focus:bg-white/10 transition-colors"
            />

            <input
              type="text"
              placeholder="Notes"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-50 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white placeholder-apple-gray rounded-apple px-4 py-3 text-[15px] outline-none mb-3 border border-gray-300 dark:border-white/10 focus:border-apple-blue focus:bg-gray-100 dark:focus:bg-white/10 transition-colors"
            />

            <div className="flex gap-2 mb-3">
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white rounded-apple px-3 py-3 text-[14px] outline-none border border-gray-300 dark:border-white/10 focus:border-apple-blue focus:bg-gray-100 dark:focus:bg-white/10 transition-colors"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white rounded-apple px-3 py-3 text-[14px] outline-none border border-gray-300 dark:border-white/10 focus:border-apple-blue focus:bg-gray-100 dark:focus:bg-white/10 transition-colors"
              />
            </div>

            {/* recurrence picker */}
            <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
              {RECURRENCE_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRecurrence(option.value)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                    recurrence === option.value
                      ? "bg-apple-blue text-white"
                      : "bg-gray-100 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="w-full bg-apple-blue disabled:opacity-40 text-white font-semibold text-[16px] rounded-apple py-3.5 transition-opacity"
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