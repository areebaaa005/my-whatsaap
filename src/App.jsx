import { useState, useRef, useEffect } from "react";
import SearchBar from './components/Sidebar/SearchBar';
import ContactList from './components/Sidebar/ContactList';
import ChatWindow from './components/Chat/ChatWindow';
import InputBar from './components/Chat/InputBar';
import CallScreen from './components/Chat/CallScreen'; 

const CONTACTS = [
  {
    id: 1, name: "Aisha Rahman", avatar: "AR", color: ["#25d366","#0a2e1a"],
    status: "online", about: "Hey there! I am using WhatsApp",
    msgs: [
      { id:1, from:"them", text:"Assalam o Alaikum! Kya haal hai?", time:"9:01 AM", date:"Today", read:true },
      { id:2, from:"me", text:"Walaikum Assalam! Sab theek, aap sunao?", time:"9:03 AM", date:"Today", read:true },
    ]
  },
  {
    id: 2, name: "Marcus Dev", avatar: "MD", color: ["#128c7e","#0a1f1e"],
    status: "online", about: "Coding all day every day 💻",
    msgs: [
      { id:1, from:"them", text:"Bhai wo React bug fix hua?", time:"Yesterday", date:"Yesterday", read:true },
    ]
  }
];

export default function App() {
  const [contacts, setContacts] = useState(CONTACTS);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [msgInput, setMsgInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeCall, setActiveCall] = useState(null); 

  const messagesEndRef = useRef(null);
  const activeContact = contacts.find(c => c.id === activeId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [contacts, activeId]);

  const initials = (name) => name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "";
  const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getLastMsg = (c) => {
    if (!c.msgs.length) return "";
    const last = c.msgs[c.msgs.length - 1];
    const prefix = last.from === "me" ? "You: " : "";
    if (last.type === "image") return prefix + "📷 Photo";
    if (last.type === "audio") return prefix + "🎤 Voice message";
    if (last.type === "call_log") return (last.callType === "video" ? "📹 Video call" : "📞 Voice call");
    return prefix + last.text;
  };

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

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#111b21", color: "#e9edef", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", overflow: "hidden", position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #00a884; color: white; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(134, 150, 160, 0.2); }
      `}</style>
      
      {activeCall && (
        <CallScreen 
          activeCall={activeCall} 
          endCall={endCall} 
          initials={initials} 
        />
      )}

      {/* Sidebar Section */}
      <div style={{ width: 400, minWidth: 400, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(134, 150, 160, 0.15)" }}>
        <SearchBar search={search} setSearch={setSearch} />
        <ContactList 
          contacts={filteredContacts} 
          activeId={activeId} 
          setActiveId={setActiveId} 
          initials={initials} 
          getTime={getTime} 
          getLastMsg={getLastMsg} 
        />
      </div>
      
      {/* Main Chat/Welcome Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#222e35" }}>
        {activeContact ? (
          <>
            <ChatWindow 
              activeContact={activeContact} 
              messagesEndRef={messagesEndRef} 
              initials={initials} 
              startCall={startCall} 
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
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "6px solid #00a884", background: "#0b141a" }}>
            <div style={{ textAlign: "center", maxWidth: "460px" }}>
              <div style={{ marginBottom: "20px", opacity: 0.8 }}>
                <svg width="350" height="150" viewBox="0 0 400 150">
                  <circle cx="200" cy="75" r="50" fill="#222e35" />
                  <path d="M190 65 L210 75 L190 85 Z" fill="#8696a0" />
                </svg>
              </div>
              <h1 style={{ color: "#e9edef", fontWeight: 300, fontSize: "32px", marginBottom: "14px" }}>WhatsApp Web</h1>
              <p style={{ color: "#8696a0", fontSize: "14px", lineHeight: "1.6", fontWeight: 400 }}>
                Send and receive messages.<br/>
              </p>
              <div style={{ marginTop: "80px", color: "#667781", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                🔒 End-to-end encrypted
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}