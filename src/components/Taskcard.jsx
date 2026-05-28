import { motion, AnimatePresence } from "framer-motion";

const formatTime = (reminderTime) => {
  if (!reminderTime) return null;
  const date = new Date(reminderTime);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (date.toDateString() === today.toDateString()) return `Today, ${timeStr}`;
  if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${timeStr}`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + `, ${timeStr}`;
};

const TaskCard = ({ task, onToggle, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: task.completed ? 0.45 : 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="bg-white dark:bg-apple-darkcard rounded-apple border border-gray-100 dark:border-apple-darkborder px-4 py-3 flex items-center gap-3 mb-2.5"
    >
      {/* checkmark */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onToggle(task.id, !task.completed)}
        className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
          task.completed
            ? "bg-apple-blue border-apple-blue"
            : "border-apple-blue bg-transparent"
        }`}
      >
        {task.completed && (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <polyline
              points="2,7 5.5,10.5 11,3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </motion.button>

      {/* content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[15px] font-medium truncate transition-colors duration-200 ${
            task.completed
              ? "line-through text-apple-gray"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {task.title}
        </p>

        {task.reminderTime && (
          <p className="text-xs text-apple-gray mt-0.5 flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            {formatTime(task.reminderTime)}
          </p>
        )}

        {task.note && (
          <p className="text-xs text-apple-gray mt-0.5 truncate">{task.note}</p>
        )}
      </div>

      {/* delete */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 text-apple-red opacity-70 hover:opacity-100 transition-opacity"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="3,6 5,6 21,6" />
          <path d="M19,6l-1,14H6L5,6" />
          <path d="M10,11v6M14,11v6" />
          <path d="M9,6V4h6v2" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default TaskCard;