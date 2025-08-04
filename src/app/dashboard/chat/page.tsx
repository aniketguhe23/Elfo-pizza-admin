'use client';

import { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Message, Person, Send, SmartToy } from '@mui/icons-material';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

import socket from '@/lib/socket';

// import ProjectApiList from "../api/ProjectApiList";

interface ChatSession {
  user_id: string;
  status: string;
  name: string;
  last_message: string;
  last_message_time: string;
  user: {
    id: string;
    name: string;
  }; // ✅ now an object
  order_id: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'admin';
  content: string;
}

export default function ChatApp() {
  const { apigetAdminUserChatConverstation, apigetAdminChatList, apipostChatsAdminMessages, apiCloseChat } =
    ProjectApiList();

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<string>('default');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [userID, setUserID] = useState('');
  const [orderID, setOrderID] = useState('');
  const [chatStatus, setChatStatus] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminId, setAdminId] = useState<any>('');
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [refreshChat, setRefreshChat] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('adminUser');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed?.id) {
          setAdminId(parsed.id);
        }
      }
    } catch (error) {
      console.error('Error parsing localStorage admin:', error);
    } finally {
      setRestaurantLoading(false);
    }
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      socket.emit('join_room', { userID, adminId });
    });

    socket.on('message_received', (data: any) => {
      if (data.sender_id !== userID) {
        const msg: ChatMessage = {
          id: data._id,
          role: 'admin',
          content: data.message,
        };
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchConversations = async () => {
    const res = await axios.get(`${apigetAdminChatList}/${adminId}`);
    const data = res.data.userChats;
    setChatSessions(data);
  };

  const fetchMessages = async () => {
    const res = await axios.get(
      `${apigetAdminUserChatConverstation}?userId=${userID}&adminId=${adminId}&orderId=${orderID}`
    );
    const data = res.data.data;

    const formatted: ChatMessage[] = data.map((msg: any) => ({
      id: msg._id,
      role: msg.sender_type === 'user' ? 'user' : 'admin',
      content: msg.message,
    }));
    setMessages(formatted);
  };

  useEffect(() => {
    if (adminId) {
      fetchConversations();
    }

    if (userID) {
      fetchMessages();
    }
  }, [userID, adminId, orderID, refreshChat]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!orderID) {
      toast.error('⚠️ Select Order To send message');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const payload = {
      sender_type: 'admin',
      sender_id: adminId,
      receiver_type: 'user',
      receiver_id: userID,
      message: input,
      roomId: `chat-room-${userID}`,
      order_id: orderID, // optional, required if user-admin
    };

    // console.log(payload);

    try {
      const res = await axios.post(apipostChatsAdminMessages, payload);
      socket.emit('send_message', res.data);
      fetchMessages();
    } catch (err) {
      console.error('Sending failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeChatFunc = async () => {
    const payload = {
      orderId: orderID,
    };

    try {
      const res = await axios.post(apiCloseChat, payload);
      fetchConversations();
      setMessages([]);
      setIsConfirmOpen(false);

      return res.data;
    } catch (error: any) {
      toast.error('❌ Failed to send message');
      console.error('Axios error:', error);
      throw error;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // const truncateText = (text: string, charLimit = 30) => {
  //   return text.length > charLimit ? text.slice(0, charLimit) + '...' : text;
  // };
  return (
    <Box sx={{ display: 'flex', height: '90vh' }}>
      {/* Sidebar */}
      <Paper sx={{ width: 300, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1}>
            <Message fontSize="small" /> Chat
          </Typography>
        </Box>
        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {chatSessions.map((chat) => (
            <ListItem
              key={chat.user_id}
              button
              selected={activeChat === chat.order_id}
              onClick={() => {
                setActiveChat(chat.order_id);
                setUserID(chat.user_id);
                setOrderID(chat.order_id);
                setChatStatus(chat.status);
                setUserName(chat?.user?.name || 'Unknown');
                setRefreshChat((prev) => !prev);
              }}
              className={`rounded-md transition-all ${
                activeChat === chat.order_id
                  ? 'bg-blue-200 dark:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ListItemAvatar>
                <Avatar>
                  <Message fontSize="small" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={chat?.user?.name || 'No Name'}
                secondary={
                  chat.last_message ? (
                    <>
                      <span className="text-sm text-gray-800">#{chat.order_id}</span>
                      {/* <br /> */}
                      {/* <span className="text-sm text-gray-800">{truncateText(chat.last_message)}</span> */}
                      <br />
                      <span className="text-xs text-gray-200">{formatDate(chat.last_message_time)}</span>
                    </>
                  ) : (
                    'No messages yet'
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat Area */}
      <Box
        sx={{
          height: '84vh', // or use a fixed height like '600px'
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexShrink: 0,
          }}
        >
          <Avatar>
            <SmartToy fontSize="small" />
          </Avatar>
          <Typography fontWeight="bold">{userName}</Typography>
          {orderID && (
            <Button variant="outlined" color="error" size="small" onClick={() => setIsConfirmOpen(true)}>
              End Chat
            </Button>
          )}
        </Box>

        {/* Chat Messages */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: 'auto',
          }}
        >
          {/* Show "Chat is closed" notice above messages */}
          {chatStatus === 'closed' && (
            <Box textAlign="center" mb={2}>
              <Typography variant="h6" color="error">
                Chat is closed
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can no longer send messages in this conversation.
              </Typography>
            </Box>
          )}

          {/* No messages yet */}
          {messages.length === 0 && !isLoading ? (
            <Box textAlign="center" pt={10}>
              <Message sx={{ fontSize: 48, color: 'gray' }} />
              <Typography variant="h6" color="gray">
                No messages yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a user to start chatting
              </Typography>
            </Box>
          ) : (
            messages.map((msg) => (
              <Box
                key={msg.id}
                display="flex"
                justifyContent={msg.role === 'admin' ? 'flex-end' : 'flex-start'}
                alignItems="center"
                mb={1}
              >
                {msg.role === 'user' && (
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                    <Person fontSize="small" />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: 400,
                    backgroundColor: msg.role === 'admin' ? 'primary.main' : 'grey.100',
                    color: msg.role === 'admin' ? '#fff' : 'text.primary',
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                </Paper>
                {msg.role === 'admin' && (
                  <Avatar sx={{ width: 32, height: 32, ml: 1 }}>
                    <SmartToy fontSize="small" />
                  </Avatar>
                )}
              </Box>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <Box display="flex" alignItems="center" mt={1}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2">Sending...</Typography>
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            p: 1,
            borderTop: 1,
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={chatStatus === 'closed' ? 'Chat is closed' : 'Type your message...'}
            value={input}
            onChange={handleInputChange}
            disabled={isLoading || chatStatus === 'closed'}
          />

          <IconButton type="submit" color="primary" disabled={isLoading || !input.trim()}>
            <Send />
          </IconButton>
        </Paper>
      </Box>

      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <DialogTitle>End Chat?</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to end the chat? </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              closeChatFunc();
            }}
            color="error"
            autoFocus
          >
            End Chat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
