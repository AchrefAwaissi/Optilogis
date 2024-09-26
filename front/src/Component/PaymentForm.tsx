import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCreditCard, faSpinner, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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
    <div className="flex justify-center items-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#095550] mb-6 text-center">Paiement Premium</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-[#095550]" />
              Prénom
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#095550] border-gray-300"
              placeholder="Votre prénom"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-[#095550]" />
              Nom
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#095550] border-gray-300"
              placeholder="Votre nom"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-[#095550]" />
              Carte de crédit
            </label>
            <div className="p-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#095550]">
              <CardElement id="card-element" />
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6 bg-blue-50 border-l-4 border-blue-500 p-4">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-blue-500" />
            Aucun frais ne sera prélevé. Votre carte est requise pour validation uniquement.
          </p>

          {error && (
            <div className="text-red-500 mb-4 flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || processing}
            className={`w-full py-2 px-4 rounded transition duration-300 ${
              processing || !stripe
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#095550] hover:bg-[#074440] text-white font-bold'
            }`}
          >
            {processing ? (
              <><FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Traitement en cours...</>
            ) : (
              'Valider le paiement'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;