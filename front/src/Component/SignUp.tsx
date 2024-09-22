import React, { useState, useRef } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUser, faEnvelope, faLock, faImage } from "@fortawesome/free-solid-svg-icons";

interface User {
  username: string;
}

interface SignUpProps {
  onClose: () => void;
  onToggleForm: () => void;
  onSuccess: (user: User) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onClose, onToggleForm, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'profilePhoto') {
      const files = e.target.files;
      if (files && files.length > 0) {
        setProfilePhoto(files[0]);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      if (profilePhoto) {
        formDataToSend.append('profilePhoto', profilePhoto);
      }

      const response = await axios.post('http://localhost:5000/auth/signup', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Signup successful', response.data);
      setSuccessMessage("Inscription réussie ! Redirection vers la page de connexion...");

      // Attendre 2 secondes avant de rediriger vers la page de connexion
      setTimeout(() => {
        onToggleForm();
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "An error occurred during signup");
      } else {
        setError("An unexpected error occurred");
      }
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
      borderRadius: '7px',
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
    button: {
      cursor: 'pointer',
      width: '100%',
      height: '60px',
      border: '0',
      borderRadius: '7px',
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
    successMessage: {
      color: '#28a745',
      marginBottom: '15px',
      textAlign: 'center' as const,
      fontSize: '14px',
    },
    imagePreview: {
      width: '150px',
      height: '150px',
      borderRadius: '7px',
      objectFit: 'cover' as const,
      marginBottom: '20px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e0e0e0',
      border: '2px dashed #a0a0a0',
    },
    imagePreviewText: {
      marginTop: '10px',
      fontSize: '14px',
      color: '#5c5c5c',
      textAlign: 'center' as const,
    },
    hiddenFileInput: {
      display: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <button onClick={onClose} style={styles.closeButton}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <h1 style={styles.title}>Sign Up</h1>
      {error && <p style={styles.error}>{error}</p>}
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div onClick={handleImageClick} style={styles.imagePreview}>
          {profilePhotoPreview ? (
            <img src={profilePhotoPreview} alt="Profile Preview" style={{ width: '100%', height: '100%', borderRadius: '7px', objectFit: 'cover' }} />
          ) : (
            <>
              <FontAwesomeIcon icon={faImage} style={{ fontSize: '40px', color: '#a0a0a0' }} />
              <div style={styles.imagePreviewText}>Ajouter une image</div>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="profilePhoto"
          onChange={handleChange}
          style={styles.hiddenFileInput}
          accept="image/*"
        />
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faUser} style={styles.icon} />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faLock} style={styles.icon} />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Sign Up
        </button>
      </form>
      <div style={styles.footer}>
        Already have an account?{' '}
        <span onClick={onToggleForm} style={styles.link}>
          Sign In
        </span>
      </div>
    </div>
  );
};

export default SignUp;