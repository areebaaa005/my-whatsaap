import React, { useState } from 'react';

export default function ChatWindow({ activeContact, messagesEndRef, initials, startCall }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMsgSearching, setIsMsgSearching] = useState(false);
  const [msgSearchQuery, setMsgSearchQuery] = useState("");

  const renderStatus = (status) => {
    if (status === "sent") return <span style={{ fontSize: 13, color: "#8696a0" }}>✓</span>;
    if (status === "delivered") return <span style={{ fontSize: 13, color: "#8696a0" }}>✓✓</span>;
    if (status === "read") return <span style={{ fontSize: 13, color: "#53bdeb" }}>✓✓</span>;
    return null;
  };

  const filteredMsgs = activeContact.msgs.filter(msg => 
    msg.text && msg.text.toLowerCase().includes(msgSearchQuery.toLowerCase())
  );

  return (
    <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden", height: "100%", background: "#efeae2" }}>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: showInfo ? "1px solid #d1d7db" : "none" }}>
        
        {/* Header - Profile Pic Logic Added */}
        <div style={{ background: "#f0f2f5", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10, borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setShowInfo(true)}>
            <div style={{ 
              width: 40, height: 40, borderRadius: "50%", 
              background: activeContact.color[1], color: activeContact.color[0], 
              display: "flex", alignItems: "center", justifyContent: "center", 
              fontWeight: "600", fontSize: "16px", overflow: "hidden" 
            }}>
              {/* Check if image exists */}
              {activeContact.img ? (
                <img src={activeContact.img} alt={activeContact.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                initials(activeContact.name)
              )}
            </div>
            <div>
              <div style={{ color: "#111b21", fontWeight: 400, fontSize: "16px" }}>{activeContact.name}</div>
              <div style={{ color: "#667781", fontSize: "12px" }}>{activeContact.status}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "22px", color: "#54656f" }}>
            <span style={{ cursor: "pointer" }} title="Video call" onClick={() => startCall?.('video')}>
              <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M19.1,7L15,11.1V8c0-1.1-0.9-2-2-2H4C2.9,6,2,6.9,2,8v8c0,1.1,0.9,2,2,2h9c1.1,0,2-0.9,2-2v-3.1l4.1,4.1c0.3,0.3,0.7,0.3,1,0 c0.2-0.2,0.3-0.4,0.3-0.6V7.6C20.4,7.3,20.2,7,19.9,6.8C19.7,6.6,19.3,6.6,19.1,7L19.1,7z M12.8,16H4V8h8.8V16z"></path></svg>
            </span>
            
            <div 
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "20px", border: "1px solid #d1d7db", background: "#ffffff", cursor: "pointer", transition: "0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.background = "#f0f2f5"}
              onMouseOut={(e) => e.currentTarget.style.background = "#ffffff"}
              onClick={() => startCall?.('audio')}
            >
              <span style={{fontSize: "14px"}}>📞</span> <span style={{ fontSize: "13.5px", color: "#111b21", fontWeight: 500 }}>Call</span>
            </div>

            <span 
              style={{ cursor: "pointer", fontSize: "16px", color: isMsgSearching ? "#00a884" : "#54656f" }}
              onClick={() => setIsMsgSearching(!isMsgSearching)}
            >
              🔍
            </span>
            
            <div style={{ position: 'relative' }}>
              <span style={{ cursor: "pointer", fontSize: "18px" }} onClick={() => setIsMenuOpen(!isMenuOpen)}>⋮</span>
              {isMenuOpen && (
                <div style={{ position: 'absolute', top: '40px', right: '0', background: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '3px', padding: '8px 0', zIndex: 100, width: '180px' }}>
                  <div style={{ padding: '10px 20px', color: '#111b21', cursor: 'pointer', fontSize: '14px' }} onClick={() => { setShowInfo(true); setIsMenuOpen(false); }}>Contact info</div>
                  <div style={{ padding: '10px 20px', color: '#111b21', cursor: 'pointer', fontSize: '14px' }} onClick={() => setIsMenuOpen(false)}>Close chat</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isMsgSearching && (
          <div style={{ background: "#ffffff", padding: "8px 16px", borderBottom: "1px solid #e9edef", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1, background: "#f0f2f5", borderRadius: "8px", display: "flex", alignItems: "center", padding: "0px 12px", height: "35px" }}>
              <span style={{ color: "#54656f", fontSize: "14px" }}>🔍</span>
              <input autoFocus type="text" placeholder="Search messages..." value={msgSearchQuery} onChange={(e) => setMsgSearchQuery(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", color: "#3b4a54", padding: "6px 10px", width: "100%", fontSize: "14px" }} />
              {msgSearchQuery && <span style={{ cursor: "pointer", color: "#54656f" }} onClick={() => setMsgSearchQuery("")}>✕</span>}
            </div>
            <span style={{ cursor: "pointer", color: "#00a884", fontSize: "13px", fontWeight: 500 }} onClick={() => { setIsMsgSearching(false); setMsgSearchQuery(""); }}>Cancel</span>
          </div>
        )}

        {/* Messages Container */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 7%", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", pointerEvents: "none" }}></div>
          
          <div style={{ position: "relative", zIndex: 1 }}>
            {(msgSearchQuery ? filteredMsgs : activeContact.msgs).map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start", marginBottom: 4 }}>
                {msg.type === "call_log" ? (
                  <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.05)", color: "#111b21", padding: "10px 14px", borderRadius: "10px", width: "260px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 1px rgba(0,0,0,0.08)" }}>
                    <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "16px" }}>{msg.callType === "video" ? "📹" : "📞"}</span></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "500", fontSize: "13.5px" }}>{msg.callType === "video" ? "Video call" : "Voice call"}</div>
                      <div style={{ fontSize: "12px", color: "#667781" }}>No answer</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    maxWidth: "75%", 
                    padding: (msg.type === "image" || msg.type === "audio") ? "4px" : "6px 10px", 
                    borderRadius: "8px", 
                    background: msg.from === "me" ? "#d9fdd3" : "#ffffff", 
                    color: "#111b21", 
                    fontSize: "14.2px",
                    boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
                    lineHeight: "1.4"
                  }}>
                    {msg.type === "image" ? (
                      <img src={msg.url} style={{ maxWidth: "100%", borderRadius: 6, display: "block" }} alt="attachment" />
                    ) : msg.type === "audio" ? (
                      <audio src={msg.url} controls style={{ height: "32px", width: "210px" }} />
                    ) : (
                      msg.text
                    )}
                    <div style={{ fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: "2px", color: "#667781" }}>
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

      {/* 2. CONTACT INFO SIDEBAR - Profile Pic Logic Added */}
      {showInfo && (
        <div style={{ width: "30%", minWidth: "350px", background: "#f0f2f5", display: "flex", flexDirection: "column", zIndex: 20, borderLeft: "1px solid #d1d7db", animation: "slideIn 0.2s ease-out" }}>
          <div style={{ background: "#ffffff", padding: "16px 20px", display: "flex", alignItems: "center", gap: "25px", color: "#111b21", height: "60px" }}>
            <span onClick={() => setShowInfo(false)} style={{ cursor: "pointer", fontSize: "18px", color: "#54656f" }}>✕</span>
            <span style={{ fontWeight: 400, fontSize: "16px" }}>Contact info</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 16px", background: "#ffffff", marginBottom: "10px" }}>
              <div style={{ 
                width: 180, height: 180, borderRadius: "50%", 
                background: activeContact.color[1], color: activeContact.color[0], 
                display: "flex", alignItems: "center", justifyContent: "center", 
                fontSize: "65px", marginBottom: "15px", overflow: "hidden" 
              }}>
                {activeContact.img ? (
                  <img src={activeContact.img} alt={activeContact.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  initials(activeContact.name)
                )}
              </div>
              <h2 style={{ color: "#111b21", fontSize: "20px", fontWeight: 400, marginBottom: "4px" }}>{activeContact.name}</h2>
              <p style={{ color: "#667781", fontSize: "14px" }}>+92 323 9704313</p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-around", padding: "18px 0", background: "#ffffff", borderBottom: "8px solid #f0f2f5" }}>
              {[{label: 'Search', icon: '🔍', action: () => { setIsMsgSearching(true); setShowInfo(false); }}, 
                {label: 'Video', icon: '📹', action: () => startCall?.('video')}, 
                {label: 'Voice', icon: '📞', action: () => startCall?.('audio')}].map((item, idx) => (
                <div key={idx} style={{ textAlign: "center", color: "#00a884", cursor: "pointer", flex: 1 }} onClick={item.action}>
                  <div style={{ border: "1px solid #e9edef", width: "40px", height: "40px", borderRadius: "10px", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{item.icon}</div>
                  <span style={{ fontSize: "12px" }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: "20px", background: "#ffffff" }}>
              <p style={{ color: "#667781", fontSize: "14px", marginBottom: "12px" }}>About</p>
              <p style={{ fontSize: "15px", color: "#111b21", lineHeight: "1.5", fontWeight: 400 }}>{activeContact.about || "Hey there! I am using WhatsApp."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}