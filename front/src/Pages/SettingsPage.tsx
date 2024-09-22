// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import ManageItems from '../Component/ManageItems';

// interface FormData {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   profilePhoto: File | null;
// }

// const SettingsPage: React.FC = () => {
//   const { user, updateUser } = useAuth();
//   const [formData, setFormData] = useState<FormData>({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     profilePhoto: null,
//   });
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
//   const [activeTab, setActiveTab] = useState<'profile' | 'items'>('profile');

//   useEffect(() => {
//     if (user) {
//       setFormData(prevState => ({
//         ...prevState,
//         username: user.username || '',
//         email: user.email || '',
//       }));
//       if (user.profilePhotoPath) {
//         setPreviewUrl(user.profilePhotoPath);
//       }
//     }
//   }, [user]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, files } = e.target;
//     if (name === 'profilePhoto' && files && files[0]) {
//       setFormData(prev => ({ ...prev, profilePhotoPath: files[0] }));
//       setPreviewUrl(URL.createObjectURL(files[0]));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleProfileSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage(null);

//     if (formData.password !== formData.confirmPassword) {
//       setMessage({ type: 'error', text: 'Passwords do not match' });
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('username', formData.username);
//       formDataToSend.append('email', formData.email);
//       if (formData.password) {
//         formDataToSend.append('password', formData.password);
//       }
//       if (formData.profilePhoto) {
//         formDataToSend.append('profilePhotoPath', formData.profilePhoto);
//         console.log('Profile photo added to FormData:', formData.profilePhoto);
//       } else {
//         console.log('No profile photo to upload');
//       }


//       await updateUser(formDataToSend);
//       setMessage({ type: 'success', text: 'Profile updated successfully' });
//       setFormData(prevState => ({
//         ...prevState,
//         password: '',
//         confirmPassword: '',
//         profilePhoto: null,
//       }));
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to update profile' });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
//       <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
//         <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-full max-w-md mx-auto">
//           <div className="mb-6 flex justify-center">
//             <button
//               onClick={() => setActiveTab('profile')}
//               className={`mr-4 px-3 py-2 rounded-md ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
//             >
//               Mon Compte
//             </button>
//             <button
//               onClick={() => setActiveTab('items')}
//               className={`px-3 py-2 rounded-md ${activeTab === 'items' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
//             >
//               Mes Annonces
//             </button>
//           </div>

//           {message && (
//             <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//               {message.text}
//             </div>
//           )}

//           <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
//             {activeTab === 'profile' && (
//               <form onSubmit={handleProfileSubmit} className="space-y-4">
//                 <div className="flex justify-center mb-4">
//                   <div className="relative w-32 h-32 rounded-full overflow-hidden">
//                     <img src={previewUrl || '/default-avatar.png'} alt="Profile" className="w-full h-full object-cover" />
//                     <label htmlFor="profilePhoto" className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1 cursor-pointer">
//                       Change
//                     </label>
//                     <input
//                       id="profilePhoto"
//                       name="profilePhoto"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleChange}
//                       className="hidden"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     value={formData.username}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type="password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                   />
//                 </div>
//                 <button 
//                   type="submit" 
//                   className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   Update Profile
//                 </button>
//               </form>
//             )}

//             {activeTab === 'items' && <ManageItems />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;











import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ManageItems from '../Component/ManageItems';

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
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
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
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center mb-8">
          <div className="relative">
            <img
              src={previewUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <label htmlFor="profilePhoto" className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#095550]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </label>
            <input
              id="profilePhoto"
              name="profilePhoto"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>
          <div className="ml-6 flex-grow">
            <h2 className="text-2xl font-bold text-[#030303] font-poppins">{formData.username}</h2>
            <p className="text-lg text-[#828282] font-poppins">{formData.email}</p>
          </div>
          <button className="bg-[#095550] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#074440] transition duration-300">
            Update
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <InputField label="Username" name="username" />
            <InputField label="Email" name="email" type="email" />
            <InputField label="New Password" name="password" type="password" />
            <InputField label="Confirm New Password" name="confirmPassword" type="password" />
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

          <button type="button" className="mt-6 bg-[#e6efee] text-[#095550] font-semibold py-2 px-4 rounded-lg hover:bg-[#d1e0df] transition duration-300">
            + Add Email Address
          </button>

          <button type="submit" className="mt-8 w-full bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;