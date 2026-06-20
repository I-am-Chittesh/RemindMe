import { motion } from "framer-motion";

const FAB = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-8 right-8 w-14 h-14 bg-apple-blue rounded-full flex items-center justify-center shadow-apple-btn z-50 backdrop-blur-sm"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </motion.button>
  );
};

export default FAB;