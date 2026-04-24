import React, { useState } from 'react';

export default function Sidebar({ contacts, setActiveId, activeId, initials }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ width: "30%", minWidth: "350px", background: "#111b21", borderRight: "1px solid rgba(134, 150, 160, 0.15)", display: "flex", flexDirection: "column" }}>
      
      {/* Sidebar-specific internal styles for hover */}
      <style>{`
        .contact-item { transition: background 0.2s ease; }
        .contact-item:hover { background: #202c33 !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(134, 150, 160, 0.2); }
      `}</style>

      {/* 1. Sidebar Header */}
      <div style={{ background: "#202c33", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "59px" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#53bdeb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", color: "white", fontSize: "14px" }}>
          AI
        </div>
        <div style={{ display: "flex", gap: "22px", color: "#aebac1", fontSize: "19px" }}>
          <span style={{ cursor: "pointer", opacity: 0.8 }} title="Communities">👥</span>
          <span style={{ cursor: "pointer", opacity: 0.8 }} title="Status">⭕</span>
          <span style={{ cursor: "pointer", opacity: 0.8 }} title="New Chat">💬</span>
          <span style={{ cursor: "pointer", opacity: 0.8 }} title="Menu">⋮</span>
        </div>
      </div>

      {/* 2. Search Bar - Polished */}
      <div style={{ padding: "7px 12px", borderBottom: "1px solid rgba(134, 150, 160, 0.08)" }}>
        <div style={{ background: "#202c33", borderRadius: "8px", display: "flex", alignItems: "center", padding: "0 14px", height: "35px" }}>
          <span style={{ color: "#8696a0", fontSize: "14px", marginTop: "-2px" }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search or start new chat" 
            style={{ background: "none", border: "none", outline: "none", color: "#e9edef", width: "100%", fontSize: "14px", paddingLeft: "15px" }}
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
              padding: "12px 16px", 
              cursor: "pointer", 
              background: activeId === contact.id ? "#2a3942" : "transparent",
              borderBottom: "1px solid rgba(134, 150, 160, 0.08)"
            }}
          >
            {/* Profile Initials Avatar */}
            <div style={{ 
              width: 49, height: 49, borderRadius: "50%", 
              background: contact.color[1], color: contact.color[0], 
              display: "flex", alignItems: "center", justifyContent: "center", 
              fontWeight: "500", marginRight: "15px", fontSize: "17px",
              flexShrink: 0
            }}>
              {initials(contact.name)}
            </div>

            {/* Contact Details */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ color: "#e9edef", fontWeight: 400, fontSize: "16px" }}>{contact.name}</span>
                <span style={{ color: activeId === contact.id ? "#8696a0" : "#00a884", fontSize: "12px", marginTop: "4px" }}>
                  12:45 PM
                </span>
              </div>
              <div style={{ 
                color: "#8696a0", 
                fontSize: "13.5px", 
                whiteSpace: "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis",
                display: "flex",
                alignItems: "center",
                gap: "3px"
              }}>
                {/* Visual indicator for 'me' messages */}
                {contact.msgs.length > 0 && contact.msgs[contact.msgs.length-1].from === "me" && (
                  <span style={{ fontSize: "14px" }}>✓✓ </span>
                )}
                {contact.msgs.length > 0 ? (
                    contact.msgs[contact.msgs.length-1].type === "call_log" 
                    ? `📞 Call Log` 
                    : contact.msgs[contact.msgs.length-1].text
                ) : contact.about}
              </div>
            </div>
          </div>
        ))}
        {filteredContacts.length === 0 && (
          <div style={{ color: "#8696a0", textAlign: "center", padding: "40px 20px", fontSize: "14px" }}>
            No contacts found
          </div>
        )}
      </div>
    </div>
  );
}