import './style.css'
import Chart from 'chart.js/auto';

// Default values (Fallbacks)
const DEFAULTS = {
  ron95_subsidized: 2.05, // Ceiling price fallback
  ron95_market: 2.65,     // Estimated market price fallback
  date: 'Estimated'
};

let state = {
  subsidizedPrice: DEFAULTS.ron95_subsidized,
  marketPrice: DEFAULTS.ron95_market,
  mode: 'money', // 'money' | 'liters'
  inputValue: 0
};

// DOM Elements
const elements = {
  modeToggle: document.getElementById('mode-toggle'),
  amountInput: document.getElementById('amount-input'),
  inputLabel: document.getElementById('input-label'),
  inputPrefix: document.getElementById('input-prefix'),
  primaryResultLabel: document.getElementById('primary-result-label'),
  primaryResultValue: document.getElementById('primary-result-value'),
  subsidyValue: document.getElementById('subsidy-value'),
  subsidizedPriceDisplay: document.getElementById('subsidized-price-display'),
  marketPriceDisplay: document.getElementById('market-price-display'),
  priceDate: document.getElementById('price-date'),

  // New Elements
  totalValueRow: document.getElementById('total-value-row'),
  totalRealValue: document.getElementById('total-real-value'),
  visitorCount: document.getElementById('visitor-count'),
  ctx: document.getElementById('priceChart').getContext('2d')
};

// --- API & Data Fetching ---

async function fetchPricesAndGraph() {
  try {
    // Fetch improved limit for graph history (12 items usually covers ~3 months of weekly updates)
    const response = await fetch('https://api.data.gov.my/data-catalogue?id=fuelprice&limit=12');
    const data = await response.json();

    if (data && data.length > 0) {
      const latest = data[0];
      // Use budi95 price if available, else skps, else default
      state.subsidizedPrice = latest.ron95_budi95 || latest.ron95_skps || DEFAULTS.ron95_subsidized;
      state.marketPrice = latest.ron95 || DEFAULTS.ron95_market;

      // Calculate date 3 months after today (2026-02-25)
      const today = new Date('2026-02-25');
      const futureDate = new Date(today);
      futureDate.setMonth(today.getMonth() + 3);
      const displayDate = futureDate.toISOString().split('T')[0];

      updatePriceDisplay(displayDate);
      calculate(); // Recalculate with new prices

      // Render Graph
      renderChart(data.reverse()); // Reverse to show oldest -> newest
    }
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    // Fallback to 3 months after today even if fetch fails, but use default prices
    const today = new Date('2026-02-25');
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + 3);
    updatePriceDisplay(futureDate.toISOString().split('T')[0]);
  }
}

async function fetchVisitorCount() {
  try {
    // Using counterapi.dev generic demo key for prototype
    const response = await fetch('https://api.counterapi.dev/v1/budi95-calc.demo/visit-count/up');
    const data = await response.json();
    if (data && data.count) {
      elements.visitorCount.textContent = data.count;
    }
  } catch (error) {
    console.warn('Visitor counter failed (likely adblock):', error);
    elements.visitorCount.textContent = 'Err';
  }
}

// --- UI Updates ---

function updatePriceDisplay(date) {
  elements.subsidizedPriceDisplay.textContent = `RM ${state.subsidizedPrice.toFixed(2)}/L`;
  elements.marketPriceDisplay.textContent = `RM ${state.marketPrice.toFixed(2)}/L`;
  elements.priceDate.textContent = date;
}

function updateInputMode() {
  state.inputValue = 0;
  elements.amountInput.value = '';

  if (state.mode === 'money') {
    elements.inputLabel.textContent = 'Amount (RM)';
    elements.inputPrefix.textContent = 'RM';
    elements.amountInput.placeholder = '0.00';
    elements.primaryResultLabel.textContent = 'Est. Fuel';
    elements.totalValueRow.style.display = 'flex'; // Show Total Real Value row
  } else {
    elements.inputLabel.textContent = 'Fuel Volume (Liters)';
    elements.inputPrefix.textContent = 'L';
    elements.amountInput.placeholder = '0';
    elements.primaryResultLabel.textContent = 'Total Cost';
    elements.totalValueRow.style.display = 'none'; // Hide Total Real Value row
  }

  calculate();
}

