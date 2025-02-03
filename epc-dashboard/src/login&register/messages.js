import React, { useState, useEffect } from "react";
import axios from "axios";
import "./messages.css";

const Messages = ({ user }) => {
  const [groups, setGroups] = useState([]); // List of user groups
  const [selectedGroup, setSelectedGroup] = useState(null); // Current active group
  const [messages, setMessages] = useState([]); // Messages in the selected group
  const [newGroupName, setNewGroupName] = useState(""); // Name for new group
  const [groupMembers, setGroupMembers] = useState(""); // Comma-separated emails for group
  const [messageContent, setMessageContent] = useState(""); // Message input

  useEffect(() => {
    fetchGroups(); // Load user groups on component mount
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchMessages(selectedGroup.id);
    }
  }, [selectedGroup]);

  // Fetch user's group chats
  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-groups", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  // Fetch messages for the selected group
  const fetchMessages = async (groupId) => {
    try {
      const response = await axios.get(`http://localhost:5000/get-group-messages/${groupId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Create a new group
  const createGroup = async () => {
    if (!newGroupName || !groupMembers) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/create-group",
        { name: newGroupName, members: groupMembers.split(",").map(email => email.trim()) },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setGroups([...groups, response.data]); // Add new group to the list
      setNewGroupName("");
      setGroupMembers("");
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  // Send a message to the selected group
  const sendMessage = async () => {
    if (!selectedGroup || !messageContent) return;

    try {
      await axios.post(
        "http://localhost:5000/send-group-message",
        { group_id: selectedGroup.id, content: messageContent },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setMessageContent("");
      fetchMessages(selectedGroup.id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="messages-container">
      <div className="sidebar">
        <h3>Your Groups</h3>
        <ul>
          {groups.map((group) => (
            <li key={group.id} onClick={() => setSelectedGroup(group)} className={selectedGroup?.id === group.id ? "active" : ""}>
              {group.name}
            </li>
          ))}
        </ul>
        <div className="create-group">
          <h4>Create New Group</h4>
          <input
            type="text"
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Members' Emails (comma separated)"
            value={groupMembers}
            onChange={(e) => setGroupMembers(e.target.value)}
          />
          <button onClick={createGroup}>Create Group</button>
        </div>
      </div>

      <div className="chat-box">
        {selectedGroup ? (
          <>
            <h2>{selectedGroup.name}</h2>
            <div className="messages-list">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender_id === user.id ? "sent" : "received"}`}>
                  <p>{msg.content}</p>
                  <span>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <textarea
              placeholder="Type your message..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </>
        ) : (
          <p>Select a group to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Messages;

