import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface SignUpProps {
  onClose: () => void;
  onToggleForm: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onClose, onToggleForm }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?
        <button
          onClick={onToggleForm}
          className="ml-1 text-blue-500 hover:text-blue-700"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default SignUp;