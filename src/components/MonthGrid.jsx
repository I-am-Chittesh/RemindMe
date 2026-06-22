import { useState } from "react";
import { motion } from "framer-motion";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthGrid = ({ tasks, onSelectDate, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const taskMap = {};
  tasks.forEach((task) => {
    if (!task.reminderTime) return;
    const d = new Date(task.reminderTime);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!taskMap[day]) taskMap[day] = { pending: 0, done: 0 };
      if (task.completed) taskMap[day].done++;
      else taskMap[day].pending++;
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  return (
    <div
      className="mx-4 rounded-apple-lg overflow-hidden"
      style={{ background: "#2C2C2E", border: "0.5px solid #3A3A3C" }}
    >
      {/* month header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "0.5px solid #3A3A3C" }}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={prevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: "#3A3A3C" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </motion.button>

        <span
          className="text-[17px] font-semibold text-white"
          style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
        >
          {monthLabel}
        </span>

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={nextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: "#3A3A3C" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </motion.button>
      </div>

      {/* day headers */}
      <div className="grid grid-cols-7 px-2 pt-3 pb-1">
        {DAYS.map((d) => (
          <div key={d} className="flex items-center justify-center py-1">
            <span
              className="text-[12px] font-semibold uppercase tracking-wider"
              style={{ color: "#8E8E93" }}
            >
              {d}
            </span>
          </div>
        ))}
      </div>

      {/* date grid */}
      <div className="grid grid-cols-7 px-2 pb-4 gap-y-1">
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="h-14" />;

          const hasTask = taskMap[day];
          const hasPending = hasTask && hasTask.pending > 0;
          const todayCell = isToday(day);
          const selectedCell = isSelected(day);

          return (
            <motion.button
              key={day}
              whileTap={{ scale: 0.85 }}
              onClick={() => onSelectDate(new Date(year, month, day))}
              className="flex flex-col items-center justify-center h-14 rounded-xl relative"
              style={{
                background: selectedCell
                  ? "#FFFFFF"
                  : todayCell
                  ? "#007AFF"
                  : "transparent",
              }}
            >
              <span
                className="text-[16px] font-semibold leading-none"
                style={{
                  color: selectedCell || todayCell ? (selectedCell ? "#000000" : "#FFFFFF") : "#FFFFFF",
                  fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif",
                }}
              >
                {day}
              </span>

              {hasTask && (
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1"
                  style={{
                    background: selectedCell || todayCell
                      ? "rgba(255,255,255,0.8)"
                      : hasPending
                      ? "#007AFF"
                      : "#8E8E93",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthGrid;