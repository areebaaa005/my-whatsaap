import React from 'react';

export default function SearchBar({ search, setSearch }) {
  return (
    <div style={{ padding: "8px 12px", background: "#111b21" }}>
      <div style={{ 
        background: "#202c33", 
        display: "flex", 
        alignItems: "center", 
        padding: "0 14px", 
        borderRadius: "8px",
        height: "35px",
        position: "relative"
      }}>
        {/* Search Icon */}
        <span style={{ color: "#8696a0", fontSize: "14px", marginRight: "15px" }}>🔍</span>
        
        <input 
          style={{ 
            flex: 1, 
            background: "none", 
            border: "none", 
            outline: "none", 
            color: "#e9edef", 
            fontSize: "14px" 
          }}
          placeholder="Search or start new chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Cross (Clear) Icon - Only shows if search is not empty */}
        {search && (
          <span 
            onClick={() => setSearch("")}
            style={{ 
              color: "#00a884", 
              cursor: "pointer", 
              fontSize: "18px",
              fontWeight: "bold",
              padding: "0 5px"
            }}
            title="Clear search"
          >
            ✕
          </span>
        )}
      </div>
    </div>
  );
}