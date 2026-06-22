import { motion } from "framer-motion";
import Header from "../components/Header";
import TaskList from "../components/TaskList";
import AddTaskSheet from "../components/AddTaskSheet";
import useTasks from "../hooks/useTasks";

const Home = ({ user, addSheetOpen, setAddSheetOpen }) => {
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
            className="text-[15px]"
            style={{ color: "#8E8E93" }}
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

      <AddTaskSheet
        isOpen={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        onAdd={handleAddTask}
      />
    </motion.div>
  );
};

export default Home;