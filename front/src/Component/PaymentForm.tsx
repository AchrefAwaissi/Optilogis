import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from "../contexts/AuthContext";

interface PaymentFormProps {
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { upgradeToPremium } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe n'est pas chargé correctement. Veuillez réessayer.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      try {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: `${firstName} ${lastName}`,
          },
        });

        if (error) {
          setError(error.message || "Une erreur est survenue lors du traitement de votre carte.");
        } else {
          // Mise à jour du statut premium de l'utilisateur
          await upgradeToPremium();
          onSuccess();
        }
      } catch (error) {
        setError("Une erreur est survenue lors de la mise à niveau vers premium. Veuillez réessayer.");
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700">Carte de crédit</label>
        <div className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm">
          <CardElement id="card-element" />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Aucun frais ne sera prélevé. Votre carte est requise pour validation uniquement.
      </p>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {processing ? 'Traitement...' : 'Déposer ma candidature'}
      </button>
    </form>
  );
};

export default PaymentForm;