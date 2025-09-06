import "./Chat.css";
import{useContext, useState, useEffect} from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github-dark.css';


import { useRef } from "react";

function Chat () {
  const {newChat, prevChats, reply} = useContext(MyContext);
  const[latestReply, setLatestReply] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if(reply == null) {
      setLatestReply(null);
      return;
    }
    if(!prevChats?.length) return;

    const content = reply.split(" ");
    let index = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, index + 1).join(" "));
      index++;
      if(index >= content.length) clearInterval(interval);
    },40 );
    return () => clearInterval(interval);
  },[prevChats, reply])

  // Auto-scroll to bottom when chat updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [prevChats, latestReply]);

  return (
    <>
        {newChat && <h1>What are you working on?</h1>}
        <div className="chats" ref={chatContainerRef} style={{overflowY: 'auto', maxHeight: '80vh'}}>
          {
              prevChats?.slice(0,-1).map((chat, index) => 
                <div className={ chat.role === "user" ? "userDiv" : "gptDiv"} key={index}>
                    {
                      chat.role === "user" ?
                      <p className="userMessage">{chat.content}</p>:
                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                    }
                </div>
              )
          }

                {
                    prevChats.length > 0  && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"} >
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                </div>
                                ) : (
                                    <div className="gptDiv" key={"typing"} >
                                     <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                </div>
                                )

                            }
                        </>
                    )
                }


        </div>
    </>
  )
}

export default Chat