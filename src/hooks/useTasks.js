import { useState, useEffect, useCallback } from "react";
import {
  addTask,
  getTasks,
  toggleTask,
  deleteTask,
} from "../firebase/firestore";

const useTasks = (userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await getTasks(userId);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add a task
  const handleAddTask = async (taskData) => {
    try {
      const id = await addTask(userId, taskData);
      const newTask = {
        id,
        ...taskData,
        completed: false,
        createdAt: new Date(),
      };
      setTasks((prev) => [newTask, ...prev]);
      scheduleNotification(newTask);
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle complete
  const handleToggleTask = async (taskId, completed) => {
    try {
      await toggleTask(userId, taskId, completed);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed } : t))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a task
const handleDeleteTask = async (taskId) => {
  try {
    await deleteTask(userId, taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    // cancel the scheduled notification too
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CANCEL_NOTIFICATION",
        id: taskId,
      });
    }
  } catch (err) {
    setError(err.message);
  }
};

  // Schedule a local notification via service worker
  const scheduleNotification = async (task) => {
  if (!task.reminderTime) return;
  if (Notification.permission !== "granted") {
    console.warn("Notification permission not granted");
    return;
  }

  const fireAt = new Date(task.reminderTime).getTime();
  const now = Date.now();

  if (fireAt <= now) {
    console.warn("Reminder time already passed");
    return;
  }

  console.log(`Scheduling notification for "${task.title}" at ${new Date(fireAt)}`);

  // wait for SW to be ready
  const registration = await navigator.serviceWorker.ready;

  // send to SW to handle
  registration.active.postMessage({
    type: "SCHEDULE_NOTIFICATION",
    id: task.id,
    title: "RemindMe 🔔",
    body: task.title,
    fireAt,
  });
};

  // Reschedule all pending notifications on app load
const rescheduleAll = useCallback((taskList) => {
  taskList.forEach((task) => {
    if (!task.completed && task.reminderTime) {
      scheduleNotification(task);
    }
  });
}, []);

  return {
    tasks,
    loading,
    error,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
  };
};

export default useTasks;