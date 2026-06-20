import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useState } from "react";

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

const TaskCard = ({ task, onToggle, onDelete }) => {
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-100, -30], [1, 0]);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const cardRef = useRef(null);
  const isDragging = useRef(false);
  const isHorizontal = useRef(false);
  const [swiped, setSwiped] = useState(false);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
    isHorizontal.current = false;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current) return;

    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // determine direction on first significant move
    if (!isDragging.current) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      isHorizontal.current = Math.abs(dx) > Math.abs(dy);
      isDragging.current = true;
    }

    // only handle horizontal drags
    if (!isHorizontal.current) return;

    e.preventDefault(); // stop page scroll during horizontal drag

    // only allow left swipe, not right
    if (dx > 0) {
      x.set(0);
      return;
    }

    x.set(Math.max(dx, -120));
  };

  const handleTouchEnd = () => {
    if (!isDragging.current || !isHorizontal.current) {
      touchStartX.current = null;
      return;
    }

    const currentX = x.get();

    if (currentX < -70) {
      // delete
      setSwiped(true);
      animate(x, -400, {
        duration: 0.2,
        ease: "easeOut",
        onComplete: () => onDelete(task.id),
      });
    } else {
      // snap back
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 35,
      });
    }

    touchStartX.current = null;
    isDragging.current = false;
  };

  const handleCheckToggle = (e) => {
    e.stopPropagation();
    if (!isDragging.current) {
      onToggle(task.id, !task.completed);
    }
  };

  if (swiped) return null;

  return (
    <div
      className="relative mb-2.5 rounded-apple overflow-hidden"
    >
      {/* gray delete background */}
      <div className="absolute inset-0 bg-gray-400 dark:bg-gray-600 rounded-apple flex items-center justify-end pr-5">
        <motion.div
          style={{ opacity: deleteOpacity }}
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

      {/* card — uses native touch events */}
      <motion.div
        ref={cardRef}
        style={{ x }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        animate={{ opacity: task.completed ? 0.5 : 1 }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: task.completed ? 0.5 : 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative bg-gray-50 dark:bg-white/5 backdrop-blur-md border border-gray-300 dark:border-white/10 rounded-apple-lg px-4 py-3 flex items-center gap-3 select-none"
      >
        {/* checkmark */}
        <button
          onTouchEnd={handleCheckToggle}
          onClick={handleCheckToggle}
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
        </button>

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