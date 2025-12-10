import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import styles from './AuthModal.module.css';

const AuthModal = () => {
  const { showModal, setShowModal, login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [softBg, setSoftBg] = useState("Beginner");
  const [hardBg, setHardBg] = useState("None");

  if (!showModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      await signup({ email, password, name, software_background: softBg, hardware_background: hardBg });
    } else {
      await login(email, password);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} Login coming soon! (Needs API Keys)`);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={() => setShowModal(false)}>✕</button>
        
        <div className={styles.header}>
          <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
          <p>{isSignup ? "Join the AI Revolution today!" : "Please enter your details to sign in."}</p>
        </div>

        {/* --- Social Login Buttons --- */}
        <div className={styles.socialButtons}>
          <button type="button" className={styles.googleBtn} onClick={() => handleSocialLogin('Google')}>
            <span style={{marginRight: '10px'}}>🌐</span> Continue with Google
          </button>
          <button type="button" className={styles.githubBtn} onClick={() => handleSocialLogin('GitHub')}>
            <span style={{marginRight: '10px'}}>🐙</span> Continue with GitHub
          </button>
        </div>

        <div className={styles.divider}>
          <span>OR</span>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignup && (
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {/* Bonus Questions */}
          {isSignup && (
            <div className={styles.extrasRow}>
              <div className={styles.selectGroup}>
                <label>Software Exp:</label>
                <select value={softBg} onChange={e => setSoftBg(e.target.value)}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className={styles.selectGroup}>
                <label>Hardware Exp:</label>
                <select value={hardBg} onChange={e => setHardBg(e.target.value)}>
                  <option value="None">Newbie</option>
                  <option value="Arduino">Arduino</option>
                  <option value="Professional">Pro</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            {isSignup ? "Sign Up with Email" : "Log In"}
          </button>
        </form>

        <div className={styles.footer}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Log In" : " Sign Up"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;