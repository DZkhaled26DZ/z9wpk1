import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Volume2, VolumeX, RefreshCw, Play, Pause, RotateCcw, ExternalLink, Info } from 'lucide-react';
import TimeframeSelector from './components/TimeframeSelector';
import CryptoList from './components/CryptoList';
import StatsModal from './components/StatsModal';
import { analyzeCandlesticks, type CryptoData } from './utils/analysis';
import useSound from './hooks/useSound';
import { TIMEFRAMES } from './constants';

function App() {
  const [timeframe, setTimeframe] = useState('1h');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cryptoList, setCryptoList] = useState<CryptoData[]>([]);
  const [sortBy, setSortBy] = useState<'time' | 'wickLength' | 'price'>('time');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playAlert } = useSound();

  const fetchAndAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const symbols = data.symbols.filter((s: any) => s.quoteAsset === 'USDT' && s.status === 'TRADING');

      const results = await Promise.all(
        symbols.map(async (symbol: any) => {
          try {
            const klines = await fetch(
              `https://api.binance.com/api/v3/klines?symbol=${symbol.symbol}&interval=${timeframe}&limit=10`,
              {
                signal: controller.signal,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                }
              }
            );

            if (!klines.ok) {
              throw new Error(`Failed to fetch klines for ${symbol.symbol}`);
            }

            const candlesticks = await klines.json();
            return analyzeCandlesticks(symbol.symbol, candlesticks);
          } catch (err) {
            console.warn(`Failed to analyze ${symbol.symbol}:`, err);
            return null;
          }
        })
      );

      clearTimeout(timeout);

      const validResults = results.filter(Boolean) as CryptoData[];
      if (validResults.length > 0 && isSoundEnabled) {
        playAlert();
      }

      setCryptoList(validResults);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch data';
      setError(message);
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [timeframe, isSoundEnabled, playAlert]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      fetchAndAnalyze();
      interval = setInterval(fetchAndAnalyze, 60000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isAnalyzing, fetchAndAnalyze]);

  const handleSort = (type: 'time' | 'wickLength' | 'price') => {
    setSortBy(type);
    const sorted = [...cryptoList].sort((a, b) => {
      switch (type) {
        case 'wickLength':
          return b.wickLength - a.wickLength;
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price);
        default:
          return b.timestamp - a.timestamp;
      }
    });
    setCryptoList(sorted);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 fixed w-full top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Binance Analysis Tool</h1>
          <div className="flex items-center gap-4">
            <TimeframeSelector
              value={timeframe}
              onChange={setTimeframe}
              options={TIMEFRAMES}
            />
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-2 rounded hover:bg-gray-700"
              title={isSoundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={() => setIsAnalyzing(!isAnalyzing)}
              className={`p-2 rounded ${
                isAnalyzing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={isLoading}
              title={isAnalyzing ? 'Stop analysis' : 'Start analysis'}
            >
              {isAnalyzing ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={fetchAndAnalyze}
              className="p-2 rounded hover:bg-gray-700"
              disabled={isLoading}
              title="Refresh data"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => {
                setTimeframe('1h');
                setSortBy('time');
                setIsSoundEnabled(true);
              }}
              className="p-2 rounded hover:bg-gray-700"
              title="Reset settings"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-24 pb-8 px-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-4">
          {error && (
            <div className="bg-red-500 text-white p-4 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="flex justify-end gap-4 mb-4">
            <button
              onClick={() => handleSort('time')}
              className={`px-4 py-2 rounded ${
                sortBy === 'time' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              Time
            </button>
            <button
              onClick={() => handleSort('wickLength')}
              className={`px-4 py-2 rounded ${
                sortBy === 'wickLength' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              Wick Length
            </button>
            <button
              onClick={() => handleSort('price')}
              className={`px-4 py-2 rounded ${
                sortBy === 'price' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              Price
            </button>
          </div>

          <CryptoList
            cryptos={cryptoList}
            onSelectCrypto={setSelectedCrypto}
            isLoading={isLoading}
          />
        </div>
      </main>

      {selectedCrypto && (
        <StatsModal
          crypto={selectedCrypto}
          onClose={() => setSelectedCrypto(null)}
        />
      )}

      <footer className="bg-gray-800 text-center p-4 fixed bottom-0 w-full">
        <p>© 2024 Khaled Deraga - Contact: gsmkhaledtiaret@gmail.com</p>
      </footer>
    </div>
  );
}

export default App;