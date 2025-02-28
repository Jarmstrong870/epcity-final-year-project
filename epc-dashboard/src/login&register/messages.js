import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./messages.css";
import profileIcon from "../assets/profileicon.png";
import translations from "../locales/translations_messages"; // Import translations
import TextToSpeech from "../Components/utils/TextToSpeech"; // Import TextToSpeech for microphone

const socket = io("http://localhost:5000");

const Messages = ({ user, language }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);  // Messages in the selected group
  const [newGroupName, setNewGroupName] = useState(""); 
  const [groupMembers, setNewGroupMembers] = useState(""); 
  const [messageContent, setMessageContent] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error for profanity filter 
  const [dropdownActionsPopUp, setDropdownActionsPopUp] = useState(false);
  const [createGroupPopUp, setCreateGroupPopUp] = useState(false);
  const [searchOutputPopUp, setSearchOutputPopUp] = useState(true);
  const [addNewUserPopUp, setAddNewUserPopUp] = useState(false);
  const [groupDetailsPopUp, setGroupDetailsPopUp] = useState(true);
  const [popUpFunction, setPopUpFunction] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [searchedMessage, setSearchedMessage] = useState("");
  const [messagesFound, setMessagesFound] = useState([]);
  const [allGroupMembers, setAllGroupMembers] = useState([]);
  const [action, setAction] = useState("");
  const t = translations[language] || translations.en;

  useEffect(() => {
    fetchGroups();
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

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

  const fetchAllGroupMembers = async (groupId) => {
    if (!groupId) {
      return;
    }
      
    try {

      console.log(`fetching for groupId: ${groupId}`)

      const response = await axios.get(
        `http://localhost:5000/get-all-group-members/${groupId}`,
      );
      console.log(`output:`, response.data)
      setAllGroupMembers(response.data);
      setGroupDetailsPopUp(true);
    } catch (error) {
      console.error("Error fetching group members", error);
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
      setCreateGroupPopUp(false);
      setNewGroupMembers("");
    } catch (error) {
      console.error("Error creating group:", error);
    }

  };

  const addNewMember = async (groupId, latestUserEmail) => {

    try {
         const newUser = await axios.post("http://localhost:5000/add-new-member",
          {
            group_id: groupId,
            user_email: latestUserEmail
          });

          if (newUser.status === 200) {
            console.log("Successfully added");
            await fetchAllGroupMembers(groupId);
            setNewUserEmail("");
            setAddNewUserPopUp(false);
          }
        } catch (error) {
        console.error("Error adding another user:", error);
      }
    };

  const sendMessage = async () => {
    if (!selectedGroup || !messageContent.trim()) {
      setErrorMessage(t.messageEmptyError);
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
        setMessageContent("");
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(
          error.response.data.error || t.messageProfanityError
        );
      } else {
        setErrorMessage(t.messageSendError);
      }
    }
};

const searchMessage = async () => {
    
  if (!searchedMessage.trim()) {
      setErrorMessage("Message cannot be found."); // Prevent empty messages
      return;
  }

  try {
      const response = await axios.post(
          "http://localhost:5000/search-group-message",
          {
              group_id: selectedGroup.group_id,
              content: searchedMessage,
          },
          {
              headers: { "User-Email": user.email },
          }
      );

      if (!selectedGroup) {
        setErrorMessage("Select a group before searching");
        return;
      }

      if (response.status === 200 && response.data.length > 0) {
          setMessagesFound(response.data);
          setSearchOutputPopUp(true);
          setErrorMessage(""); 
      } else {
        setErrorMessage("No messages match your search term.");
      } 
    } catch {
          setErrorMessage("Failed to search message. Please try again.");
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

          if(selectedGroup?.group_id == groupId){
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

          if(selectedGroup?.group_id === groupId){
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
      case "create":
        popupMessage = "Do you want to create a new group?"
        break; 

      case "add":
        popupMessage = "Do you want to be added"
        break

      case "delete":
        popupMessage = "Are you sure you want to delete the group?";
        break;
      
      case "exit":
        popupMessage = "Are you sure you want to exit the group?";
        break;

      case "edit":
        popupMessage = "Do you want to change the group name?";
        break;

      case "details":
        popupMessage = "Below are all the members in this group: "
        break;
      
      default:
        popupMessage = "Make sure you are sure with your decision before clicking yes";
    }

    setPopUpFunction(() => () => {
      if(action === "create") {
        setCreateGroupPopUp(true);
        createGroup();
      }

      if(action === "add-member") {
        setAddNewUserPopUp(true);
        addNewMember(groupId, newUserEmail);
      }
      
      if(action === "delete")
        deleteGroup(groupId);

      if(action === "exit")
        exitGroup(groupId);

      if(action === "edit") {
        const updatedName = prompt("Enter the new group name");
      if(updatedName)
        editGroupName(groupId, updatedName);
      }

      if (action === "details") {
        if (!groupId) {
            setErrorMessage("Unable to locate GroupID to fetch group details");
            return;
        }
        fetchAllGroupMembers(groupId);
    }
  });

  setPopupMessage(popupMessage);
  setAction(action);
  setDropdownActionsPopUp(true);

  };

  const toggleDropdown = () => {
    setDropdownMenu(!dropdownMenu);
  };

  const groupDetailsHandle = (groupId) => {
    setGroupDetailsPopUp((response) => (response === groupId ? null : groupId));
  };

  return (
    <div className="messaging-container">
      {/* === Left Sidebar === */}
      <div className="sidebar">
        <h2 className="logo">
          {t.groupChats}{" "}
          <TextToSpeech text={t.groupChats} language={language} />
        </h2>   

      {createGroupPopUp && (
        <div className="create-group-popup-base">
          <div className="create-group-popup-message">
          
        <h4>Create New Group
          <button className="create-group-button-cancel"
            onClick = {() => confirmationPopUp("create")} >
            <span> {"\u0078"} </span>
          </button> 
        </h4>

          <input className="group-input"
            type="text"
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <input className="email-input"
              type="text"
              placeholder="Members' Emails (comma separated)"
              value={groupMembers}
              onChange={(e) => setNewGroupMembers(e.target.value)}
            />
            <div className="create-group-popup">
              <button onClick={() => {
                createGroup();
                setDropdownActionsPopUp(false);
              }}> Create Group </button>
          </div>
        </div>
      </div>
      )}

      {addNewUserPopUp && (
        <div className="add-new-user-popup-base">
          <div className="add-new-user-popup-message">
          
        <h4>Add New User
          <button className="add-new-user-button-cancel"
            onClick = {() => setAddNewUserPopUp(false)} >
            <span> {"\u0078"} </span>
          </button> 
        </h4>

          <input className="group-input"
            type="email"
            placeholder="Enter your email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
            <div className="add-new-user-popup">
              <button onClick={() => {
                confirmationPopUp("add", selectedGroup?.group_id);
              }}> Add New User </button>
          </div>
        </div>
      </div>
      )}

        <div className="groups-list">
          {groups.map((group) => (
            <div
              key={group.group_id}
              className={`group-item ${selectedGroup?.group_id === group.group_id ? "active" : ""}`}
              onClick={() => setSelectedGroup(group)}>
                
              <span className="group-name">{group.name}</span>

              {groupDetailsPopUp === group.group_id && (
              <div className="option-dropdown">
                <div className="option-dropdown-content">
                <h4>Group Members</h4>

                <ul className="group-members">
                  {allGroupMembers.length > 0 ? (
                    allGroupMembers.map((member, index) => (
                      <li key={index}>{member.email}</li>
                    ))
                  ) : (
                    <li>No members found</li> 
                  )}
                </ul>
            </div>
          </div>
        )}
      </div>
    ))}
  </div>

  
        
        <div className="action-buttons">
        <div className="create-title"> Create A New Group
          <button className="create-group-button-plus"
            onClick = {() => confirmationPopUp("create")} > 
              <span className="create-group-border">  {"\u002B"} </span>
          </button> 
        </div>

        <div className="add-title"> Add a user to an existing group
          <button className="add-existing-group-plus"
            onClick = {() => confirmationPopUp("add-member")} > 
            <span className="add-group-border"> {"\u270E"} </span>
          </button> 
        </div>
      </div>
    </div>

      {/* === Main Chat Area === */}
      <div className="chat-area">
        {/* === Search Bar === */}
        {searchOutputPopUp && (
        <div className = "search-message-bar">
          <textarea
                className="search-input-field"
                placeholder= "Search for messages"
                value= {messagesFound?.length > 0 
                  ? messagesFound.map((msg) => `${msg.sender_name}: ${msg.content}`).join("\n")
                  : searchedMessage
                }
                onChange={(e) => setSearchedMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    searchMessage();
                  }
                }}
              />
              <button className="search-button" onClick={searchMessage}>
                <span className="search-button-icon"> {"\uD83D\uDD0E"} </span> 
              </button>

              <button className="clear-search-button"
                onClick = {() => {
                  setSearchedMessage("");
                  setMessagesFound([]); 
                }}>
                <span> {"\u2717"} </span>
                  Clear
              </button>   
          </div>
        )}

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
                        onClick = {() => confirmationPopUp("edit", selectedGroup?.group_id)}>
                        <span className="icon-border"> {"\u270D"} </span> 
                          Edit Group Name
                        </button>

                      <button className="icon-button"
                        onClick = {() => confirmationPopUp("delete", selectedGroup?.group_id)}>
                        <span className="icon-border"> {"\uD83D\uDDD1"} </span>
                          Delete Group and Data
                        </button>   

                      <button className="icon-button"
                        onClick = {() => confirmationPopUp("exit", selectedGroup?.group_id)}>
                        <span className="icon-border"> {"\uD83D\uDEAA"} </span>
                          Leave Group?
                        </button>   

                    </div>
                  )}
                  </div>
              </div>

              <button className="all-members-display"
                onClick={(e) => {
                 
                }} >View All Members</button>
  

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
                      <img
                        src={
                          !msg.profile_image_url ||
                          msg.profile_image_url === "null" ||
                          msg.profile_image_url.trim() === "" ||
                          msg.profile_image_url === undefined
                            ? profileIcon
                            : msg.profile_image_url
                        }
                        alt="Profile"
                        className="profile-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = profileIcon;
                        }}
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
                placeholder={t.typeMessagePlaceholder}
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
              <span className="send-button-icon"> {"\u279C"} </span> 
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>{t.selectGroupToChat}</p>
          </div>
        )}
      </div>

      {dropdownActionsPopUp && (
        <div className = "dropdown-popup-base">
          <div className = "dropdown-popup-message">
            <p>{popupMessage}</p>
              <div className = "dropdown-popup-action">
                <button onClick={() => {
                  if(popUpFunction) {
                    popUpFunction();
                    setDropdownActionsPopUp(false);
                  } else {
                    setErrorMessage("Unable to show pop up");
                  }
                }}>Yes</button>

                <button onClick={() => setDropdownActionsPopUp(false)}>No</button>
              </div>
          </div>
          </div>
        )}
    </div>
  );
};

export default Messages;

