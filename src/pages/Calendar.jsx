import { motion } from "framer-motion";

const Calendar = ({ tasks }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-8 px-5"
      style={{ background: "#1C1C1E" }}
    >
      <h1
        className="text-[28px] font-bold text-white mb-6 tracking-tight"
        style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
      >
        Calendar
      </h1>

      {/* MonthGrid will go here in Phase 2 */}
      <div
        className="rounded-apple-lg flex items-center justify-center py-20"
        style={{ background: "#2C2C2E", border: "0.5px solid #3A3A3C" }}
      >
        <p className="text-apple-gray text-[15px]">
          Calendar coming in Phase 2 🗓
        </p>
      </div>
    </motion.div>
  );
};

export default Calendar;