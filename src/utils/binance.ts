import { API_KEY } from '../config';

export async function fetchSpotPairs() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
      headers: {
        'X-MBX-APIKEY': API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch spot pairs');
    }

    const data = await response.json();
    return data.symbols.filter((symbol: any) => 
      symbol.status === 'TRADING' && 
      symbol.isSpotTradingAllowed &&
      symbol.quoteAsset === 'USDT'
    );
  } catch (error) {
    console.error('Error fetching spot pairs:', error);
    throw error;
  }
}

export async function fetchKlines(symbol: string, interval: string, limit: number = 10) {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
      {
        headers: {
          'X-MBX-APIKEY': API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch klines for ${symbol}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching klines for ${symbol}:`, error);
    throw error;
  }
}