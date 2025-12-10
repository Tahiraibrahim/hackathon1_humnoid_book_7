import React from 'react';
// ✅ Imports ab seedha components folder se hain (No /Auth/)
import ChatBot from '@site/src/components/ChatBot/ChatBot';
import { AuthProvider, useAuth } from '@site/src/components/AuthContext';
import AuthModal from '@site/src/components/AuthModal';
import { PersonalizationProvider } from '@site/src/components/PersonalizationContext';

// --- Login Button Component ---
const LoginButton = () => {
  // Safe check taake agar Auth load na ho to crash na kare
  const auth = useAuth();
  
  if (!auth) return null; // Agar auth load nahi hua to button mat dikhao

  const { user, logout, setShowModal } = auth;
  
  return (
    <div style={{ position: 'fixed', top: '16px', right: '100px', zIndex: 1000 }}>
      {user ? (
        <button 
          onClick={logout} 
          className="button button--secondary button--sm"
          style={{ border: '1px solid #6200ea' }}
        >
          Logout ({user.email ? user.email.split('@')[0] : 'User'})
        </button>
      ) : (
        <button 
          onClick={() => setShowModal(true)} 
          className="button button--primary button--sm"
          style={{ background: '#6200ea', color: 'white' }}
        >
          🚀 Login
        </button>
      )}
    </div>
  );
};

// --- Main Root Component ---
export default function Root({children}) {
  return (
    <PersonalizationProvider>
      <AuthProvider>
        {children}

        {/* Chatbot */}
        <ChatBot />

        {/* Login Popup Form */}
        <AuthModal />

        {/* Login Button */}
        <LoginButton />
      </AuthProvider>
    </PersonalizationProvider>
  );
}