import React, { useState, useEffect } from 'react';

export default function Sidebar({ contacts, setActiveId, activeId, initials }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Screen size check karne ke liye taake design mobile ke mutabiq ho
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mobile logic: Agar koi chat select ho toh sidebar hide ho jaye
  if (isMobile && activeId) return null;

  return (
    <div style={{ 
      width: isMobile ? "100%" : "30%", // Mobile par full width
      minWidth: isMobile ? "100%" : "350px", 
      background: "#ffffff", 
      borderRight: "1px solid #e9edef", 
      display: "flex", 
      flexDirection: "column",
      height: "100%",
      position: "relative"
    }}>
      
      <style>{`
        .contact-item { transition: background 0.1s ease; }
        .contact-item:hover { background: #f5f6f6 !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); }
      `}</style>

      {/* 1. Sidebar Header */}
      <div style={{ 
        background: "#f0f2f5", 
        padding: "10px 16px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        height: "59px" 
      }}>
        <div style={{ 
          width: 40, height: 40, borderRadius: "50%", 
          background: "#00a884", display: "flex", 
          alignItems: "center", justifyContent: "center", 
          fontWeight: "600", color: "white", fontSize: "14px",
          cursor: "pointer", overflow: "hidden"
        }}>
          <img 
            src="https://randomuser.me/api/portraits/lego/1.jpg" 
            alt="Me" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </div>
        <div style={{ display: "flex", gap: isMobile ? "18px" : "24px", color: "#54656f", fontSize: "20px" }}>
          <span style={{ cursor: "pointer", opacity: 0.9 }} title="Communities">👥</span>
          <span style={{ cursor: "pointer", opacity: 0.9 }} title="Status">⭕</span>
          <span style={{ cursor: "pointer", opacity: 0.9 }} title="New Chat">💬</span>
          <span style={{ cursor: "pointer", opacity: 0.9 }} title="Menu">⋮</span>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div style={{ padding: "7px 12px", background: "#ffffff" }}>
        <div style={{ 
          background: "#f0f2f5", 
          borderRadius: "8px", 
          display: "flex", 
          alignItems: "center", 
          padding: "0 12px", 
          height: "35px" 
        }}>
          <span style={{ color: "#54656f", fontSize: "14px" }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search or start new chat" 
            style={{ 
              background: "none", border: "none", outline: "none", 
              color: "#3b4a54", width: "100%", fontSize: "14px", 
              paddingLeft: "15px", fontWeight: "400" 
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Contacts List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filteredContacts.map((contact) => (
          <div 
            key={contact.id} 
            className="contact-item"
            onClick={() => setActiveId(contact.id)}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              height: "72px", 
              padding: "0 16px", 
              cursor: "pointer", 
              background: activeId === contact.id ? "#f0f2f5" : "transparent"
            }}
          >
            <div style={{ 
              width: 49, height: 49, borderRadius: "50%", 
              background: contact.color[1], color: contact.color[0], 
              display: "flex", alignItems: "center", justifyContent: "center", 
              fontWeight: "500", marginRight: "15px", fontSize: "17px",
              flexShrink: 0, overflow: "hidden"
            }}>
              {contact.img ? (
                <img 
                  src={contact.img} 
                  alt={contact.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              ) : (
                initials(contact.name)
              )}
            </div>

            <div style={{ 
              flex: 1, 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "center",
              borderBottom: "1px solid #f2f2f2" 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ color: "#111b21", fontSize: "16.5px", fontWeight: "400" }}>
                  {contact.name}
                </span>
                <span style={{ 
                  color: "#667781", 
                  fontSize: "12px" 
                }}>
                  12:45 PM
                </span>
              </div>
              
              <div style={{ 
                color: "#667781", 
                fontSize: "13.5px", 
                marginTop: "2px",
                whiteSpace: "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                {contact.msgs.length > 0 && contact.msgs[contact.msgs.length-1].from === "me" && (
                  <span style={{ color: "#53bdeb", fontSize: "15px" }}>✓✓ </span>
                )}
                
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {contact.msgs.length > 0 ? (
                      contact.msgs[contact.msgs.length-1].type === "call_log" 
                      ? `📞 Call Log` 
                      : contact.msgs[contact.msgs.length-1].text
                  ) : contact.about}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredContacts.length === 0 && (
          <div style={{ color: "#667781", textAlign: "center", padding: "40px 20px", fontSize: "14px" }}>
            No chats, contacts or messages found
          </div>
        )}
      </div>
    </div>
  );
}