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
    if (!task.reminderTime) {
      return;
    }

    if (Notification.permission !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    const reminderDate = new Date(task.reminderTime);
    const now = new Date();
    const delay = reminderDate.getTime() - now.getTime();

    console.log(`Scheduling notification for "${task.title}" in ${Math.round(delay / 1000)}s`);

    if (delay <= 0) {
      console.warn("Reminder time already passed for:", task.title);
      return;
    }

    // Store the timeout ID to clear later if needed
    const timeoutId = setTimeout(() => {
      console.log("Firing notification for:", task.title);

      // Try service worker first
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "SHOW_NOTIFICATION",
          title: "RemindMe 🔔",
          body: task.title,
          data: { taskId: task.id },
        });
        console.log("Notification sent to service worker");
      } else {
        // Fallback: show notification directly
        console.log("Fallback: showing notification directly");
        if (Notification.permission === "granted") {
          new Notification("RemindMe 🔔", {
            body: task.title,
            icon: "/icons/icon-192x192.png",
            badge: "/icons/icon-192x192.png",
            vibrate: [200, 100, 200],
          });
        }
      }
    }, delay);

    // Store timeout ID in task data if possible
    task._timeoutId = timeoutId;
  };

  // Reschedule all pending notifications on app load
  useEffect(() => {
    if (tasks.length > 0 && !loading) {
      rescheduleAll(tasks);
    }
  }, [loading]);

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