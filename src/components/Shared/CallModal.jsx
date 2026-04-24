import React, { useState, useEffect } from 'react';

// Is function ko 'export default' karna zaroori hai taake hum bahar use kar saken
export default function CallModal({ contact, type, onEnd }) {
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // Helper for initials (Aap isay props se bhi le sakti hain ya yahan dobara likh sakti hain)
  const getInitials = (name) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000,
      background: type==="video"
        ? "linear-gradient(135deg,#0a1628 0%,#0d2137 50%,#071420 100%)"
        : "linear-gradient(135deg,#075e54 0%,#128c7e 50%,#054640 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between",
      padding:"48px 24px 52px", fontFamily:"'Segoe UI',sans-serif"
    }}>
      {/* Contact info */}
      <div style={{textAlign:"center", position:"relative", zIndex:1}}>
        <div style={{
          width:90, height:90, borderRadius:"50%", margin:"0 auto 16px",
          background:contact.color[1], border:`3px solid ${contact.color[0]}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:28, fontWeight:700, color:contact.color[0]
        }}>{getInitials(contact.name)}</div>
        <div style={{color:"#fff", fontSize:24, fontWeight:600, marginBottom:6}}>{contact.name}</div>
        <div style={{color:"rgba(255,255,255,0.7)", fontSize:14}}>
          {type === "video" ? "📹 Video call" : "📞 Voice call"}
        </div>
        <div style={{color:"#25d366", fontSize:18, fontWeight:600, marginTop:10, letterSpacing:2}}>
          {fmt(seconds)}
        </div>
      </div>

      {/* Call controls */}
      <div style={{position:"relative", zIndex:1, width:"100%", maxWidth:360}}>
        <div style={{display:"flex", justifyContent:"center", gap:20, marginBottom:32}}>
          <button onClick={() => setMuted(!muted)} style={{ width:50, height:50, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.2)", color:"#fff" }}>{muted ? "🔇" : "🎤"}</button>
          <button onClick={onEnd} style={{ width:65, height:65, borderRadius:"50%", background:"#e53935", border:"none", fontSize:24, cursor:"pointer" }}>📵</button>
          <button onClick={() => setSpeakerOn(!speakerOn)} style={{ width:50, height:50, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.2)", color:"#fff" }}>{speakerOn ? "🔊" : "🔈"}</button>
        </div>
      </div>
    </div>
  );
}