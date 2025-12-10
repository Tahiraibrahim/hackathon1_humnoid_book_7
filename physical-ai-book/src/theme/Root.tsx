import React from 'react';

// ✅ Chatbot Import
import ChatBot from '@site/src/components/ChatBot/ChatBot';

// ✅ Auth Imports
import { AuthProvider, useAuth } from '@site/src/components/AuthContext';
import AuthModal from '@site/src/components/AuthModal';

// ✅ Personalization Provider
import { PersonalizationProvider } from '@site/src/components/PersonalizationContext';

// --- Login Button Component (Position Fixed) ---
const LoginButton = () => {
  const auth = useAuth();
  
  if (!auth) return null;

  const { user, logout, setShowModal } = auth;
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '18px',        // Upar se faasla (Height)
      right: '320px',     // 👈 YAHAN CHANGE KIYA: 200px se 320px (Ab ye bohot peeche hat jayega)
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center'
    }}>
      {user ? (
        <button 
          onClick={logout} 
          className="button button--secondary button--sm"
          style={{ 
            border: '1px solid #6200ea',
            padding: '6px 15px',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          Logout ({user.email ? user.email.split('@')[0] : 'User'})
        </button>
      ) : (
        <button 
          onClick={() => setShowModal(true)} 
          className="button button--primary button--sm"
          style={{ 
            background: 'linear-gradient(90deg, #6200ea 0%, #a855f7 100%)', 
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            fontWeight: 'bold',
            borderRadius: '20px',
            boxShadow: '0 4px 10px rgba(98, 0, 234, 0.4)',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          🚀 Login / Signup
        </button>
      )}
    </div>
  );
};

// --- Main Root Component ---
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PersonalizationProvider>
        {children}
        
        {/* Chatbot Humesha Rahega */}
        <ChatBot />
        
        {/* Login Form (Popup) */}
        <AuthModal />
        
        {/* Login Button (Navbar mein) */}
        <LoginButton />
        
      </PersonalizationProvider>
    </AuthProvider>
  );
}