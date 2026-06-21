import { AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onToggle, onDelete }) => {
  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 px-8 text-center">
        <div className="text-5xl mb-4">🎯</div>
        <p className="text-white font-semibold text-[17px]">No tasks yet</p>
        <p className="text-apple-gray text-[15px] mt-1">
          Tap + to add your first reminder
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-28">
      {pending.length > 0 && (
        <div className="mb-2">
          <p
            className="text-[13px] font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#8E8E93", letterSpacing: "0.08em" }}
          >
            Pending
          </p>
          <AnimatePresence>
            {pending.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {completed.length > 0 && (
        <div className="mt-6">
          <p
            className="text-[13px] font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#8E8E93", letterSpacing: "0.08em" }}
          >
            Done
          </p>
          <AnimatePresence>
            {completed.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TaskList;