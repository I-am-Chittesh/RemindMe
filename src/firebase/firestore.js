import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import app from "./config";

const db = getFirestore(app);

export const addTask = async (userId, taskData) => {
  try {
    const ref = collection(db, "users", userId, "tasks");
    const docRef = await addDoc(ref, {
      title: taskData.title,
      note: taskData.note || "",
      reminderTime: taskData.reminderTime
        ? Timestamp.fromDate(new Date(taskData.reminderTime))
        : null,
      recurrence: taskData.recurrence || "none",
      completed: false,
      notified: false,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Add task error:", error);
    throw error;
  }
};

export const getTasks = async (userId) => {
  try {
    const ref = collection(db, "users", userId, "tasks");
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        reminderTime: data.reminderTime
          ? data.reminderTime.toDate().toISOString()
          : null,
      };
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    throw error;
  }
};

export const toggleTask = async (userId, taskId, completed) => {
  try {
    const ref = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(ref, { completed });
  } catch (error) {
    console.error("Toggle task error:", error);
    throw error;
  }
};

export const deleteTask = async (userId, taskId) => {
  try {
    const ref = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Delete task error:", error);
    throw error;
  }
};

export const saveFCMToken = async (userId, token) => {
  try {
    const ref = doc(db, "users", userId);
    await setDoc(ref, { fcmToken: token }, { merge: true });
  } catch (error) {
    console.error("Save FCM token error:", error);
  }
};
export const addNote = async (userId, noteData) => {
  try {
    const ref = collection(db, "users", userId, "notes");
    const docRef = await addDoc(ref, {
      title: noteData.title || "",
      body: noteData.body || "",
      pinned: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Add note error:", error);
    throw error;
  }
};

export const getNotes = (userId, callback) => {
  const ref = collection(db, "users", userId, "notes");
  const q = query(ref, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(notes);
  });
};

export const updateNote = async (userId, noteId, updates) => {
  try {
    const ref = doc(db, "users", userId, "notes", noteId);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error("Update note error:", error);
    throw error;
  }
};

export const deleteNote = async (userId, noteId) => {
  try {
    const ref = doc(db, "users", userId, "notes", noteId);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Delete note error:", error);
    throw error;
  }
};

export { db };