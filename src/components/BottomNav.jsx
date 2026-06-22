import { motion } from "framer-motion";

const TasksIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 11l3 3L22 4"
      stroke={active ? "#007AFF" : "#8E8E93"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
      stroke={active ? "#007AFF" : "#8E8E93"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect
      x="3" y="4" width="18" height="18" rx="3"
      stroke={active ? "#007AFF" : "#8E8E93"}
      strokeWidth="2"
    />
    <path
      d="M16 2v4M8 2v4M3 10h18"
      stroke={active ? "#007AFF" : "#8E8E93"}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="8" cy="16" r="1.5" fill={active ? "#007AFF" : "#8E8E93"} />
    <circle cx="12" cy="16" r="1.5" fill={active ? "#007AFF" : "#8E8E93"} />
    <circle cx="16" cy="16" r="1.5" fill={active ? "#007AFF" : "#8E8E93"} />
  </svg>
);

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "tasks", label: "Tasks", Icon: TasksIcon },
    { id: "calendar", label: "Calendar", Icon: CalendarIcon },
  ];

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex items-center justify-around px-10 py-3 gap-10"
      style={{
        transform: "translateX(-50%)",
        background: "rgba(44, 44, 46, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "0.5px solid #3A3A3C",
        borderRadius: "24px",
        width: "auto",
        minWidth: "200px",
      }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.88 }}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-1"
          >
            <tab.Icon active={active} />
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? "#007AFF" : "#8E8E93" }}
            >
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default BottomNav;