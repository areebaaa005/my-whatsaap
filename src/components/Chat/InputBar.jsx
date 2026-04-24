import React, { useRef, useState } from 'react';
const EMOJIS = ["😀","😂","❤️","👍","🙏","😊","🔥","💯","🎉","✨"];

export default function InputBar({ msgInput, setMsgInput, sendMsg, handleKey, setShowEmoji, showEmoji, sendImage, sendAudio }) {
  const fileInputRef = useRef(null);
  const [isRec, setIsRec] = useState(false);
  const mediaRecRef = useRef(null);
  const chunksRef = useRef([]);

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecRef.current.onstop = () => {
        sendAudio(new Blob(chunksRef.current, { type: 'audio/webm' }));
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecRef.current.start();
      setIsRec(true);
    } catch { alert("Mic error"); }
  };

  const stopRec = () => { if (mediaRecRef.current && isRec) { mediaRecRef.current.stop(); setIsRec(false); } };

  return (
    <div style={{ position: "relative", background: "#f0f2f5", padding: "10px 16px", minHeight: "62px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      
      {/* Emoji Picker Overlay - Light Theme */}
      {showEmoji && (
        <div style={{ 
          position: "absolute", bottom: "100%", left: 15, background: "#ffffff", 
          padding: "15px", borderRadius: "12px", display: "grid", 
          gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", 
          zIndex: 100, marginBottom: "15px", boxShadow: "0 -4px 15px rgba(0,0,0,0.1)" 
        }}>
          {EMOJIS.map(e => (
            <span key={e} onClick={() => setMsgInput(prev => prev + e)} style={{ cursor: "pointer", fontSize: "24px", transition: "transform 0.1s" }} onMouseOver={(e) => e.target.style.transform = "scale(1.2)"} onMouseOut={(e) => e.target.style.transform = "scale(1)"}>{e}</span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* Left Icons: Emoji & Attachment - Light Mode Colors */}
        <div style={{ display: isRec ? "none" : "flex", gap: "18px", color: "#54656f", alignItems: "center" }}>
          <span onClick={() => setShowEmoji(!showEmoji)} style={{ cursor: "pointer", fontSize: "24px", opacity: 0.9 }}>😊</span>
          <span onClick={() => fileInputRef.current.click()} style={{ cursor: "pointer", fontSize: "22px", transform: "rotate(45deg)", opacity: 0.9 }}>📎</span>
          <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={(e) => { if(e.target.files[0]) sendImage(e.target.files[0]); e.target.value = null; }} />
        </div>

        {/* Input Field / Recording Indicator - Pure White Background */}
        <div style={{ 
          flex: 1, background: "#ffffff", borderRadius: "8px", 
          padding: "0 15px", display: "flex", alignItems: "center", 
          minHeight: "42px", position: "relative" 
        }}>
          {isRec ? (
            <div style={{ color: "#ea0038", fontSize: "14px", flex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "10px", height: "10px", background: "#ea0038", borderRadius: "50%", animation: "pulse 1s infinite" }}></span>
              Recording...
              <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }`}</style>
            </div>
          ) : (
            <input 
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#3b4a54", fontSize: "15px", padding: "10px 0" }} 
              placeholder="Type a message" 
              value={msgInput} 
              onChange={(e) => setMsgInput(e.target.value)} 
              onKeyDown={handleKey} 
            />
          )}
        </div>

        {/* Right Button: Send or Mic */}
        <button 
          onClick={msgInput.trim() ? sendMsg : (isRec ? stopRec : startRec)} 
          style={{ 
            width: "42px", height: "42px", borderRadius: "50%", 
            background: "transparent", border: "none", 
            color: msgInput.trim() ? "#00a884" : (isRec ? "#ea0038" : "#54656f"), 
            cursor: "pointer", fontSize: msgInput.trim() ? "22px" : "24px",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "0.2s"
          }}
        >
          {msgInput.trim() ? "➤" : "🎤"}
        </button>
      </div>
    </div>
  );
}