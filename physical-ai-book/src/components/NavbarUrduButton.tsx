import React, { useState, useEffect } from 'react';

export default function NavbarUrduButton() {
  const [isUrdu, setIsUrdu] = useState(false);

  // Page load hone par check karo ke Urdu on hai ya nahi
  useEffect(() => {
    const stored = localStorage.getItem('isUrdu');
    if (stored === 'true') {
      setIsUrdu(true);
    }

    // Agar kisi aur tab/window mein change ho to yahan bhi update ho
    const handleStorageChange = () => {
      const newStored = localStorage.getItem('isUrdu');
      setIsUrdu(newStored === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleUrdu = () => {
    const newState = !isUrdu;
    setIsUrdu(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isUrdu', String(newState));
      // Event dispatch karo taake baaki components sun sakein
      window.dispatchEvent(new Event('storage'));
      // Page reload karo taake saari changes foran nazar ayen
      window.location.reload(); 
    }
  };

  return (
    <button
      onClick={toggleUrdu}
      style={{
        backgroundColor: isUrdu ? '#00e676' : '#2979ff', // Green for Urdu, Blue for English
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '20px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '13px',
        marginLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}
    >
      {isUrdu ? '🇵🇰 اردو' : '🇺🇸 EN'}
    </button>
  );
}