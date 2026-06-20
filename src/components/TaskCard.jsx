import { motion, useMotionValue, useTransform, animate } from "framer-motion";

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
  return (
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    `, ${timeStr}`
  );
};

const getRecurrenceLabel = (recurrence) => {
  switch (recurrence) {
    case "daily": return "↻ Daily";
    case "weekly": return "↻ Weekly";
    case "monthly": return "↻ Monthly";
    default: return null;
  }
};

const SWIPE_THRESHOLD = -72;

const TaskCard = ({ task, onToggle, onDelete }) => {
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-120, -40], [1, 0]);
  const deleteScale = useTransform(x, [-120, -40], [1, 0.7]);
  const cardBg = useTransform(x, [-120, 0], ["#FF3B30", "transparent"]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < SWIPE_THRESHOLD) {
      animate(x, -500, {
        duration: 0.25,
        ease: "easeOut",
        onComplete: () => onDelete(task.id),
      });
    } else {
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 30,
      });
    }
  };

  return (
    <div
      className="relative mb-2.5 rounded-apple overflow-hidden"
      style={{ touchAction: "pan-y" }}
    >
      {/* delete background — sits behind the card */}
      <div className="absolute inset-0 bg-apple-red flex items-center justify-end pr-5 rounded-apple">
        <motion.div
          style={{ opacity: deleteOpacity, scale: deleteScale }}
          className="flex flex-col items-center gap-0.5"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="3,6 5,6 21,6" />
            <path d="M19,6l-1,14H6L5,6" />
            <path d="M10,11v6M14,11v6" />
            <path d="M9,6V4h6v2" />
          </svg>
          <span className="text-white text-[11px] font-semibold">Delete</span>
        </motion.div>
      </div>

      {/* draggable card */}
      <motion.div
        style={{ x, touchAction: "pan-y" }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={{ left: 0.05, right: 0 }}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: task.completed ? 0.45 : 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative bg-white dark:bg-apple-darkcard border border-gray-100 dark:border-apple-darkborder px-4 py-3 flex items-center gap-3 rounded-apple select-none"
      >
        {/* checkmark button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onPointerDown={(e) => e.stopPropagation()}
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

          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {task.reminderTime && (
              <p className="text-xs text-apple-gray flex items-center gap-1">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                {formatTime(task.reminderTime)}
              </p>
            )}

            {getRecurrenceLabel(task.recurrence) && (
              <span className="text-xs text-apple-blue font-medium">
                {getRecurrenceLabel(task.recurrence)}
              </span>
            )}
          </div>

          {task.note && (
            <p className="text-xs text-apple-gray mt-0.5 truncate">
              {task.note}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskCard;