import { createContext, useContext, useState } from "react";
import {AuthContext } from './AuthContext'
import toast from "react-hot-toast";
import { useEffect } from "react";
 
export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {

    const [messages,setMessages] = useState([])  // to store messages of selected user
    const [users,setUsers] = useState([])   // to store all users at left side
    const [selectedUser,setSelectedUser] = useState(null)  // to store id of user with whoom we want to chat 
    const [unseenMessages,setUnseenMessages] = useState({}) //  id + unseen msg

    const { socket , axios }  = useContext(AuthContext)

    // function to get all users for sidebar
    const getUsers = async () => {
        try {
            const {data} = await axios.get("/api/messages/users")
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to get messages for selected user
    const getMessages =async (userId) => {
        try {
            const {data}= await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to send message to selected user
    const sendMessage=async (messageData) => {
        try {
             const {data}= await axios.post(`/api/messages/send/${selectedUser._id}`,messageData)
              if (data.success) {
                setMessages((prevMessages)=>[...prevMessages,data.newMessage])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to subscribe to messages for selected users i.e to get msg instantly at real time
    const subscribeToMessages = async () => {
        if(!socket) return; 

        // when new msg emit on socket then the msg will get here in parameter   and displayed on chat box also 
        socket.on("newMessage",(newMessage)=>{
            if (selectedUser && newMessage.senderId === selectedUser._id) {  // condi for chatbox open 
                newMessage.seen = true;
                setMessages((prevMessages)=>[...prevMessages,newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }else{   //  newMessage.senderId != selectedUser._id
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,[newMessage.senderId] :
                    prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    } 

    // function to unsubscribe from messages
    const unsubscribeFromMessages = ()=>{
        if (socket) socket.off("newMessage")
          // socket is connected then 
    }

    useEffect(()=>{
        subscribeToMessages()
        return ()=> unsubscribeFromMessages()
        
    },[socket,selectedUser])

    const value ={
        messages,users, selectedUser,getUsers,getMessages,sendMessage,
        setSelectedUser,unseenMessages,setUnseenMessages
    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

// gemini start
  