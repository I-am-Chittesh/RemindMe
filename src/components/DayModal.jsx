import { motion, AnimatePresence } from "framer-motion";

const groupByTime = (tasks) => {
  const groups = { Morning: [], Afternoon: [], Evening: [], "No time": [] };
  tasks.forEach((task) => {
    if (!task.reminderTime) {
      groups["No time"].push(task);
      return;
    }
    const hour = new Date(task.reminderTime).getHours();
    if (hour < 12) groups.Morning.push(task);
    else if (hour < 17) groups.Afternoon.push(task);
    else groups.Evening.push(task);
  });
  return groups;
};

const formatTime = (reminderTime) => {
  if (!reminderTime) return null;
  return new Date(reminderTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getRecurrenceLabel = (recurrence) => {
  switch (recurrence) {
    case "daily": return "↻ Daily";
    case "weekly": return "↻ Weekly";
    case "monthly": return "↻ Monthly";
    default: return null;
  }
};

const DayModal = ({ selectedDate, tasks, onClose, onAddTask, onEditTask }) => {
  if (!selectedDate) return null;

  const dayLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // filter tasks for selected date
  const dayTasks = tasks.filter((task) => {
    if (!task.reminderTime) return false;
    const t = new Date(task.reminderTime);
    return (
      t.getDate() === selectedDate.getDate() &&
      t.getMonth() === selectedDate.getMonth() &&
      t.getFullYear() === selectedDate.getFullYear()
    );
  });

  const groups = groupByTime(dayTasks);
  const groupOrder = ["Morning", "Afternoon", "Evening", "No time"];
  const hasAnyTask = dayTasks.length > 0;

  const handleAddForDay = () => {
    onAddTask(selectedDate);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.5)" }}
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-apple-xl px-5 pt-3 pb-10"
        style={{
          background: "#2C2C2E",
          borderTop: "0.5px solid #3A3A3C",
          maxHeight: "75vh",
          overflowY: "auto",
        }}
      >
        {/* handle */}
        <div
          className="w-9 h-1 rounded-full mx-auto mb-4"
          style={{ background: "#3A3A3C" }}
        />

        {/* header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-[17px] font-semibold text-white"
            style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
          >
            {dayLabel}
          </h2>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "#3A3A3C" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>
        </div>

        {/* task groups */}
        {hasAnyTask ? (
          groupOrder.map((group) => {
            const groupTasks = groups[group];
            if (!groupTasks || groupTasks.length === 0) return null;
            return (
              <div key={group} className="mb-4">
                <p
                  className="text-[12px] font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "#8E8E93", letterSpacing: "0.08em" }}
                >
                  {group}
                </p>
                {groupTasks.map((task) => (
                  <motion.button
                    key={task.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onEditTask(task)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-apple mb-2 text-left"
                    style={{
                      background: "#3A3A3C",
                      border: "0.5px solid #48484A",
                    }}
                  >
                    {/* completion indicator */}
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: task.completed ? "#8E8E93" : "#007AFF",
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[15px] font-medium truncate"
                        style={{
                          color: task.completed ? "#8E8E93" : "#FFFFFF",
                          textDecoration: task.completed ? "line-through" : "none",
                          fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif",
                        }}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {task.reminderTime && (
                          <span className="text-[12px]" style={{ color: "#8E8E93" }}>
                            {formatTime(task.reminderTime)}
                          </span>
                        )}
                        {getRecurrenceLabel(task.recurrence) && (
                          <span className="text-[12px]" style={{ color: "#007AFF" }}>
                            {getRecurrenceLabel(task.recurrence)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* chevron */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </motion.button>
                ))}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <span className="text-4xl mb-3">📭</span>
            <p className="text-white font-medium text-[15px]">Nothing planned</p>
            <p className="text-[13px] mt-1" style={{ color: "#8E8E93" }}>
              Tap + to add a reminder for this day
            </p>
          </div>
        )}

        {/* add button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddForDay}
          className="w-full py-3.5 rounded-apple mt-2 flex items-center justify-center gap-2"
          style={{ background: "#007AFF" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span
            className="text-[15px] font-semibold text-white"
            style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
          >
            Add reminder
          </span>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default DayModal;