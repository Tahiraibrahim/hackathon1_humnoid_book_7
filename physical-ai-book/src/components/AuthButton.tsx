import React from 'react';
import { useAuth } from './AuthContext'; // Path check kar lein

export default function AuthButton() {
  const auth = useAuth();
  
  if (!auth) return null;

  const { user, logout, setShowModal } = auth;

  return (
    <div className="navbar__item">
      {user ? (
        <button 
          onClick={logout} 
          className="button button--secondary button--sm"
        >
          Logout
        </button>
      ) : (
        <button 
          onClick={() => setShowModal(true)} 
          className="button button--primary button--sm"
        >
          Login
        </button>
      )}
      {/* Yahan se <AuthModal /> ki line humne HATA di hai */}
    </div>
  );
}