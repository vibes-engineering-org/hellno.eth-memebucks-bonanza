import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useFrame } from '@frames.js/core/react';
import { PROJECT_TITLE, MAX_FILE_SIZE, ENTRY_FEE, RECIPIENT_ADDRESS } from '../lib/constants';

export default function Frame() {
  const [step, setStep] = useState<'payment' | 'upload' | 'success'>('payment');
  const { frame } = useFrame();

  const handlePayment = useCallback(async () => {
    try {
      // Initialize USDC payment
      const tx = await frame.sendTransaction({
        to: RECIPIENT_ADDRESS,
        value: ENTRY_FEE * (10 ** 6), // USDC has 6 decimals
        token: 'USDC'
      });

      // Poll for transaction confirmation
      const receipt = await frame.waitForTransaction(tx);
      if (receipt.status === 'success') {
        setStep('upload');
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('File too large! Maximum size is 5MB');
      return;
    }

    try {
      // Handle file upload logic here
      // You'll need to implement your preferred storage solution
      setStep('success');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="p-4 bg-purple-100 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 text-purple-800">
        {PROJECT_TITLE}
      </h1>

      {step === 'payment' && (
        <div className="text-center">
          <p className="mb-4 text-purple-700">Entry fee: {ENTRY_FEE} USDC</p>
          <button
            onClick={handlePayment}
            className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transform hover:scale-105 transition"
          >
            Pay Entry Fee 🪙
          </button>
        </div>
      )}

      {step === 'upload' && (
        <div className="text-center">
          <p className="mb-4 text-purple-700">Upload your best meme!</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full p-2 border border-purple-300 rounded"
          />
          <p className="text-sm text-purple-600 mt-2">Max size: 5MB</p>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center">
          <h2 className="text-xl text-green-600 mb-2">🎉 Success! 🎉</h2>
          <p className="text-purple-700">Your meme has been submitted!</p>
          <p className="text-sm text-purple-600 mt-2">Good luck! 🍀</p>
        </div>
      )}
    </div>
  );
}
