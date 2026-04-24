import React from 'react';

export default function CallScreen({ activeCall, endCall, initials }) {
  const { type, contact } = activeCall;

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#111b21', zIndex: 1000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      
      {/* Background Overlay for Video Call */}
      {type === 'video' && (
        <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0.6 }}></div>
      )}

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Profile Image/Initials */}
        <div style={{ 
          width: 120, height: 120, borderRadius: '50%', 
          background: contact.color[1], color: contact.color[0],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '40px', fontWeight: 'bold', margin: '0 auto 20px',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}>
          {initials(contact.name)}
        </div>

        <h1 style={{ color: '#e9edef', fontSize: '24px', marginBottom: '8px' }}>{contact.name}</h1>
        <p style={{ color: '#8696a0', fontSize: '16px', textTransform: 'capitalize' }}>
          {type === 'video' ? 'Video calling...' : 'Calling...'}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        position: 'absolute', bottom: '100px', display: 'flex', gap: '40px', zIndex: 1 
      }}>
        <div 
          onClick={endCall}
          style={{ 
            width: 60, height: 60, borderRadius: '50%', background: '#ea0038',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}
          title="End Call"
        >
          📞
        </div>
      </div>
    </div>
  );
}