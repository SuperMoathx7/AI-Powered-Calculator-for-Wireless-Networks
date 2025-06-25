// OFDM System Calculator
// Handles OFDM system calculations and display

class OFDMCalculator {
  constructor() {
    this.initializeEventListeners();
  }

  // Get OFDM system inputs with validation
  getInputs() {
    return {
      subcarriers: this.getInputValue("subcarriers", false),
      cyclicPrefix: this.getInputValue("cyclic-prefix"),
      symbolRate: this.getInputValue("symbol-rate"),
      modulation: document.getElementById("ofdm-modulation").value,
      guardInterval: this.getInputValue("guard-interval"),
    };
  }

  // Utility function to get input values with validation
  getInputValue(id, isFloat = true) {
    const element = document.getElementById(id);

    if (!element) {
      throw new Error(`Input element with ID '${id}' not found in the HTML`);
    }

    const raw = element.value.trim();

    if (raw === "") {
      throw new Error(`Missing input: ${id.replace(/-/g, " ")}`);
    }

    const parsed = isFloat ? parseFloat(raw) : parseInt(raw);

    if (isNaN(parsed)) {
      throw new Error(`Invalid number in: ${id.replace(/-/g, " ")}`);
    }

    return parsed;
  }

  // Perform OFDM system calculations
  calculate(inputs) {
    const { subcarriers, cyclicPrefix, symbolRate, modulation, guardInterval } =
      inputs;

    // Modulation bits per symbol mapping
    const modulationBits = {
      BPSK: 1,
      QPSK: 2,
      "16-QAM": 4,
      "64-QAM": 6,
    };

    const bitsPerSymbol = modulationBits[modulation] || 2;

    // OFDM calculations
    const usefulSymbolTime = 1 / (symbolRate * 1000); // Convert kHz to Hz
    const guardTime = guardInterval / 1000000; // Convert μs to seconds
    const totalSymbolTime = usefulSymbolTime + guardTime;
    const dataRate =
      (subcarriers * bitsPerSymbol * symbolRate * 1000) / 1000000; // Mbps
    const spectralEfficiency = dataRate / (symbolRate / 1000); // bps/Hz
    const cyclicPrefixOverhead = (guardTime / totalSymbolTime) * 100;

    return {
      dataRate,
      spectralEfficiency,
      totalSymbolTime,
      cyclicPrefixOverhead,
      bitsPerSymbol,
      usefulSymbolTime: usefulSymbolTime * 1000000, // Convert to μs for display
    };
  }

  // Display results with animations
  displayResults(section, results) {
    let resultValue = section.querySelector(".result-value");

    // Create result container if it doesn't exist
    if (!resultValue) {
      resultValue = this.createResultContainer(section);
    }

    // Fade out current results
    resultValue.style.opacity = "0";

    setTimeout(() => {
      const resultHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-xl">
            <div class="text-sm text-blue-700 font-semibold uppercase tracking-wide mb-2">Data Rate</div>
            <div class="text-xl font-bold text-blue-700">${results.dataRate.toFixed(
              2
            )} Mbps</div>
          </div>
          <div class="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-xl">
            <div class="text-sm text-green-700 font-semibold uppercase tracking-wide mb-2">Spectral Efficiency</div>
            <div class="text-xl font-bold text-green-700">${results.spectralEfficiency.toFixed(
              2
            )} bps/Hz</div>
          </div>
          <div class="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-xl">
            <div class="text-sm text-yellow-700 font-semibold uppercase tracking-wide mb-2">Symbol Time</div>
            <div class="text-xl font-bold text-yellow-700">${results.usefulSymbolTime.toFixed(
              2
            )} μs</div>
          </div>
        </div>
        <div class="mt-4 text-center">
          <div class="inline-flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full">
            <i class="fas fa-check-circle mr-2"></i>
            OFDM Calculation Complete
          </div>
        </div>
      `;

      resultValue.innerHTML = resultHTML;
      resultValue.style.opacity = "1";
    }, 300);
  }

  // Create result container if it doesn't exist
  createResultContainer(section) {
    const resultContainer =
      section.querySelector(".result-highlight") ||
      section.querySelector(".bg-gradient-to-r");

    if (resultContainer) {
      const existingResult = resultContainer.querySelector("div:last-child");
      if (existingResult) {
        existingResult.className =
          "result-value text-lg text-purple-deep bg-white rounded-xl p-6";
        return existingResult;
      }
    }

    // Create new container
    const newContainer = document.createElement("div");
    newContainer.className = "result-highlight rounded-2xl p-8 mt-8 shadow-lg";
    newContainer.innerHTML = `
      <h3 class="text-xl font-bold text-purple-deep mb-4 flex items-center">
        <i class="fas fa-chart-line mr-3"></i>
        OFDM Calculation Results
      </h3>
      <div class="result-value text-lg text-purple-deep bg-white rounded-xl p-6"></div>
    `;
    section.appendChild(newContainer);
    return newContainer.querySelector(".result-value");
  }

  // Initialize event listeners
  initializeEventListeners() {
    // This will be called by the main controller
  }
}

// Export for use in main.js
window.OFDMCalculator = OFDMCalculator;
