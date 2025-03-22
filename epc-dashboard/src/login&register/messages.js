import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import InputMessagePopUp from "./inputMessagePopUp";
import ActionMessagePopUp from "./actionMessagePopUp";
import "./inputMessagePopUp.css";
import "./actionMessagePopUp.css";
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
  const [defaultPopUp, setDefaultPopUp] = useState({openStatus: false, title:"", popupType: "", userInputs: [], messageContents: "", confirmStatus: null});
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
      
      if(response.data.length > 0 && !selectedGroup){
        setSelectedGroup(response.data[0]);
      }
      
    } catch (error) {
      console.error(t.errorFetchingGroups, error);
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
      console.error(t.errorFetchingMessages, error);
    }
  };

  const fetchAllGroupMembers = async (groupId) => {
    if (!groupId) {
      return [];
    }
      
    try {
      console.log(`fetching for groupId: ${groupId}`)
      const response = await axios.get(
        `http://localhost:5000/get-all-group-members/${groupId}`,
      );
      console.log(`output:`, response.data);

      setAllGroupMembers(response.data);
      return response.data;
      
    } catch (error) {
      console.error(t.errorFetchingGroupMembers, error);
      return [];
    }
  };

  const createGroup = async (groupName, membersInput) => {
    if (!groupName || !membersInput) return;

    const allMembers = membersInput.split(",").map((email) => email.trim())

    try {
      const response = await axios.post(
        "http://localhost:5000/create-group",
        {
          name: groupName,
          members: allMembers,
        },
        {
          headers: { "User-Email": user.email },
        }
      );

      if (response.status === 201 && response.data.group_id) {
        const newGroup = response.data;

        setGroups((prevGroups) => [...prevGroups, newGroup]);
        setSelectedGroup(newGroup);
  
        setTimeout(() => fetchGroups(), 200);
  
        setNewGroupName("");
        setNewGroupMembers("");
      } else {
        console.error("Failure to create group", response.data.error);
        }
      } catch (e) {
        console.error("Unable to create group");
      }
  };

  const addNewMember = async (groupName, latestUserEmail) => {
    try {

          const groupFound = groups.find(group => group.name.toLowerCase() === groupName.toLowerCase());

          if(!groupFound){
            setErrorMessage("Group not found! Enter a valid group name");
            return;
          }

         const newUser = await axios.post("http://localhost:5000/add-new-member",
          {
            group_id: groupFound.group_id,
            user_email: latestUserEmail
          });

          if (newUser.status === 200) {
            console.log(t.userAddedSuccessfully);
            await fetchAllGroupMembers(groupFound.group_id);
            setNewUserEmail("");
          }
        } catch (error) {
        console.error(t.errorAddingUser, error);
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
      setErrorMessage(t.messageNotFound); // Prevent empty messages
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
        setErrorMessage(t.noGroupSelected);
        return;
      }

      if (response.status === 200 && response.data.length > 0) {
          setMessagesFound(response.data);
          setErrorMessage(""); 
      } else {
        setErrorMessage(t.noMessagesFound);
      } 
    } catch {
      setErrorMessage(t.searchFailed);
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

          if(selectedGroup?.group_id === groupId){
            setSelectedGroup(updatedGroups.length > 0 ? updatedGroups[0] : null);
            setMessages([]);
          }
        }

    } catch (error) {
      console.error(t.errorDeletingGroup, error);
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
      console.error(t.errorUpdatingGroupName, error);
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
      console.error(t.errorLeavingGroup, error);
    }
  };

  const confirmationPopUp = async (action, groupId) => {
    // Reset state before opening the popup
      setNewGroupName("");
      setNewGroupMembers("");
      setNewUserEmail("");
  
      const actionPopups = {
        create: {
          title: "Create Group",
          popupType: "input",
          userInputs: [
            { label: "Group Name", placeholder: "Enter Group Name", value: "", onChange: setNewGroupName },
            { label: "Group Members", placeholder: "User Email, User Email", value: "", onChange: setNewGroupMembers }
          ],
          confirmStatus: (inputValues) => createGroup(inputValues["Group Name"], inputValues["Group Members"])
        },
        add: {
          title: "Add Member to Group",
          popupType: "input",
          userInputs: [
            { label: "User Email", placeholder: "Enter User Email", value: "", onChange: setNewUserEmail },
            { label: "Group Name", placeholder: "Enter Group Name", value: "", onChange: setNewGroupName }
          ],
          confirmStatus: (inputValues) => addNewMember(inputValues["User Email"], inputValues["Group Name"])
        },
        edit: {
          title: "Edit Group Name",
          popupType: "input",
          userInputs: [
            { label: "New Group Name", placeholder: "Enter New Group Name", value: "", onChange: setNewGroupName }
          ],
          confirmStatus: (inputValues) => editGroupName(groupId, inputValues["New Group Name"])
        },
        delete: {
          title: "Delete Group and Data",
          popupType: "action",
          messageContents: "Are you sure you want to delete this group and its data?",
          confirmStatus: async () => {
            await deleteGroup(groupId);
            setSelectedGroup(null);
          }
        },
        exit: {
          title: "Leave Group",
          popupType: "action",
          messageContents: "Are you sure you want to leave this group chat?",
          confirmStatus: async () => {
            await exitGroup(groupId);
            setSelectedGroup(null);
          }
        },
        groupDetails: {
          title: "View All Group Members",
          popupType: "action",
          confirmStatus: async () => {
            try {
                const members = await fetchAllGroupMembers(groupId);
                setDefaultPopUp({
                  title: "View All Group Members",
                  popupType: "action",
                  messageContents: members.length > 0
                    ? members.map((user) => `${user.firstname} - ${user.email_address}`).join(", ")
                    : "No members found",
                  confirmStatus: null,
                  openStatus: true
                });
              } catch (error) {
                console.error("Error fetching group members:", error);
              }
            }
          }
      };

      if (action !== "groupDetails") {
        setDefaultPopUp({ ...(actionPopups[action] || {}), openStatus: true });
      } else {
        actionPopups.groupDetails.confirmStatus();
      }
  };

