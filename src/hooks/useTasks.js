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

  const handleAddTask = async (taskData) => {
    try {
      const id = await addTask(userId, taskData);
      const newTask = {
        id,
        ...taskData,
        completed: false,
        notified: false,
        createdAt: new Date(),
      };
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

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

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(userId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

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