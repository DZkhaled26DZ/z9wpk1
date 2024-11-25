import React from 'react';
import { Info, ExternalLink } from 'lucide-react';
import { CryptoData } from '../utils/analysis';

interface CryptoListProps {
  cryptos: CryptoData[];
  onSelectCrypto: (crypto: CryptoData) => void;
  isLoading: boolean;
}

function CryptoList({ cryptos, onSelectCrypto, isLoading }: CryptoListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
        <p>Analyzing market data...</p>
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No cryptocurrencies match the criteria at the moment.
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {cryptos.map((crypto) => (
        <div
          key={crypto.symbol}
          className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold">{crypto.symbol}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onSelectCrypto(crypto)}
                className="p-1 hover:bg-gray-500 rounded"
                title="View details"
              >
                <Info size={20} />
              </button>
              <a
                href={`https://www.binance.com/en/trade/${crypto.symbol}?type=spot`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-gray-500 rounded"
                title="Open in Binance"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
          <div className="text-sm text-gray-300">
            <p>Price: ${parseFloat(crypto.price).toFixed(8)}</p>
            <p>Wick Length: {crypto.wickLength.toFixed(2)}%</p>
            <p>Time: {new Date(crypto.timestamp).toLocaleTimeString('en-US')}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CryptoList;