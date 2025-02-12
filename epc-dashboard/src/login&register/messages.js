import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./messages.css";
import profileIcon from "../assets/profileicon.png";


const socket = io("http://localhost:5000");

const Messages = ({ user }) => {
  const [groups, setGroups] = useState([]);      // List of user's groups
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);  // Messages in the selected group
  const [newGroupName, setNewGroupName] = useState(""); 
  const [groupMembers, setGroupMembers] = useState(""); 
  const [messageContent, setMessageContent] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error for profanity filter 

  // Fetch groups on mount and listen for socket messages
  useEffect(() => {
    fetchGroups();
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  // Join a group room and fetch its messages
  useEffect(() => {
    if (selectedGroup) {
      fetchMessages(selectedGroup.group_id);
      socket.emit("join_room", { group_id: selectedGroup.group_id });
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-groups", {
        headers: { "User-Email": user.email },
      });
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchMessages = async (groupId) => {
    if (!groupId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/get-group-messages/${groupId}`,
        {
          headers: { "User-Email": user.email },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const createGroup = async () => {
    if (!newGroupName || !groupMembers) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/create-group",
        {
          name: newGroupName,
          members: groupMembers.split(",").map((email) => email.trim()),
        },
        {
          headers: { "User-Email": user.email },
        }
      );
      setGroups([...groups, response.data]);
      setNewGroupName("");
      setGroupMembers("");
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const sendMessage = async () => {
    if (!selectedGroup || !messageContent.trim()) {
        setErrorMessage("Message cannot be empty."); // Prevent empty messages
        return;
    }

    try {
        const response = await axios.post(
            "http://localhost:5000/send-group-message",
            {
                group_id: selectedGroup.group_id,
                content: messageContent,
            },
            {
                headers: { "User-Email": user.email },
            }
        );

        if (response.status === 201) {
            const newMessage = response.data;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageContent(""); // Clear message input
            setErrorMessage(""); // Clear any error messages
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            setErrorMessage(error.response.data.error || "Your message contains inappropriate language.");
        } else {
            setErrorMessage("Failed to send message. Please try again.");
        }
    }
};


  return (
    <div className="messaging-container">
      {/* === Left Sidebar === */}
      <div className="sidebar">
        <h2 className="logo">Group Chats</h2>
        <div className="groups-list">
          {groups.map((group) => (
            <div
              key={group.group_id}
              onClick={() => setSelectedGroup(group)}
              className={`group-item ${
                selectedGroup?.group_id === group.group_id ? "active" : ""
              }`}
            >
              <span className="group-name">{group.name}</span>
            </div>
          ))}
        </div>

        {/* === Create Group Form === */}
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

      {/* === Main Chat Area === */}
      <div className="chat-area">
        {selectedGroup ? (
          <>
            {/* Header with group name */}
            <div className="chat-header">
              <h3 className="chat-title">{selectedGroup.name}</h3>
            </div>

            {/* Messages */}
            <div className="messages-list">
              {messages.map((msg, index) => {
                const isSentByUser = msg.sender_id === user.id;
                return (
                  <div
                    key={index}
                    className={`message-bubble ${
                      isSentByUser ? "sent" : "received"
                    }`}
                  >         

                    <div className="message-info">
                      {console.log("Profile Image URL:", msg.profile_image_url)}

                      <img
                        src={
                          !msg.profile_image_url || msg.profile_image_url === "null" || msg.profile_image_url.trim() === "" || msg.profile_image_url === undefined
                            ? profileIcon // Use default image if profile_image_url is missing or empty
                            : msg.profile_image_url
                        }
                        alt="Profile"
                        className="profile-image"
                        onError={(e) => { e.target.onerror = null; e.target.src = profileIcon; }} // Fallback for broken image links
                      />

                      <span className="sender-name">{msg.sender_name}</span>
                    </div>
                    <p className="message-content">{msg.content}</p>
                    <span className="message-timestamp">
                      {new Date(msg.sent_at).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Display error message if there's an error */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {/* Input Box */}
            <div className="chat-input">
              <textarea
                className="input-field"
                placeholder="Type your message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button className="send-button" onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a group to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;