function calculate() {
  const input = parseFloat(elements.amountInput.value) || 0;
  state.inputValue = input;

  let primaryRes = 0;
  let subsidySavings = 0;
  let totalRealVal = 0;
  const priceDiff = state.marketPrice - state.subsidizedPrice;

  if (state.mode === 'money') {
    // --- RM MODE ---
    // Top: Est Fuel (Liters)
    // Middle: Subsidy Savings
    // Bottom: Final Prices (Total Value)

    // Formula:
    // Liters = Input / 2.05
    // Savings = Liters * (2.65 - 2.05)
    // Final Price (Value) = Liters * 2.65

    const liters = input / state.subsidizedPrice;
    primaryRes = liters;
    subsidySavings = liters * priceDiff;
    totalRealVal = liters * state.marketPrice;

    // Update UI Labels (Standard Layout)
    elements.primaryResultLabel.textContent = 'Est. Fuel';
    document.querySelector('#secondary-result-label').textContent = 'Subsidy Savings';
    document.querySelector('#total-value-row .result-label').innerHTML = 'Final Prices <small>(Total Value)</small>';

    // Update Values
    elements.primaryResultValue.innerHTML = `${primaryRes.toFixed(3)} <small>L</small>`;
    elements.subsidyValue.textContent = `RM ${subsidySavings.toFixed(2)}`;

    elements.totalValueRow.style.display = 'flex';
    elements.totalRealValue.textContent = `RM ${totalRealVal.toFixed(2)}`;

  } else {
    // --- LITERS MODE ---
    // User Request:
    // 1st (Top): Subsidy Savings
    // 2nd (Middle): Total Cost / Unsubsidy Price (Input * Market)
    // 3rd (Bottom): Total Payable (Input * Subsidized)

    const costPayable = input * state.subsidizedPrice;
    subsidySavings = input * priceDiff;
    const totalCostUnsubsidized = input * state.marketPrice; // Liters * Market Price

    // Update UI Labels (Swapped Layout)
    elements.primaryResultLabel.textContent = 'Subsidy Savings';
    document.querySelector('#secondary-result-label').textContent = 'Unsubsidized Cost';
    document.querySelector('#total-value-row .result-label').innerHTML = 'Total Payable';

    // Update Values
    // 1st (Top) -> Subsidy
    elements.primaryResultValue.innerHTML = `RM ${subsidySavings.toFixed(2)}`;

    // 2nd (Middle) -> Unsubsidized Cost
    elements.subsidyValue.textContent = `RM ${totalCostUnsubsidized.toFixed(2)}`;

    // 3rd (Bottom) -> Total Payable
    elements.totalValueRow.style.display = 'flex';
    elements.totalRealValue.textContent = `RM ${costPayable.toFixed(2)}`;
  }
}

// --- Chart.js ---

function renderChart(data) {
  // Process Data
  // Process Data
  const labels = data.map(item => item.date);
  const ron95Market = data.map(item => item.ron95);
  const ron97 = data.map(item => item.ron97);
  const diesel = data.map(item => item.diesel);
  const dieselEast = data.map(item => item.diesel_eastmsia);
  const ron95Sub = data.map(item => item.ron95_budi95 || 1.99); // BUDI95 Subsidized
  const ron95Skps = data.map(item => item.ron95_skps || 2.05); // SKDS Subsidized

  // Create Gradient
  const gradient = elements.ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(58, 123, 213, 0.4)');
  gradient.addColorStop(1, 'rgba(58, 123, 213, 0.0)');

  new Chart(elements.ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Market Price (RON95)',
          data: ron95Market,
          borderColor: '#3a7bd5',
          backgroundColor: gradient,
          borderWidth: 2,
          radius: 0,
          hitRadius: 10,
          tension: 0.4,
          fill: true
        },
        {
          label: 'RON97',
          data: ron97,
          borderColor: '#ff4d4d',
          borderWidth: 1,
          radius: 0,
          hitRadius: 10,
          tension: 0.4,
          hidden: true
        },
        {
          label: 'BUDI95 (Subsidized)',
          data: ron95Sub,
          borderColor: '#00ff88',
          borderDash: [5, 5],
          borderWidth: 2,
          radius: 0,
          hitRadius: 10,
          tension: 0,
          hidden: true
        },
        {
          label: 'SKDS (Subsidized)',
          data: ron95Skps,
          borderColor: '#60a5fa',
          borderDash: [2, 2],
          borderWidth: 1,
          radius: 0,
          hitRadius: 10,
          tension: 0,
          hidden: true
        },
        {
          label: 'Diesel',
          data: diesel,
          borderColor: '#fbbf24',
          borderWidth: 1,
          radius: 0,
          hitRadius: 10,
          tension: 0.4,
          hidden: true
        },
        {
          label: 'Diesel (East Msia)',
          data: dieselEast,
          borderColor: '#f59e0b',
          borderWidth: 1,
          radius: 0,
          hitRadius: 10,
          tension: 0.4,
          hidden: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#a0a0a0',
            font: { family: "'Outfit', sans-serif" },
            boxWidth: 10
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#fff',
          bodyColor: '#ccc',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748b', maxTicksLimit: 5, font: { size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          ticks: {
            color: '#64748b',
            font: { size: 10 },
            callback: (val) => 'RM' + val.toFixed(2)
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });
}


// Event Listeners
elements.modeToggle.addEventListener('change', (e) => {
  state.mode = e.target.checked ? 'liters' : 'money';
  updateInputMode();
});

elements.amountInput.addEventListener('input', calculate);

// Initial Load
fetchPricesAndGraph();
fetchVisitorCount();
