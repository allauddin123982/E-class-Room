import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../../firebase-config";
import {
  collection,
  addDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

const UploadNotes = () => {
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [notesList, setNotesList] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("User state updated:", currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "notes"),
          where("uid", "==", user.uid), // Filter notes by current user's uid
          orderBy("createdAt")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedNotes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Fetched notes:", fetchedNotes);
          setNotesList(fetchedNotes);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to fetch notes. Please try again.");
      }
    };

    fetchNotes();
  }, [user]);

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
    setError(""); // Clear error when user starts typing again
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(""); // Clear error when a file is selected
  };

  const handleSaveNotes = async () => {
    if (!notes.trim() && !file) {
      setError("Please provide notes or select a file.");
      return;
    }

    try {
      if (!user) {
        setError("User is not authenticated.");
        return;
      }

      let fileUrl = "";
      if (file) {
        const fileRef = ref(storage, `notes/${user.uid}/${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "notes"), {
        uid: user.uid,
        email: user.email,
        note: notes.trim(),
        fileUrl: fileUrl,
        createdAt: new Date(),
      });

      setNotes("");
      setFile(null);
      setError("");
      console.log("Note saved successfully");
      alert("Notes saved successfully!");
    } catch (err) {
      console.error("Error saving notes:", err);
      setError("Error saving notes. Please try again.");
    }
  };

  const handleDeleteNote = async (noteId, fileUrl) => {
    try {
      if (fileUrl) {
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
      }
      await deleteDoc(doc(db, "notes", noteId));
      setNotesList((prevNotes) =>
        prevNotes.filter((note) => note.id !== noteId)
      );
      alert("Note deleted successfully!");
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Error deleting note. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-3xl font-bold mb-6">Upload Your Notes</h2>
      {user ? (
        <div className="w-full max-w-md">
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Write your notes here..."
            className="border border-gray-300 p-3 w-full h-40 resize-none mb-4 rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleSaveNotes}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full"
          >
            Upload Note
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Uploaded Notes</h3>
            {notesList?.length > 0 ? (
              notesList.map((note) => (
                <div
                  key={note.id}
                  className="mb-4 p-4 border rounded-lg bg-gray-50 shadow-sm"
                >
                  {note.note ? (
                    <p>
                      <strong>Note:</strong> {note.note}
                    </p>
                  ) : note.fileUrl ? (
                    <p>
                      <strong>File:</strong>{" "}
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View File
                      </a>
                    </p>
                  ) : null}

                  <p>
                    <small>By: {note.email}</small>
                  </p>
                  <p>
                    <small>
                      Created At:{" "}
                      {new Date(note.createdAt.toDate()).toLocaleString()}
                    </small>
                  </p>
                  <button
                    onClick={() => handleDeleteNote(note.id, note.fileUrl)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No notes available</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-red-600">Please log in to write and save notes.</p>
      )}
    </div>
  );
};

export default UploadNotes;
