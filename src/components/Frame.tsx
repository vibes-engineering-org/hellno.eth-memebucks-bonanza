'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { DaimoPayButton } from '@daimo/pay';
import { baseUSDC } from '@daimo/contract';
import { getAddress } from 'viem';
import { PROJECT_TITLE, MAX_FILE_SIZE, ENTRY_FEE, RECIPIENT_ADDRESS } from '../lib/constants';

export default function Frame() {
  const [step, setStep] = useState<'payment' | 'upload' | 'success'>('payment');
  const [isPending, setIsPending] = useState(false);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        alert('File too large! Maximum size is 5MB');
        return;
      }

      try {
        // Basic file validation
        if (!file.type.startsWith('image/')) {
          alert('Please upload an image file');
          return;
        }

        // TODO: Implement your storage solution here
        // For now, just simulate success
        setStep('success');
      } catch (error) {
        console.error('Upload failed:', error);
      }
    },
    [] // Empty dependencies array since we don't use any external values
  );

  return (
    <div className="p-4 bg-purple-100 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 text-purple-800">
        {PROJECT_TITLE}
      </h1>

      {step === 'payment' && (
        <div className="text-center">
          <p className="mb-4 text-purple-700">Entry fee: {ENTRY_FEE} USDC</p>
          {isPending ? (
            <p className="text-purple-700">Transaction pending... please wait</p>
          ) : (
            <DaimoPayButton
              appId="pay-demo"
              toAddress={RECIPIENT_ADDRESS}
              toChain={baseUSDC.chainId}
              toUnits={`${ENTRY_FEE}.00`}
              toToken={getAddress(baseUSDC.token)}
              intent="Enter Meme Contest"
              onPaymentStarted={() => setIsPending(true)}
              onPaymentCompleted={() => {
                setIsPending(false);
                setStep('upload');
              }}
              customTheme={{
                '--ck-accent-color': '#A855F7',
                '--ck-accent-text-color': '#ffffff',
              }}
            />
          )}
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
