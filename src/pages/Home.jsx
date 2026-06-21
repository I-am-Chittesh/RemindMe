import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import TaskList from "../components/TaskList";
import FAB from "../components/FAB";
import AddTaskSheet from "../components/AddTaskSheet";
import useTasks from "../hooks/useTasks";

const Home = ({ user }) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const {
    tasks,
    loading,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
  } = useTasks(user.uid);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen"
      style={{ background: "#1C1C1E" }}
    >
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
        <TaskList
          tasks={tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      )}

      <FAB onClick={() => setSheetOpen(true)} />

      <AddTaskSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={handleAddTask}
      />
    </motion.div>
  );
};

export default Home;