return (
  <div className="messaging-container">
    {/* === Sidebar === */}
    <div className="sidebar">
      <h2 className="logo">
        {t.groupChats}
        <TextToSpeech text={t.groupChats} language={language} />
      </h2>

      <div className="groups-list">
        {groups.length === 0 ? (
          <p className="no-groups-message">{t.noGroupsFound}</p>
        ) : (
          groups.map((group) => (
            <div
              key={group.group_id}
              className={`group-item ${selectedGroup?.group_id === group.group_id ? "active" : ""}`}
              onClick={() => setSelectedGroup(group)}
            >
              <span className="group-name">{"\u{1F3E0}"}{group.name}</span>
            </div>
          ))
        )}

      <button className="create-group-button" onClick={() => confirmationPopUp("create")}>
        {t.createNewGroup}
      </button>

      </div>
    </div>


    {/* === Chat Area === */}
    <div className="chat-area">

      {selectedGroup ? (
        <>
          <div className="message-chat-header">
            <h2 className="message-chat-name">{selectedGroup.name}</h2>
            <div className="message-profile-icon" onClick={() => setDropdownMenu(!dropdownMenu)}>
              <h4 className="message-dropdown-icon">{"\u2699"} Settings </h4>

              {dropdownMenu && (
                <div className="message-dropdown-menu">

                  <button className="icon-button" onClick={() => confirmationPopUp("add")}>
                    <span className="icon-border">{"\u270E"}</span>{t.addNewUser}
                  </button>

                  <button className="icon-button" onClick={() => confirmationPopUp("edit", selectedGroup?.group_id)}>
                    <span className="icon-border">{"\u270D"}</span> {t.editGroupName}
                  </button>

                  <button className="icon-button" onClick={() => confirmationPopUp("delete", selectedGroup?.group_id)}>
                    <span className="icon-border">{"\u{1F6D1}"}</span> {t.deleteGroup}
                  </button>

                  <button className="icon-button" onClick={() => confirmationPopUp("exit", selectedGroup?.group_id)}>
                    <span className="icon-border">{"\uD83D\uDEAA"}</span> {t.exitGroup}
                  </button>
                 
                  <button className="icon-button" onClick={() => confirmationPopUp("groupDetails", selectedGroup?.group_id)}>
                    <span className="icon-border">{"\u{1F464}"}</span>{t.viewAllMembers}
                  </button>

                </div>
              )}
            </div>
          </div>

          {/* === Search Bar === */}
          <div className="search-message-bar">
            <input
              type="text"
              className="search-input-field"
              placeholder={t.searchMessages}
              value={searchedMessage}
              onChange={(e) => setSearchedMessage(e.target.value)}
            />
            <button className="search-button" onClick={searchMessage}>
              <span className="search-button-icon">{"\u{1F50D}"}</span>
            </button>
            <button className="clear-search-button" onClick={() => {
              setSearchedMessage("");
              setMessagesFound([]);
              }}>
              {"\u274C"} {t.clearSearch}
            </button>
          </div>

          {/* === Messages List === */}
          <div className="messages-list">
            {(messagesFound.length > 0 ? messagesFound : messages).map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.sender_id === user.id ? "sent" : "received"}`}>
                <div className="message-info">
                  <img
                    src={msg.profile_image_url || profileIcon}
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
                <span className="message-timestamp">{new Date(msg.sent_at).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* === Chat Input Section === */}
          <div className="chat-input">
            <textarea
              className="input-field"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder={t.typeMessagePlaceholder}
            />
            <button className="send-button" onClick={sendMessage}>
              <span className="send-button-icon">{"\u27A1"}</span>
            </button>
          </div>

          {/* === Error Message Display === */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </>
      ) : (
        <div className="no-chat-selected">
          <p>{t.selectGroupToChat}</p>
        </div>
      )}
    </div>

    {/* Declaring Input and Action Popup */}
    {defaultPopUp.openStatus && defaultPopUp.popupType === "input" && (
      <InputMessagePopUp
        openStatus={defaultPopUp.openStatus}
        title={defaultPopUp.title}
        userInputs={defaultPopUp.userInputs}
        closeStatus={() => setDefaultPopUp({ openStatus: false })}
        submitStatus={defaultPopUp.confirmStatus}
        submitMessage={t.yesButton}
    /> )}

    {defaultPopUp.openStatus && defaultPopUp.popupType === "action" && (
      <ActionMessagePopUp
        openStatus = {defaultPopUp.openStatus}
        title = {defaultPopUp.title}
        messageContents={defaultPopUp.messageContents}
        closeStatus={() => setDefaultPopUp({ openStatus: false })}
        submitStatus={defaultPopUp.confirmStatus}
        submitMessage={t.yesButton}
    /> )}
  </div>

  );
};

export default Messages;