import { useState, useEffect } from "react";
import {
  addNote,
  getNotes,
  deleteNote,
  updateNote,
} from "../firebase/firestore";

const useNotes = (userId) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = getNotes(userId, (fetchedNotes) => {
      setNotes(fetchedNotes);
      setLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, [userId]);

  const createNote = async (title, body) => {
    await addNote(userId, { title, body, pinned: false });
  };

  const removeNote = async (noteId) => {
    await deleteNote(userId, noteId);
  };

  const editNote = async (noteId, updates) => {
    await updateNote(userId, noteId, updates);
  };

  const togglePin = async (noteId, currentPinned) => {
    await updateNote(userId, noteId, { pinned: !currentPinned });
  };

  return { notes, loading, createNote, removeNote, editNote, togglePin };
};

export default useNotes;