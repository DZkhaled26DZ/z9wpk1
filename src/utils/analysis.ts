export interface CryptoData {
  symbol: string;
  price: string;
  wickLength: number;
  timestamp: number;
  volume?: number;
}

export function analyzeCandlesticks(symbol: string, candlesticks: any[]): CryptoData | null {
  if (candlesticks.length < 5) return null;

  // Check for 4 or more consecutive red candles followed by a green candle
  let consecutiveRed = 0;
  const lastIndex = candlesticks.length - 1;
  
  // Check the last candle (should be green)
  const lastCandle = candlesticks[lastIndex];
  const isLastGreen = parseFloat(lastCandle[4]) > parseFloat(lastCandle[1]);
  
  if (!isLastGreen) return null;

  // Check previous candles for consecutive red
  for (let i = lastIndex - 1; i >= lastIndex - 4; i--) {
    if (i < 0) break;
    const candle = candlesticks[i];
    if (parseFloat(candle[4]) < parseFloat(candle[1])) {
      consecutiveRed++;
    } else {
      break;
    }
  }

  if (consecutiveRed < 4) return null;

  // Calculate lower wick length of the green candle
  const open = parseFloat(lastCandle[1]);
  const close = parseFloat(lastCandle[4]);
  const low = parseFloat(lastCandle[3]);
  const wickLength = ((Math.min(open, close) - low) / low) * 100;

  // Only return if there's a significant lower wick
  if (wickLength < 0.5) return null;

  return {
    symbol,
    price: lastCandle[4],
    wickLength,
    timestamp: lastCandle[0],
    volume: parseFloat(lastCandle[5])
  };
}