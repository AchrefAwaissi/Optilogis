import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faComment } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FieldConfig {
  name: keyof FormData;
  label: string;
  icon: IconDefinition;
  type: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: 'idle', message: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Envoi en cours...' });

    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      setStatus({ type: 'success', message: 'Message envoyé avec succès !' });
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Erreur lors de l\'envoi du message. Veuillez réessayer.' 
      });

      setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
    }
  };

  const fields: FieldConfig[] = [
    { name: 'name', label: 'Nom', icon: faUser, type: 'text' },
    { name: 'email', label: 'Email', icon: faEnvelope, type: 'email' },
  ];

  return (
    <div className="w-full bg-white overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#030303] font-poppins mb-8">Contactez-nous</h1>

        {status.type !== 'idle' && (
          <div className={`mb-4 p-3 rounded ${
            status.type === 'success' ? 'bg-green-100 text-green-700' : 
            status.type === 'error' ? 'bg-red-100 text-red-700' : 
            'bg-blue-100 text-blue-700'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            {fields.map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-[#030303] text-xl font-poppins mb-2">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={field.icon}
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]"
                  />
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                    placeholder={`Votre ${field.label.toLowerCase()}`}
                    required
                  />
                </div>
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faComment} className="absolute top-4 left-3 transform text-[#095550]" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  rows={4}
                  placeholder="Votre message"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="mt-6 w-full bg-[#095550] text-white text-lg font-poppins py-3 px-4 rounded-lg hover:bg-[#074440] focus:outline-none focus:ring-2 focus:ring-[#095550] focus:ring-opacity-50 transition duration-300 ease-in-out disabled:bg-[#0955507a]"
            disabled={status.type === 'loading'}
          >
            {status.type === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;