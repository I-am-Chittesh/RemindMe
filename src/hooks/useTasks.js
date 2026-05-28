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
    } catch (err) {
      setError(err.message);
    }
  };

  // Schedule a local notification via service worker
  const scheduleNotification = (task) => {
    if (!task.reminderTime) return;
    if (Notification.permission !== "granted") return;

    const reminderDate = new Date(task.reminderTime);
    const now = new Date();
    const delay = reminderDate.getTime() - now.getTime();

    if (delay <= 0) return; // reminder time already passed

    setTimeout(() => {
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "SHOW_NOTIFICATION",
          title: "RemindMe 🔔",
          body: task.title,
          data: { taskId: task.id },
        });
      } else {
        // fallback — direct notification if SW not available
        new Notification("RemindMe 🔔", {
          body: task.title,
          icon: "/icons/icon-192x192.png",
        });
      }
    }, delay);
  };

  // Reschedule all pending notifications on app load
  const rescheduleAll = useCallback((taskList) => {
    taskList.forEach((task) => {
      if (!task.completed) {
        scheduleNotification(task);
      }
    });
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      rescheduleAll(tasks);
    }
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