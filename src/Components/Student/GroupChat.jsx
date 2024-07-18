import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config"; // Make sure to configure your Firebase
import ChatBox from "../Teacher/Chatbox";

const GroupChat = () => {
  const [groupList, setGroupList] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showChatBox, setShowChatBox] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "groups"));
        const groups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroupList(groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const filtered = groupList.filter((group) =>
        group.members.some((member) => member.uid === currentUser.uid)
      );
      setFilteredGroups(filtered);
    }
  }, [groupList, currentUser]); // Ensure useEffect runs when groupList or currentUser changes

  const handleOpenChatBox = (group) => {
    setSelectedGroup(group);
    setShowChatBox(true);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Your Group Chats</h2>
      {filteredGroups.length > 0 ? (
        filteredGroups.map((group) => (
          <div key={group.id} style={styles.groupChat}>
            <h3 style={styles.groupName}>Group Name: {group.groupName}</h3>
            <button
              style={styles.openChatButton}
              onClick={() => handleOpenChatBox(group)}
            >
              Open Chat
            </button>
          </div>
        ))
      ) : (
        <p style={styles.noGroupsText}>No group chats available.</p>
      )}
      {showChatBox && selectedGroup && (
        <ChatBox
          groupId={selectedGroup.id}
          groupName={selectedGroup.groupName}
          onClose={() => setShowChatBox(false)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  groupChat: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  groupName: {
    marginBottom: "10px",
    fontSize: "18px",
    color: "#000",
    fontWeight: "bold",
  },
  openChatButton: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  noGroupsText: {
    textAlign: "center",
    color: "#999",
  },
};

export default GroupChat;
