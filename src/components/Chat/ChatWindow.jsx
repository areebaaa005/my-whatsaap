import React, { useState } from 'react';

export default function ChatWindow({ activeContact, messagesEndRef, initials, startCall }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMsgSearching, setIsMsgSearching] = useState(false);
  const [msgSearchQuery, setMsgSearchQuery] = useState("");

  const renderStatus = (status) => {
    if (status === "sent") return <span style={{ fontSize: 12, color: "#8696a0" }}>✓</span>;
    if (status === "delivered") return <span style={{ fontSize: 12, color: "#8696a0" }}>✓✓</span>;
    if (status === "read") return <span style={{ fontSize: 12, color: "#53bdeb" }}>✓✓</span>;
    return null;
  };

  const filteredMsgs = activeContact.msgs.filter(msg => 
    msg.text && msg.text.toLowerCase().includes(msgSearchQuery.toLowerCase())
  );

  return (
    <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden", height: "100%", background: "#0b141a" }}>
      
      {/* 1. MAIN CHAT AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: showInfo ? "1px solid rgba(134, 150, 160, 0.15)" : "none" }}>
        
        {/* Header - Glass Effect */}
        <div style={{ background: "#202c33", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setShowInfo(true)}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: activeContact.color[1], color: activeContact.color[0], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px" }}>
              {initials(activeContact.name)}
            </div>
            <div>
              <div style={{ color: "#e9edef", fontWeight: 500, fontSize: "16px" }}>{activeContact.name}</div>
              <div style={{ color: "#8696a0", fontSize: "12.5px" }}>{activeContact.status}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "22px", color: "#aebac1" }}>
            <span style={{ cursor: "pointer", opacity: 0.9 }} title="Video call" onClick={() => startCall?.('video')}>
              <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M19.1,7L15,11.1V8c0-1.1-0.9-2-2-2H4C2.9,6,2,6.9,2,8v8c0,1.1,0.9,2,2,2h9c1.1,0,2-0.9,2-2v-3.1l4.1,4.1c0.3,0.3,0.7,0.3,1,0 c0.2-0.2,0.3-0.4,0.3-0.6V7.6C20.4,7.3,20.2,7,19.9,6.8C19.7,6.6,19.3,6.6,19.1,7L19.1,7z M12.8,16H4V8h8.8V16z M18.4,14.6l-3.4-3.4 v-0.4l3.4-3.4V14.6z"></path></svg>
            </span>
            
            <div 
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "20px", border: "1px solid #3b4a54", cursor: "pointer", transition: "0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.background = "#2a3942"}
              onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
              onClick={() => startCall?.('audio')}
            >
              <span style={{fontSize: "16px"}}>📞</span> <span style={{ fontSize: "14px", color: "#e9edef", fontWeight: 500 }}>Call</span>
            </div>

            <span 
              style={{ cursor: "pointer", fontSize: "18px", color: isMsgSearching ? "#00a884" : "#aebac1" }}
              onClick={() => setIsMsgSearching(!isMsgSearching)}
            >
              🔍
            </span>
            
            <div style={{ position: 'relative' }}>
              <span style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => setIsMenuOpen(!isMenuOpen)}>⋮</span>
              {isMenuOpen && (
                <div style={{ position: 'absolute', top: '40px', right: '0', background: '#233138', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', borderRadius: '3px', padding: '8px 0', zIndex: 100, width: '180px', animation: "fadeIn 0.2s" }}>
                  <div style={{ padding: '10px 20px', color: '#e9edef', cursor: 'pointer', fontSize: '14.5px' }} onClick={() => { setShowInfo(true); setIsMenuOpen(false); }}>Contact info</div>
                  <div style={{ padding: '10px 20px', color: '#e9edef', cursor: 'pointer', fontSize: '14.5px' }} onClick={() => setIsMenuOpen(false)}>Close chat</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar UI */}
        {isMsgSearching && (
          <div style={{ background: "#111b21", padding: "8px 16px", borderBottom: "1px solid #2a3942", display: "flex", alignItems: "center", gap: "10px", animation: "slideDown 0.2s ease" }}>
            <div style={{ flex: 1, background: "#202c33", borderRadius: "8px", display: "flex", alignItems: "center", padding: "4px 12px" }}>
              <span style={{ color: "#8696a0" }}>🔍</span>
              <input autoFocus type="text" placeholder="Search messages..." value={msgSearchQuery} onChange={(e) => setMsgSearchQuery(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", color: "#e9edef", padding: "6px 10px", width: "100%" }} />
              {msgSearchQuery && <span style={{ cursor: "pointer", color: "#8696a0" }} onClick={() => setMsgSearchQuery("")}>✕</span>}
            </div>
            <span style={{ cursor: "pointer", color: "#00a884", fontSize: "14px", fontWeight: 500 }} onClick={() => { setIsMsgSearching(false); setMsgSearchQuery(""); }}>Cancel</span>
          </div>
        )}

        {/* Messages Container - With Subtle Pattern */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 7%", background: "#0b141a", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", pointerEvents: "none" }}></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            {(msgSearchQuery ? filteredMsgs : activeContact.msgs).map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start", marginBottom: 6 }}>
                {msg.type === "call_log" ? (
                  <div style={{ background: "#d9fdd3", color: "#111b21", padding: "8px 12px", borderRadius: "10px", width: "280px", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 1px 1px rgba(0,0,0,0.2)" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "18px" }}>{msg.callType === "video" ? "📹" : "📞"}</span></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "500", fontSize: "14px" }}>{msg.callType === "video" ? "Video call" : "Voice call"}</div>
                      <div style={{ fontSize: "12px", color: "#667781" }}>No answer</div>
                    </div>
                    <div style={{ fontSize: "11px", color: "#667781", alignSelf: "flex-end" }}>{msg.time}</div>
                  </div>
                ) : (
                  <div style={{ 
                    maxWidth: "75%", 
                    padding: (msg.type === "image" || msg.type === "audio") ? "4px" : "8px 12px", 
                    borderRadius: msg.from === "me" ? "8px 0px 8px 8px" : "0px 8px 8px 8px", // Tail effect
                    background: msg.from === "me" ? "#005c4b" : "#202c33", 
                    color: "#e9edef", 
                    fontSize: "14.2px",
                    boxShadow: "0 1px 0.5px rgba(0,0,0,0.15)",
                    position: "relative"
                  }}>
                    {msg.type === "image" ? (
                      <img src={msg.url} style={{ maxWidth: "100%", borderRadius: 6, display: "block" }} alt="attachment" />
                    ) : msg.type === "audio" ? (
                      <audio src={msg.url} controls style={{ height: "32px", filter: "invert(100%)", width: "220px" }} />
                    ) : (
                      msg.text
                    )}
                    <div style={{ fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 4, opacity: 0.8 }}>
                      {msg.time} {msg.from === "me" && renderStatus(msg.status)}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* 2. CONTACT INFO SIDEBAR - Improved Design */}
      {showInfo && (
        <div style={{ width: "350px", background: "#111b21", display: "flex", flexDirection: "column", zIndex: 20, borderLeft: "1px solid #2a3942", animation: "slideIn 0.3s ease" }}>
          <style>{`
            @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            @keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
          `}</style>
          
          <div style={{ background: "#202c33", padding: "16px 20px", display: "flex", alignItems: "center", gap: "25px", color: "#e9edef" }}>
            <span onClick={() => setShowInfo(false)} style={{ cursor: "pointer", fontSize: "20px" }}>✕</span>
            <span style={{ fontWeight: 500, fontSize: "16px" }}>Contact info</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", background: "#0b141a" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 16px", background: "#111b21", marginBottom: "10px" }}>
              <div style={{ width: 160, height: 160, borderRadius: "50%", background: activeContact.color[1], color: activeContact.color[0], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "60px", marginBottom: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                {initials(activeContact.name)}
              </div>
              <h2 style={{ color: "#e9edef", fontSize: "22px", fontWeight: 400, marginBottom: "5px" }}>{activeContact.name}</h2>
              <p style={{ color: "#8696a0", fontSize: "15px" }}>+92 323 9704313</p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-around", padding: "18px 0", background: "#111b21", borderBottom: "8px solid #0c1317" }}>
              {[{label: 'Search', icon: '🔍', action: () => { setIsMsgSearching(true); setShowInfo(false); }}, 
                {label: 'Video', icon: '📹', action: () => startCall?.('video')}, 
                {label: 'Voice', icon: '📞', action: () => startCall?.('audio')}].map((item, idx) => (
                <div key={idx} style={{ textAlign: "center", color: "#00a884", cursor: "pointer", flex: 1 }} onClick={item.action}>
                  <div style={{ border: "1px solid #2a3942", width: "45px", height: "45px", borderRadius: "12px", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{item.icon}</div>
                  <span style={{ fontSize: "13px" }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: "20px", background: "#111b21" }}>
              <p style={{ color: "#8696a0", fontSize: "14px", marginBottom: "12px" }}>About</p>
              <p style={{ fontSize: "15px", color: "#e9edef", lineHeight: "1.5" }}>{activeContact.about || "Hey there! I am using WhatsApp."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}