import "./Sidebar.css";
import { useContext, useEffect} from "react"; 
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from 'uuid';

function Sidebar() {
   const{allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId,setPrevChats} = useContext(MyContext);

   const getAllThreads = async() => {
      try {
         const response = await fetch("https://sigma-gpt-2.onrender.com/api/thread");
         const res = await response.json();
         const filteredData = res.map(thread =>({
            threadId: thread.ThreadId,
            title: thread.title,}));
         // console.log(filteredData);
         setAllThreads(filteredData);
      }catch (error) {
         console.error(error);
      }
   };

      useEffect(() => {
         getAllThreads();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [currThreadId])


      const createNewChat = () => {
         setNewChat(true);
         setPrompt("");
         setReply(null);
         setCurrThreadId(uuidv1());
         setPrevChats([]);
      };

      const changeThread = async(newThreadId) => {
         setCurrThreadId(newThreadId);

         try{
            const response = await fetch(`https://sigma-gpt-2.onrender.com/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
         }catch(error){
            console.error(error);
         }
      }

      const deleteThread = async(threadId) => {
         try{
            const response = await fetch(`https://sigma-gpt-2.onrender.com/api/thread/${threadId}`, {method: 'DELETE'});
            const res = await response.json();
            console.log(res);

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if(threadId === currThreadId){
               createNewChat();
            }

            }catch(error){
            console.error(error);
         }
      }   

    return (
        <section className="sidebar"> 

         <button onClick={createNewChat} >
            <img src="/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
            <span><i className="fa-solid fa-pen-to-square"></i></span>
         </button>


         <ul className="history"> 
            {
               allThreads?.map((thread, index) => (
                  <li key={index}
                     onClick={() =>changeThread(thread.threadId)}
                     className={thread.threadId === currThreadId ? "highlighted" : ""}
                  >{thread.title}
                  <i className="fa-solid fa-trash"
                  onClick={(e) =>{
                     e.stopPropagation();
                     deleteThread(thread.threadId);
                  }

                  }
                  ></i>
                  </li>
               ))
            }
         </ul>


             <div className="sign">
                  <p>Made by Pranav Ransing &hearts;</p>
                        <p>
                           <a href="mailto:pranav.ransing@outlook.com" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                              <i className="fa-solid fa-envelope" style={{ marginRight: 6 }}></i>
                              Contact Me
                           </a>
                        </p>
             </div>
        </section>

    )
}
export default Sidebar