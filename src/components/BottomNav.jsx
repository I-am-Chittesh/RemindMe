import { motion } from "framer-motion";

const TasksIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="3"
      stroke={active ? "#007AFF" : "#8E8E93"}
      strokeWidth="2"
    />
    <path
      d="M16 2v4M8 2v4M3 10h18"
      stroke={active ? "#007AFF" : "#8E8E93"}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="8"
      cy="16"
      r="1.5"
      fill={active ? "#007AFF" : "#8E8E93"}
    />
    <circle
      cx="12"
      cy="16"
      r="1.5"
      fill={active ? "#007AFF" : "#8E8E93"}
    />
    <circle
      cx="16"
      cy="16"
      r="1.5"
      fill={active ? "#007AFF" : "#8E8E93"}
    />
  </svg>
);

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "tasks", label: "Tasks", Icon: TasksIcon },
    { id: "calendar", label: "Calendar", Icon: CalendarIcon },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-8 pt-3 pb-8"
      style={{
        background: "rgba(28, 28, 30, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "0.5px solid #3A3A3C",
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
            {active && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 w-1 h-1 rounded-full bg-apple-blue"
                style={{ bottom: "28px" }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default BottomNav;