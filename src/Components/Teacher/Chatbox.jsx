import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import { useParams } from "react-router-dom";

const ChatBox = ({ groupId, groupName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (groupId) {
      const q = query(
        collection(db, `groups/${groupId}/messages`),
        orderBy("timestamp", "asc")
      );
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          let msgs = [];
          querySnapshot.forEach((doc) => {
            msgs.push({ id: doc.id, ...doc.data() });
          });
          console.log("Received messages:", msgs);
          setMessages(msgs);
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );
      return () => unsubscribe();
    }
  }, [groupId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const messageData = {
        text: newMessage,
        senderId: currentUser.uid,
        senderRole: currentUser.role, // Add senderRole to message data
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, `groups/${groupId}/messages`), messageData);
      console.log("Message sent:", messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[400px] p-4 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chat - {groupName}</h2>
          <button onClick={onClose} className="text-red-500">
            Close
          </button>
        </div>
        <div className="overflow-y-auto h-[300px] mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 ${
                message.senderId === currentUser.uid
                  ? "text-right"
                  : "text-left"
              }`}
            >
              <div
                className={`bg-gray-200 p-2 rounded ${
                  message.senderId === currentUser.uid
                    ? "self-end bg-blue-300"
                    : "self-start bg-gray-300"
                }`}
              >
                <p>{message.text}</p>
              </div>
              <small className="text-xs">
                {message?.senderRole === "student" ? "Student" : "Teacher"}
              </small>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="border p-2 flex-grow"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="border p-2 bg-blue-500 text-white rounded-lg"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
