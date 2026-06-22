import { useState } from "react";
import { motion } from "framer-motion";
import MonthGrid from "../components/MonthGrid";
import DayModal from "../components/DayModal";
import AddTaskSheet from "../components/AddTaskSheet";
import useTasks from "../hooks/useTasks";

const Calendar = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [prefilledDate, setPrefilledDate] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const { tasks, handleAddTask } = useTasks(user.uid);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleAddForDay = (date) => {
    setPrefilledDate(date);
    setAddSheetOpen(true);
  };

  const handleAddTaskWithDate = (taskData) => {
    let reminderTime = taskData.reminderTime;
    if (!reminderTime && prefilledDate) {
      // default to 9am on the selected date if no time was picked
      const d = new Date(prefilledDate);
      d.setHours(9, 0, 0, 0);
      reminderTime = d.toISOString();
    }
    handleAddTask({ ...taskData, reminderTime });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    // for now just close modal — EditTaskSheet comes in Phase 4
    setModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pb-32"
      style={{ background: "#1C1C1E" }}
    >
      {/* header */}
      <div className="px-5 pt-8 pb-4">
        <h1
          className="text-[28px] font-bold text-white tracking-tight"
          style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
        >
          Calendar
        </h1>
        <p className="text-[15px] mt-0.5" style={{ color: "#8E8E93" }}>
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* month grid */}
      <MonthGrid
        tasks={tasks}
        onSelectDate={handleDateSelect}
        selectedDate={selectedDate}
      />

      {/* day modal */}
      {modalOpen && (
        <DayModal
          selectedDate={selectedDate}
          tasks={tasks}
          onClose={() => setModalOpen(false)}
          onAddTask={handleAddForDay}
          onEditTask={handleEditTask}
        />
      )}

      {/* add task sheet — pre-filled with selected date */}
      <AddTaskSheet
        isOpen={addSheetOpen}
        onClose={() => {
          setAddSheetOpen(false);
          setPrefilledDate(null);
        }}
        onAdd={handleAddTaskWithDate}
        prefilledDate={prefilledDate}
      />
    </motion.div>
  );
};

export default Calendar;