import { motion } from "framer-motion";

const TasksIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M9 11l3 3L22 4" stroke={active ? "#FFFFFF" : "#8E8E93"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke={active ? "#FFFFFF" : "#8E8E93"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke={active ? "#FFFFFF" : "#8E8E93"} strokeWidth="2" />
    <path d="M16 2v4M8 2v4M3 10h18" stroke={active ? "#FFFFFF" : "#8E8E93"} strokeWidth="2" strokeLinecap="round" />
    <circle cx="8" cy="16" r="1.5" fill={active ? "#FFFFFF" : "#8E8E93"} />
    <circle cx="12" cy="16" r="1.5" fill={active ? "#FFFFFF" : "#8E8E93"} />
    <circle cx="16" cy="16" r="1.5" fill={active ? "#FFFFFF" : "#8E8E93"} />
  </svg>
);

const NotesIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
      stroke={active ? "#FFFFFF" : "#8E8E93"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={active ? "#FFFFFF" : "#8E8E93"} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const BottomNav = ({ activeTab, onTabChange, onAddTask, hidden }) => {
  if (hidden) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-40 flex items-center"
      style={{
        transform: "translateX(-50%)",
        background: "rgba(44, 44, 46, 0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "0.5px solid #3A3A3C",
        borderRadius: "40px",
        padding: "10px 20px",
        gap: "0px",
        width: "auto",
      }}
    >
      {/* Tasks tab */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => onTabChange("tasks")}
        className="flex flex-col items-center justify-center gap-1"
        style={{ width: "64px" }}
      >
        <TasksIcon active={activeTab === "tasks"} />
        <span className="text-[10px] font-medium" style={{ color: activeTab === "tasks" ? "#FFFFFF" : "#8E8E93" }}>
          Tasks
        </span>
      </motion.button>

      {/* center FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onAddTask}
        className="flex items-center justify-center mx-3"
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#007AFF",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </motion.button>

      {/* Calendar tab */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => onTabChange("calendar")}
        className="flex flex-col items-center justify-center gap-1"
        style={{ width: "64px" }}
      >
        <CalendarIcon active={activeTab === "calendar"} />
        <span className="text-[10px] font-medium" style={{ color: activeTab === "calendar" ? "#FFFFFF" : "#8E8E93" }}>
          Calendar
        </span>
      </motion.button>

      {/* Notes tab */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => onTabChange("notes")}
        className="flex flex-col items-center justify-center gap-1"
        style={{ width: "64px" }}
      >
        <NotesIcon active={activeTab === "notes"} />
        <span className="text-[10px] font-medium" style={{ color: activeTab === "notes" ? "#FFFFFF" : "#8E8E93" }}>
          Notes
        </span>
      </motion.button>
    </div>
  );
};

export default BottomNav;