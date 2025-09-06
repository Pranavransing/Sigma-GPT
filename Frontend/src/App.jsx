
import './App.css'
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from "./MyContext.jsx"
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from 'uuid';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all previous chats in the current thread
  const [newChat, setNewChat] = useState(true); //to indicate if new chat is started
  const [allThreads, setAllThreads] = useState([]); //stores all chat threads
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const providerValue = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    theme, setTheme
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValue}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  )
}

export default App
