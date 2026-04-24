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
    <div style={{ position: "relative", background: "#202c33", padding: "10px 16px" }}>
      {showEmoji && (
        <div style={{ position: "absolute", bottom: "100%", left: 15, background: "#233138", padding: 10, borderRadius: 10, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, zIndex: 100, marginBottom: 10 }}>
          {EMOJIS.map(e => <span key={e} onClick={() => setMsgInput(prev => prev + e)} style={{ cursor: "pointer", fontSize: 22 }}>{e}</span>)}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div style={{ display: isRec ? "none" : "flex", gap: "18px", color: "#8696a0" }}>
          <span onClick={() => setShowEmoji(!showEmoji)} style={{ cursor: "pointer", fontSize: "26px" }}>😊</span>
          <span onClick={() => fileInputRef.current.click()} style={{ cursor: "pointer", fontSize: "24px", transform: "rotate(45deg)" }}>📎</span>
          <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={(e) => { if(e.target.files[0]) sendImage(e.target.files[0]); e.target.value = null; }} />
        </div>
        <div style={{ flex: 1, background: "#2a3942", borderRadius: "24px", padding: "2px 18px", display: "flex", alignItems: "center", minHeight: "44px" }}>
          {isRec ? <div style={{ color: "#ff4b4b", fontSize: "14px", flex: 1 }}>Recording...</div> : 
          <input style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#e9edef", fontSize: "15px", padding: "10px 0" }} placeholder="Type a message" value={msgInput} onChange={(e) => setMsgInput(e.target.value)} onKeyDown={handleKey} />}
        </div>
        <button onClick={msgInput.trim() ? sendMsg : (isRec ? stopRec : startRec)} style={{ width: 44, height: 44, borderRadius: "50%", background: (msgInput.trim() || isRec) ? "#00a884" : "transparent", border: "none", color: (msgInput.trim() || isRec) ? "#fff" : "#8696a0", cursor: "pointer", fontSize: msgInput.trim() ? "18px" : "24px" }}>
          {msgInput.trim() ? "➤" : "🎤"}
        </button>
      </div>
    </div>
  );
}