import { AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onToggle, onDelete }) => {
  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 px-8 text-center">
        <p className="text-gray-900 dark:text-white font-semibold text-lg">
          Bottoms up!
        </p>
        <p className="text-apple-gray text-sm mt-1">
          Tap + to add your first reminder
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-28">
      {pending.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-apple-gray mb-3">
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
          <p className="text-xs font-medium text-apple-gray mb-3">
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