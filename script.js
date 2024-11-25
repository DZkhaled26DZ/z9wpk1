const API_KEY = 'nc3cvP0d3LZzL9AIIgQQsjU6MKN8g5oanFkiAo4BdykbaOlce3HsTbWB3mPCoL8z';
let isAnalyzing = false;
let isSoundEnabled = true;
let analysisInterval;
let cryptoList = [];

// DOM Elements
const timeframeSelect = document.getElementById('timeframe');
const soundToggle = document.getElementById('soundToggle');
const startStopButton = document.getElementById('startStop');
const refreshButton = document.getElementById('refresh');
const resetButton = document.getElementById('reset');
const cryptoListElement = document.getElementById('cryptoList');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close');

// Initialize Algeria Clock
function updateClock() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('ar-DZ', {
        timeZone: 'Africa/Algiers',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.querySelector('.clock').textContent = formatter.format(now);
}

setInterval(updateClock, 1000);
updateClock();

// Audio Alert
const alertSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnMpBSl+zPLaizsIGGS57OihUBELTKXh8bllHgU2jdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z1YU2Bhxqvu7mnEoODlOq5O+zYBoGPJPY88p2KwUme8rx3I4+CRZiturqpVITC0mi4PK8aB8GM4nU8tGAMQYfcsLu45ZFDBFYr+ftrVoXCECY3PLEcSYELIHO8diJOQgZaLvt559NEAxPqOPwtmMcBjiP1/PMeS0GI3fH8N2RQAoUXrTp66hVFApGnt/yvmwhBTCG0fPTgjQGHm7A7eSaRw0PVqzl77BeGQc9ltvyxnUoBSh+zPDaizsIGGS56+mjTxELTKXh8bllHgU1jdT0z3wvBSJ0xe/glEILElyx6OyrWRUIRJve8sFuJAUug8/z1YU2BRxqvu3mnEoPDlOq5O+zYRsGPJPY88p3KgUme8rx3I4+CRVht+rqpVMSC0mh4fK8aiAFM4nU8tGAMQYfccPu45ZFDBFYr+ftrVwWCECY3PLEcSYGK4DN8tiIOQgZZ7zs56BODwxPpuPxtmQcBjiP1/PMeS0GI3fH8N+RQAoUXrTp66hWEwlGnt/yv2wiBDCG0fPTgzQGHW/A7eSaSQ0PVqzl77BeGQc9ltrzxnUoBSh9y/HajDsIF2W56+mjUREKTKPi8blnHgU1jdTy0HwvBSF0xPDglEQKElux6eyrWRUJQ5vd88FwJAQug8/z1YY2BRxqvu3mnEwODVKp5e+zYRsGOpPX88p3KgUmecnw3Y4/CBVhtuvqpVMSC0mh4PG9aiAFM4nS89GAMQYfccLv45dGCxFYrufur1sYB0CY3PLEcycFKoDN8tiIOQgZZ7rs56BODwxPpuPxtmQdBTiP1/PMey4FI3bH8d+RQQkUXbPq66hWEwlGnt/yv2wiBDCG0PPTgzUFHm2/7uSaSQ0PVKzm77BeGQc9ltrzyHQpBSh9y/HajDwIF2S46+mjUREKTKPi8blnHwU1jdTy0H4wBiF0xPDglEQKElux6eyrWxQIQ5vd88NvJQQug8/z1YY3BRxqvu3mnEwODVKp5e+zYxoFOpHY88p3LAUlecnw3Y8+CBZhtuvqpVMSC0mh4PG9aiAFM4nS89GBMgUfccLv45dGDRBYrufur1sYB0CX2/PEcycFKoDN8tiKOQgZZ7vs56BOEQxPpuPxt2MdBTeP1/PMey4FI3bH8d+RQQsUXbPq66hWEwlGnt/yv2wiBDCF0fPThDQGHm2/7uSaSQ0PVKzm77BeGQc9ltrzyHUpBCh9y/HajDwIF2S46+mjUhEKTKPi8blnHwU1jdTy0H4wBiF0xPDglEQKElux6eyrWxQIQ5vd88NvJQQug8/z1YY3BRxqvu3mnU0ODVKp5e+zYxoFOpHY88p3LAUlecnw3Y8+CBZhtuvqpVMSC0mh4PG9aiAFM4nS89GBMgUfccLv45dGDRBYrufur1sYB0CX2/PEcycFKoDN8tiKOQgZZ7vs56BOEQxPpuPxt2MdBTeP1/PMey4FI3bH8d+RQQsUXbPq66hWEwlGnt/yv2wiBDCF0fPThDQGHm2/7uSaSQ0PVKzm77BeGQc9ltrzyHUpBCh9y/HajDwIF2S46+mjUhEKTKPi8blnHwU1jdTy0H4wBiF0xPDglEQKElux6eyrWxQIQ5vd88NvJQQug8/z1YY3BRxqvu3mnU0ODVKp5e+zYxoFOpHY88p3LAUlecnw3Y8+CBZhtuvqpVMSC0mh4PG9aiAFMwAAAAAAAA==');

// Event Listeners
startStopButton.addEventListener('click', toggleAnalysis);
soundToggle.addEventListener('click', toggleSound);
refreshButton.addEventListener('click', fetchData);
resetButton.addEventListener('click', resetSettings);
closeModal.addEventListener('click', () => modal.style.display = 'none');

document.querySelectorAll('[data-sort]').forEach(button => {
    button.addEventListener('click', (e) => {
        const sortType = e.target.dataset.sort;
        sortCryptos(sortType);
    });
});

// Main Functions
async function fetchData() {
    try {
        const pairs = await fetchSpotPairs();
        const results = await Promise.all(
            pairs.map(pair => analyzePair(pair.symbol))
        );
        cryptoList = results.filter(Boolean);
        updateUI();
        if (cryptoList.length > 0 && isSoundEnabled) {
            alertSound.play().catch(console.error);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchSpotPairs() {
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
    const data = await response.json();
    return data.symbols.filter(s => 
        s.status === 'TRADING' && 
        s.isSpotTradingAllowed && 
        s.quoteAsset === 'USDT'
    );
}

async function analyzePair(symbol) {
    try {
        const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframeSelect.value}&limit=10`
        );
        const candlesticks = await response.json();
        return analyzePattern(symbol, candlesticks);
    } catch (error) {
        console.error(`Error analyzing ${symbol}:`, error);
        return null;
    }
}

function analyzePattern(symbol, candlesticks) {
    if (candlesticks.length < 5) return null;

    let consecutiveRed = 0;
    const lastIndex = candlesticks.length - 1;
    const lastCandle = candlesticks[lastIndex];
    
    const isLastGreen = parseFloat(lastCandle[4]) > parseFloat(lastCandle[1]);
    if (!isLastGreen) return null;

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

    const open = parseFloat(lastCandle[1]);
    const close = parseFloat(lastCandle[4]);
    const low = parseFloat(lastCandle[3]);
    const wickLength = ((Math.min(open, close) - low) / low) * 100;

    if (wickLength < 0.5) return null;

    return {
        symbol,
        price: lastCandle[4],
        wickLength,
        timestamp: lastCandle[0],
        volume: parseFloat(lastCandle[5])
    };
}

function updateUI() {
    cryptoListElement.innerHTML = cryptoList.map(crypto => `
        <div class="crypto-card">
            <div class="crypto-header">
                <h3>${crypto.symbol}</h3>
                <div class="crypto-actions">
                    <button onclick="showStats('${crypto.symbol}')" title="إحصائيات">📊</button>
                    <a href="https://www.binance.com/en/trade/${crypto.symbol}?type=spot" 
                       target="_blank" 
                       title="فتح في Binance">
                       🔗
                    </a>
                </div>
            </div>
            <div class="crypto-info">
                <p>السعر: $${parseFloat(crypto.price).toFixed(8)}</p>
                <p>طول الذيل: ${crypto.wickLength.toFixed(2)}%</p>
                <p>الوقت: ${new Date(crypto.timestamp).toLocaleTimeString('en-US')}</p>
            </div>
        </div>
    `).join('');
}

function showStats(symbol) {
    const crypto = cryptoList.find(c => c.symbol === symbol);
    if (!crypto) return;

    const currentPrice = parseFloat(crypto.price);
    const targets = [
        { price: (currentPrice * 1.02).toFixed(8), probability: '80%' },
        { price: (currentPrice * 1.05).toFixed(8), probability: '60%' },
        { price: (currentPrice * 1.08).toFixed(8), probability: '40%' }
    ];
    const stopLoss = (currentPrice * 0.98).toFixed(8);

    modalContent.innerHTML = `
        <h2>${symbol} إحصائيات</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <h3>الإحصائيات الحالية</h3>
                <p>السعر الحالي: $${crypto.price}</p>
                <p>حجم التداول: $${crypto.volume.toLocaleString()}</p>
                <p>طول الذيل: ${crypto.wickLength.toFixed(2)}%</p>
            </div>
            <div class="stat-card">
                <h3>الأهداف المتوقعة</h3>
                ${targets.map((target, i) => `
                    <div class="target-price">
                        <span>الهدف ${i + 1}</span>
                        <span>$${target.price}</span>
                        <span>${target.probability}</span>
                    </div>
                `).join('')}
                <div class="target-price" style="color: var(--danger)">
                    <span>وقف الخسارة</span>
                    <span>$${stopLoss}</span>
                </div>
            </div>
        </div>
        <a href="https://www.binance.com/en/trade/${symbol}?type=spot" 
           target="_blank"
           class="binance-link"
           style="display: block; text-align: center; margin-top: 1rem; padding: 0.5rem; background: var(--accent); border-radius: 4px; text-decoration: none; color: white;">
           فتح في Binance
        </a>
    `;
    modal.style.display = 'block';
}

function sortCryptos(type) {
    switch (type) {
        case 'time':
            cryptoList.sort((a, b) => b.timestamp - a.timestamp);
            break;
        case 'wickLength':
            cryptoList.sort((a, b) => b.wickLength - a.wickLength);
            break;
        case 'price':
            cryptoList.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
    }
    updateUI();
}

function toggleAnalysis() {
    isAnalyzing = !isAnalyzing;
    startStopButton.textContent = isAnalyzing ? '⏹️' : '▶️';
    if (isAnalyzing) {
        fetchData();
        analysisInterval = setInterval(fetchData, 60000);
    } else {
        clearInterval(analysisInterval);
    }
}

function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    soundToggle.textContent = isSoundEnabled ? '🔊' : '🔇';
}

function resetSettings() {
    timeframeSelect.value = '1h';
    isSoundEnabled = true;
    soundToggle.textContent = '🔊';
    if (isAnalyzing) {
        toggleAnalysis();
    }
    cryptoList = [];
    updateUI();
}