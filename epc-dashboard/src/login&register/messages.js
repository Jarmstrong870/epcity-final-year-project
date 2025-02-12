import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./messages.css";
import { FaPencilAlt, FaTrash, FaDoorOpen } from "react-icons/fa";

const socket = io("http://localhost:5000");

const Messages = ({ user }) => {
  const [groups, setGroups] = useState([]);      // List of user's groups
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);  // Messages in the selected group
  const [newGroupName, setNewGroupName] = useState(""); 
  const [groupMembers, setGroupMembers] = useState(""); 
  const [messageContent, setMessageContent] = useState(""); 
  const [popUp, setPopUp] = useState(false);
  const [popUpFunction, setPopUpFunction] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [dropdownMenu, setDropdownMenu] = useState(false);

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
    if (!selectedGroup || !messageContent) return;

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
        setMessages([...messages, response.data]);
        setMessageContent("");
      } else {
        console.error("Error sending message:", response.data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const deleteGroup = async (groupId) => {
    const updatedGroups = [];

    if (!groupId) 
      return;

    try {
      const response = await axios.delete("http://localhost:5000/delete-group",
        {
          headers: {"User-Email": user.email},
          data: {group_id: groupId},
        });
        
        if(response.status === 200) {
          groups.forEach(group => {
            if(group.group_id !== groupId){
              updatedGroups.push(group);
            }
          });
          setGroups(updatedGroups);

          if(selectedGroup?.group_id !== groupId){
            setSelectedGroup(null);
            setMessages([]);
          }
        }

    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const editGroupName = async (groupId, newGroupName) => {
    try {
      const response = await axios.put("http://localhost:5000/edit-group-name",
        {
          group_id: groupId,
          update_name: newGroupName,
        },
        {
          headers: {"User-Email": user.email},
        }
      );
        
        if(response.status === 200) {
          const updatedGroups = [...groups];

          updatedGroups.forEach(group => {
            if(group.group_id === groupId){
              group.name = newGroupName;
            }
          });
          setGroups(updatedGroups);

          if(selectedGroup?.group_id !== groupId){
            setSelectedGroup({...selectedGroup, name: newGroupName});
        }
      }

    } catch (error) {
      console.error("Error updating group name:", error);
    }
  };
 
  const exitGroup = async (groupId) => {
    const updatedGroups = [];

    try {
      const response = await axios.post("http://localhost:5000/exit-group",
        {group_id: groupId},
        {headers: {"User-Email": user.email},
      });
        
        if(response.status === 200) {
          groups.forEach(group => {
            if(group.group_id !== groupId){
              updatedGroups.push(group);
            }
          });
          setGroups(updatedGroups);

          if(selectedGroup?.group_id !== groupId){
            setSelectedGroup(null);
            setMessages([]);
          }
        }
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const confirmationPopUp = (action, groupId) => {
    let popupMessage = "";

    switch(action) {
      case "delete":
        popupMessage = "Are you sure you want to delete the group?";
        break;
      
      case "exit":
        popupMessage = "Are you sure you want to exit the group?";
        break;

      case "edit":
        popupMessage = "Do you want to change the group name?";
        break;
      
      default:
        popupMessage = "Make sure you are sure with your decision before clicking yes";
    }

    setPopUpFunction(() => () => {
      if(action === "delete")
        deleteGroup(groupId);

      if(action === "exit")
        exitGroup(groupId);

      if(action === "edit") {
        const updatedName = prompt("Enter the new group name");
      if(updatedName)
        editGroupName(groupId, updatedName);
    }
  });

  setPopupMessage(popupMessage);
  setPopUp(true);

  };

  const toggleDropdown = () => {
    setDropdownMenu(!dropdownMenu);
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
              className={`group-item ${selectedGroup?.group_id === group.group_id ? "active" : ""}`}>
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
            <div className="message-chat-header">
              <h3 className="message-chat-title">{selectedGroup.name}</h3>

              <div className="message-profile-icon" onClick={toggleDropdown}>
                <h2 className="message-dropdown-icon">...</h2>

                {dropdownMenu && selectedGroup &&(
                <div className="message-dropdown-menu">
                    <button className="icon-button"
                        onClick = {() => confirmationPopUp("edit", selectedGroup?.group_id)}
                        disabled={!selectedGroup} >
                        <span className="icon-border"> {"\u270D"} </span> 
                          Edit Group Name
                        </button>

                      <button className="icon-button"
                        onClick = {() => confirmationPopUp("delete", selectedGroup?.group_id)}
                        disabled={!selectedGroup} >
                        <span className="icon-border"> {"\uD83D\uDDD1"} </span>
                          Delete Group and Data
                        </button>   

                      <button className="icon-button"
                        onClick = {() => exitGroup(selectedGroup?.group_id)}
                        disabled={!selectedGroup} >
                        <span className="icon-border"> {"\uD83D\uDEAA"} </span>
                          Leave Group?
                        </button>   
                    </div>
                    )}
                  </div>
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
                    <p className="message-content">{msg.content}</p>
                    <span className="message-timestamp">
                      {new Date(msg.sent_at).toLocaleString()}
                    </span>
                  </div>
                );
              })}

           </div>

            {/* Input Box */}
            <div className="chat-input">
              <textarea
                className="input-field"
                placeholder="Type your message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={(e) => {
                  // Optional: Send on Enter
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button className="send-button" onClick={sendMessage}>
              <span className="send-button-icon"> {"\u279C"} </span> 
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a group to start chatting</p>
          </div>
        )}
      </div>

      {popUp && (
        <div className = "popup-base">
          <div className = "popup-message">
            <p>{popupMessage}</p>
              <div className = "popup-action">
                <button onClick={() => {
                  popUpFunction();
                  setPopUp(false);
                }}>Yes</button>

                <button onClick={() => setPopUp(false)}>No</button>
              </div>
          </div>
          </div>
        )}
    </div>
  );
};

export default Messages;
