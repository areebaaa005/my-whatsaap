export default function ContactList({ contacts, activeId, setActiveId, initials, getTime, getLastMsg, getUnread }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#111b21" }}>
      {contacts.map(c => (
        <div 
          key={c.id} 
          onClick={() => setActiveId(c.id)}
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer",
            background: activeId === c.id ? "#2a3942" : "transparent",
            borderBottom: "1px solid #1e2b33"
          }}
        >
          <div style={{ width: 45, height: 45, borderRadius: "50%", background: c.color[1], color: c.color[0], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            {initials(c.name)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#e9edef" }}>
              <span>{c.name}</span>
              <span style={{ fontSize: 12, color: "#8696a0" }}>{getTime(c)}</span>
            </div>
            <div style={{ color: "#8696a0", fontSize: 13 }}>{getLastMsg(c)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}