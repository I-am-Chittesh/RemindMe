import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import TaskList from "../components/TaskList";
import FAB from "../components/FAB";
import AddTaskSheet from "../components/AddTaskSheet";
import useTasks from "../hooks/useTasks";

const Home = ({ user, onSignOut }) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { tasks, loading, handleAddTask, handleToggleTask, handleDeleteTask } = useTasks(user.uid);

  return (
    <div className="min-h-screen bg-apple-lightbg dark:bg-apple-darkbg">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onSignOut}
          className="text-xs text-apple-gray px-3 py-1.5 rounded-full bg-white dark:bg-apple-darkcard border border-gray-100 dark:border-apple-darkborder"
        >
          Sign out
        </button>
      </div>

      <Header tasks={tasks} />

      {loading ? (
        <div className="flex justify-center mt-16">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-apple-gray text-sm"
          >
            Loading tasks...
          </motion.div>
        </div>
      ) : (
        <TaskList tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
      )}

      <FAB onClick={() => setSheetOpen(true)} />

      <AddTaskSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} onAdd={handleAddTask} />
    </div>
  );
};

export default Home;