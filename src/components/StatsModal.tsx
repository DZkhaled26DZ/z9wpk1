import React from 'react';
import { X } from 'lucide-react';
import { CryptoData } from '../utils/analysis';

interface StatsModalProps {
  crypto: CryptoData;
  onClose: () => void;
}

function StatsModal({ crypto, onClose }: StatsModalProps) {
  const targets = [
    { price: (parseFloat(crypto.price) * 1.02).toFixed(8), probability: '80%' },
    { price: (parseFloat(crypto.price) * 1.05).toFixed(8), probability: '60%' },
    { price: (parseFloat(crypto.price) * 1.08).toFixed(8), probability: '40%' },
  ];

  const stopLoss = (parseFloat(crypto.price) * 0.98).toFixed(8);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{crypto.symbol} Statistics</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Current Statistics</h3>
            <p>Current Price: ${crypto.price}</p>
            <p>24h Volume: ${crypto.volume?.toLocaleString()}</p>
            <p>Wick Length: {crypto.wickLength.toFixed(2)}%</p>
          </div>

          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Target Prices</h3>
            {targets.map((target, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span>Target {index + 1}</span>
                <span>${target.price}</span>
                <span className="text-green-400">{target.probability}</span>
              </div>
            ))}
            <div className="mt-4 pt-2 border-t border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-red-400">Stop Loss</span>
                <span>${stopLoss}</span>
              </div>
            </div>
          </div>

          <a
            href={`https://www.binance.com/en/trade/${crypto.symbol}?type=spot`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 text-center py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Trade on Binance
          </a>
        </div>
      </div>
    </div>
  );
}

export default StatsModal;