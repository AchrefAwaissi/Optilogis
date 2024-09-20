import React, { useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUser, faLock } from "@fortawesome/free-solid-svg-icons";

interface SignInProps {
  onClose: () => void;
  onToggleForm: () => void;
  onSuccess: (user: { username: string }) => void;
}

const SignIn: React.FC<SignInProps> = ({ onClose, onToggleForm, onSuccess }) => {
  const { signin } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await signin(formData.username, formData.password);
      console.log('Sign in successful');
      onSuccess({ username: formData.username });
    } catch (err) {
      setError("An error occurred during sign in");
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      padding: '40px',
      fontFamily: 'Montserrat, sans-serif',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      position: 'relative' as const,
      width: '400px',
    },
    closeButton: {
      position: 'absolute' as const,
      top: '20px',
      right: '20px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#5c5c5c',
    },
    title: {
      color: '#5c5c5c',
      fontSize: '36px',
      fontWeight: 700,
      marginBottom: '30px',
    },
    form: {
      width: '100%',
    },
    inputContainer: {
      position: 'relative' as const,
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      height: '60px',
      backgroundColor: '#ffffff',
      borderRadius: '30px',
      border: '1px solid #c0c0c0',
      padding: '0 20px 0 50px',
      fontSize: '18px',
      outline: 'none',
    },
    icon: {
      position: 'absolute' as const,
      top: '50%',
      left: '20px',
      transform: 'translateY(-50%)',
      color: '#095550',
      fontSize: '20px',
    },
    forgotPassword: {
      color: '#707070',
      fontSize: '14px',
      fontWeight: 500,
      textAlign: 'right' as const,
      marginBottom: '15px',
      cursor: 'pointer',
    },
    rememberMe: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      fontSize: '14px',
      color: '#5b5b5b',
    },
    checkbox: {
      marginRight: '10px',
    },
    button: {
      cursor: 'pointer',
      width: '100%',
      height: '60px',
      border: '0',
      borderRadius: '30px',
      backgroundColor: '#095550',
      color: '#ffffff',
      fontSize: '18px',
      fontWeight: 600,
      marginBottom: '20px',
      transition: 'background-color 0.3s ease',
    },
    footer: {
      color: '#595959',
      fontSize: '14px',
    },
    link: {
      color: '#095550',
      textDecoration: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    error: {
      color: '#e74c3c',
      marginBottom: '15px',
      textAlign: 'center' as const,
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <button onClick={onClose} style={styles.closeButton}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <h1 style={styles.title}>Sign In</h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faUser} style={styles.icon} />
          <input
            type="text"
            name="username"
            placeholder="Username or email"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faLock} style={styles.icon} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.forgotPassword}>Forgot password?</div>
        <label style={styles.rememberMe}>
          <input
            type="checkbox"
            style={styles.checkbox}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>
        <button type="submit" style={styles.button}>
          Sign In
        </button>
      </form>
      <div style={styles.footer}>
        New here?{' '}
        <span onClick={onToggleForm} style={styles.link}>
          Sign Up
        </span>
      </div>
    </div>
  );
};


export default SignIn;