import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import app from "./config";

const db = getFirestore(app);

// Add a new task
export const addTask = async (userId, taskData) => {
  try {
    const ref = collection(db, "users", userId, "tasks");
    const docRef = await addDoc(ref, {
      ...taskData,
      completed: false,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Add task error:", error);
    throw error;
  }
};

// Get all tasks for a user
export const getTasks = async (userId) => {
  try {
    const ref = collection(db, "users", userId, "tasks");
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Get tasks error:", error);
    throw error;
  }
};

// Mark task as complete / incomplete
export const toggleTask = async (userId, taskId, completed) => {
  try {
    const ref = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(ref, { completed });
  } catch (error) {
    console.error("Toggle task error:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (userId, taskId) => {
  try {
    const ref = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Delete task error:", error);
    throw error;
  }
};

// Save FCM token to user doc
export const saveFCMToken = async (userId, token) => {
  try {
    const ref = doc(db, "users", userId);
    await updateDoc(ref, { fcmToken: token });
  } catch (error) {
    // doc might not exist yet, create it
    const ref = doc(db, "users", userId);
    const { setDoc } = await import("firebase/firestore");
    await setDoc(ref, { fcmToken: token }, { merge: true });
  }
};

export { db };