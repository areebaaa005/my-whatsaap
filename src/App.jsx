import { useState, useRef, useEffect } from "react";
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/Chat/ChatWindow';
import InputBar from './components/Chat/InputBar';
import CallScreen from './components/Chat/CallScreen'; 

const CONTACTS = [
  {
    id: 1, 
    name: "Aisha Rahman", 
    avatar: "AR", 
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop", 
    color: ["#ffffff","#00a884"],
    status: "online", 
    about: "Hey there! I am using WhatsApp",
    msgs: [
      { id:1, from:"them", text:"Assalam o Alaikum! Kya haal hai?", time:"9:01 AM", date:"Today", read:true },
      { id:2, from:"me", text:"Walaikum Assalam! Sab theek, aap sunao?", time:"9:03 AM", date:"Today", status:"read" },
    ]
  },
  {
    id: 2, 
    name: "Marcus Dev", 
    avatar: "MD", 
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop", 
    color: ["#ffffff","#53bdeb"],
    status: "online", 
    about: "Coding all day every day 💻",
    msgs: [
      { id:1, from:"them", text:"Bhai wo React bug fix hua?", time:"Yesterday", date:"Yesterday", read:true },
    ]
  }
];

export default function App() {
  const [contacts, setContacts] = useState(CONTACTS);
  const [activeId, setActiveId] = useState(null);
  const [msgInput, setMsgInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeCall, setActiveCall] = useState(null); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const messagesEndRef = useRef(null);
  const activeContact = contacts.find(c => c.id === activeId);

  // Responsiveness check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [contacts, activeId]);

  const initials = (name) => name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "";
  const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const startCall = (type) => {
    if (!activeContact) return;
    setActiveCall({ type, contact: activeContact });
  };

  const endCall = () => {
    if (activeCall) {
      const callMsg = {
        id: Date.now(),
        from: "me",
        type: "call_log",
        callType: activeCall.type,
        time: getTime(),
        date: "Today",
        status: "read"
      };
      setContacts(prev => prev.map(c => 
        c.id === activeCall.contact.id ? { ...c, msgs: [...c.msgs, callMsg] } : c
      ));
    }
    setActiveCall(null);
  };

  const sendAudio = (audioBlob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const newMsg = { id: Date.now(), from: "me", type: "audio", url: audioUrl, time: getTime(), date: "Today", status: "sent" };
    updateMessages(newMsg);
  };

  const sendImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newMsg = { id: Date.now(), from: "me", type: "image", url: e.target.result, time: getTime(), date: "Today", status: "sent" };
      updateMessages(newMsg);
    };
    reader.readAsDataURL(file);
  };

  const sendMsg = () => {
    if (!msgInput.trim() || !activeId) return;
    const userText = msgInput.trim().toLowerCase();
    const newMsg = { id: Date.now(), from: "me", text: msgInput.trim(), time: getTime(), date: "Today", status: "sent" };
    
    updateMessages(newMsg);
    setMsgInput("");
    setShowEmoji(false);

    setTimeout(() => {
      let replyText = "Thinking...";
      if (userText === "hlo" || userText === "hi") replyText = "Hi Areeba! How are you?";
      else if (userText.includes("how are you")) replyText = "I am fine, thanks for asking!";
      
      const replyMsg = { id: Date.now() + 1, from: "them", text: replyText, time: getTime(), date: "Today", read: false };
      
      setContacts(prev => prev.map(c => {
        if (c.id === activeId) {
          const updatedMsgs = c.msgs.map(m => m.from === "me" ? { ...m, status: "read" } : m);
          return { ...c, msgs: [...updatedMsgs, replyMsg] };
        }
        return c;
      }));
    }, 2000);
  };

  const updateMessages = (newMsg) => {
    setContacts(prev => prev.map(c => c.id === activeId ? { ...c, msgs: [...c.msgs, newMsg] } : c));
    setTimeout(() => {
      setContacts(prev => prev.map(c => ({
        ...c, msgs: c.msgs.map(m => m.id === newMsg.id ? { ...m, status: "delivered" } : m)
      })));
    }, 1000);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } };

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      width: "100vw", 
      background: "#f0f2f5", 
      color: "#111b21", 
      fontFamily: "Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif", 
      overflow: "hidden", 
      position: "relative" 
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); }
      `}</style>
      
      {activeCall && (
        <CallScreen 
          activeCall={activeCall} 
          endCall={endCall} 
          initials={initials} 
        />
      )}

      {/* Sidebar - Hide if mobile and a contact is active */}
      {(!isMobile || !activeId) && (
        <Sidebar 
          contacts={contacts} 
          activeId={activeId} 
          setActiveId={setActiveId} 
          initials={initials} 
        />
      )}
      
      {/* Chat Area - Hide if mobile and NO contact is active */}
      {(!isMobile || activeId) && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#efeae2" }}>
          {activeContact ? (
            <>
              <ChatWindow 
                activeContact={activeContact} 
                messagesEndRef={messagesEndRef} 
                initials={initials} 
                startCall={startCall} 
                setActiveId={setActiveId} // Important for Back button
              />
              <InputBar 
                msgInput={msgInput} 
                setMsgInput={setMsgInput} 
                sendMsg={sendMsg} 
                handleKey={handleKey} 
                setShowEmoji={setShowEmoji} 
                showEmoji={showEmoji} 
                sendImage={sendImage} 
                sendAudio={sendAudio} 
              />
            </>
          ) : (
            <div style={{ 
              flex: 1, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              background: "#f8f9fa", 
              borderBottom: "6px solid #43c453", 
              position: "relative"
            }}>
              <div style={{ textAlign: "center", maxWidth: "560px", padding: "20px" }}>
                <div style={{ marginBottom: "30px" }}>
                  <div style={{ fontSize: isMobile ? "60px" : "100px", color: "#cbd5e0", marginBottom: "20px" }}>📱</div>
                </div>
                <h1 style={{ color: "#41525d", fontWeight: 300, fontSize: isMobile ? "24px" : "32px", marginBottom: "14px" }}>WhatsApp Web</h1>
                <p style={{ color: "#667781", fontSize: "14px", lineHeight: "1.6", fontWeight: 400 }}>
                  Send and receive messages without keeping your phone online.
                </p>
                <div style={{ marginTop: "80px", color: "#8696a0", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px" }}>🔒</span> End-to-end encrypted
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}