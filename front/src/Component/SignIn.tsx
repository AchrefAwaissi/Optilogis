import React, { useState } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface User {
  username: string;
}

interface SignInProps {
  onClose: () => void;
  onToggleForm: () => void;
  onSuccess: (user: User) => void;
}

const SignIn: React.FC<SignInProps> = ({ onClose, onToggleForm, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/auth/signin', formData);
      console.log('Sign in successful', response.data);
      onSuccess({ username: formData.username });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "An error occurred during sign in");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?
        <button
          onClick={onToggleForm}
          className="ml-1 text-blue-500 hover:text-blue-700"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default SignIn;