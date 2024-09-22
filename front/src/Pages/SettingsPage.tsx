import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePhoto: File | null;
}

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        username: user.username || '',
        email: user.email || '',
      }));
      if (user.profilePhotoPath) {
        setPreviewUrl(user.profilePhotoPath);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto' && files && files[0]) {
      setFormData(prev => ({ ...prev, profilePhoto: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      if (formData.profilePhoto) {
        formDataToSend.append('profilePhoto', formData.profilePhoto);
      }

      await updateUser(formDataToSend);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setFormData(prevState => ({
        ...prevState,
        password: '',
        confirmPassword: '',
        profilePhoto: null,
      }));
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data when canceling edit
      setFormData(prevState => ({
        ...prevState,
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
      }));
    }
  };

  const InputField: React.FC<{ label: string; name: keyof FormData; type?: string }> = ({ label, name, type = 'text' }) => (
    <div className="mb-4">
      <label className="block text-[#030303] text-xl font-poppins mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] as string}
        onChange={handleChange}
        className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
        placeholder={`Your ${label}`}
        disabled={!isEditing}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <img
                src={previewUrl || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              {isEditing && (
                <label htmlFor="profilePhoto" className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#095550]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </label>
              )}
              <input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                disabled={!isEditing}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#030303] font-poppins">{formData.username}</h2>
              <p className="text-lg text-[#828282] font-poppins">{formData.email}</p>
            </div>
          </div>
          <button
            onClick={toggleEdit}
            className={`font-bold py-2 px-4 rounded-lg transition duration-300 ${
              isEditing
                ? 'bg-[#e6efee] text-[#095550] hover:bg-[#d1e0df]'
                : 'bg-[#095550] text-white hover:bg-[#074440]'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Username" name="username" />
              <InputField label="Email" name="email" type="email" />
              {isEditing && (
                <>
                  <InputField label="New Password" name="password" type="password" />
                  <InputField label="Confirm New Password" name="confirmPassword" type="password" />
                </>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-[#030303] font-poppins mb-4">My Email Address</h3>
              <div className="bg-[#f9f9f9] rounded-lg p-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#095550] mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-lg text-[#030303] font-poppins">{formData.email}</p>
                  <p className="text-sm text-[#828282] font-poppins">1 month ago</p>
                </div>
              </div>
            </div>

            {isEditing && (
              <button type="button" className="mt-6 bg-[#e6efee] text-[#095550] font-semibold py-2 px-4 rounded-lg hover:bg-[#d1e0df] transition duration-300">
                + Add Email Address
              </button>
            )}

            {isEditing && (
              <div className="mt-8 flex justify-start">
                <button type="submit" className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;