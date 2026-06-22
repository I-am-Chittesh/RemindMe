import { useState, useEffect } from "react";
import useAuth from "./hooks/useAuth";
import useTheme from "./hooks/useTheme";
import { signInWithGoogle, logOut } from "./firebase/auth";
import { requestNotificationPermission, onForegroundMessage } from "./firebase/messaging";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import BottomNav from "./components/BottomNav";
import { motion } from "framer-motion";

const App = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("tasks");
  const [modalOpen, setModalOpen] = useState(false);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  useTheme();

  useEffect(() => {
    if (user) {
      requestNotificationPermission(user.uid);
      const unsubscribe = onForegroundMessage((payload) => {
        console.log("Foreground notification:", payload);
      });
      return () => unsubscribe && unsubscribe();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1C1C1E" }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-3xl"
        >
          🔔
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: "#1C1C1E" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center w-full"
        >
          <div
            className="w-20 h-20 rounded-apple-lg flex items-center justify-center mb-6"
            style={{ background: "#007AFF" }}
          >
            <span className="text-4xl">🔔</span>
          </div>

          <h1
            className="text-[32px] font-bold text-white mb-2 tracking-tight"
            style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
          >
            RemindMe
          </h1>
          <p className="mb-10" style={{ color: "#8E8E93", fontSize: "15px" }}>
            Your tasks. Your reminders. Nothing missed.
          </p>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={signInWithGoogle}
            className="flex items-center gap-3 rounded-apple px-6 py-3.5 w-full justify-center"
            style={{ background: "#2C2C2E", border: "0.5px solid #3A3A3C" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-[15px] font-semibold text-white">
              Continue with Google
            </span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

return (
  <div className="min-h-screen" style={{ background: "#1C1C1E" }}>
    {activeTab === "tasks" && (
      <Home
        user={user}
        addSheetOpen={addSheetOpen}
        setAddSheetOpen={setAddSheetOpen}
      />
    )}
    {activeTab === "calendar" && (
      <Calendar user={user} onModalChange={setModalOpen} />
    )}
    <BottomNav
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onAddTask={() => {
        setActiveTab("tasks");
        setAddSheetOpen(true);
      }}
      hidden={modalOpen}
    />
  </div>
);
};

export default App;