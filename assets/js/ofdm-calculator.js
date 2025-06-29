// OFDM System Calculator
// Handles OFDM system calculations and display

class OFDMCalculator {
  constructor() {
    this.initializeEventListeners();
  }

  // Get OFDM system inputs with validation
  getInputs() {
    const inputs = {
      modulation: document.getElementById("modulation").value,
      totalBandwidth: this.getInputValue("total-bandwidth") * 1000, // Convert kHz to Hz
      bandwidthPerRB: this.getInputValue("bandwidth-per-rb") * 1000, // Convert kHz to Hz
      timeForSlot: this.getInputValue("time-for-slot") / 1000, // Convert ms to seconds
      timeForSymbol: this.getInputValue("time-for-symbol") / 1000, // Convert ms to seconds
      numOFDMSymbols: this.getInputValue("num-ofdm-symbols", false), // Integer value
      subcarrierSpacing: this.getInputValue("subcarrier-spacing") * 1000, // Convert kHz to Hz
      numberOfParallelRBs: this.getInputValue("num-parallel-rbs", false), // Integer value
    };

    this.validateInputs(inputs);
    return inputs;
  }

  // Comprehensive input validation
  validateInputs(inputs) {
    const errors = [];
    const warnings = [];

    // Validate Total Bandwidth
    if (inputs.totalBandwidth <= 0) {
      errors.push("Total bandwidth must be positive");
    }

    // Validate Bandwidth per RB
    if (inputs.bandwidthPerRB <= 0) {
      errors.push("Bandwidth per RB must be positive");
    } 

    if (inputs.bandwidthPerRB > inputs.totalBandwidth) {
      errors.push("Bandwidth per RB cannot exceed total bandwidth");
    }

    // Validate time constraints
    if (inputs.timeForSlot <= 0) {
      errors.push("Time for slot must be positive");
    } else if (inputs.timeForSlot > 1) { // 1 second
      warnings.push("Time for slot exceeds 1 second - unusually long for OFDM slots");
    } else if (inputs.timeForSlot < 0.000001) { // 1 microsecond
      warnings.push("Time for slot is very short (< 1 μs) - may not be practical");
    }

    if (inputs.timeForSymbol <= 0) {
      errors.push("Time for symbol must be positive");
    } else if (inputs.timeForSymbol > 0.1) { // 100 ms
      warnings.push("Time for symbol exceeds 100 ms - unusually long for OFDM symbols");
    } else if (inputs.timeForSymbol < 0.000001) { // 1 microsecond
      warnings.push("Time for symbol is very short (< 1 μs) - may not be practical");
    }

    // Validate OFDM symbols count
    if (inputs.numOFDMSymbols <= 0) {
      errors.push("Number of OFDM symbols must be positive");
    } else if (!Number.isInteger(inputs.numOFDMSymbols)) {
      errors.push("Number of OFDM symbols must be an integer");
    } else if (inputs.numOFDMSymbols > 1000) {
      errors.push("Number of OFDM symbols exceeds 1000 - very high symbol count");
    }

    // Validate subcarrier spacing
    if (inputs.subcarrierSpacing <= 0) {
      errors.push("Subcarrier spacing must be positive");
    } else if (inputs.subcarrierSpacing > 1000000) { // 1 MHz
      warnings.push("Subcarrier spacing exceeds 1 MHz - unusually wide spacing");
    } else if (inputs.subcarrierSpacing < 100) { // 100 Hz
      warnings.push("Subcarrier spacing is very narrow (< 100 Hz) - may cause interference");
    }

    // Validate parallel RBs
    if (inputs.numberOfParallelRBs <= 0) {
      errors.push("Number of parallel RBs must be positive");
    } else if (!Number.isInteger(inputs.numberOfParallelRBs)) {
      errors.push("Number of parallel RBs must be an integer");
    } else if (inputs.numberOfParallelRBs > 1000) {
      warnings.push("Number of parallel RBs exceeds 1000 - very high for parallel processing");
    }

    // Cross-field validation
    if (inputs.totalBandwidth < inputs.bandwidthPerRB) {
      errors.push("Total bandwidth cannot be less than bandwidth per RB");
    }

    if (inputs.timeForSymbol > inputs.timeForSlot) {
      errors.push("Time for symbol cannot exceed time for slot");
    }

    const calculatedRBs = inputs.totalBandwidth / inputs.bandwidthPerRB;
 

    // Display errors and warnings
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }

    if (warnings.length > 0) {
      console.warn("OFDM Calculator Warnings:", warnings.join("; "));
    }
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

  // Get modulation parameters from lookup table
  getModulationParameters(modulation) {
    // Modulation parameter mapping based on standard LTE/5G specifications
    const modulationTable = {
      "BPSK": {
        codingRate: 0.5,
        bitsPerSymbol: 1,
        dataRate: 6
      },
      "QPSK": {
        codingRate: 0.5,
        bitsPerSymbol: 2,
        dataRate: 12
      },
      "16-QAM": {
        codingRate: 0.75,
        bitsPerSymbol: 4,
        dataRate: 36
      },
      "64-QAM": {
        codingRate: 0.75,
        bitsPerSymbol: 6,
        dataRate: 54
      }
    };

    return modulationTable[modulation] || modulationTable["QPSK"];
  }

  // Perform OFDM system calculations
  calculate(inputs) {
    const { modulation, totalBandwidth, bandwidthPerRB, timeForSlot, timeForSymbol, numOFDMSymbols, subcarrierSpacing, numberOfParallelRBs } = inputs;

    // Get modulation parameters from lookup table
    const modulationParams = this.getModulationParameters(modulation);
    const codingRate = modulationParams.codingRate;
    const bitsPerSymbol = modulationParams.bitsPerSymbol;
    const theoreticalDataRate = modulationParams.dataRate;

    // Calculate number of resource blocks
    const numberOfRBs = totalBandwidth / bandwidthPerRB;//##################
    
    const numOfSubcarriers = bandwidthPerRB / subcarrierSpacing;

    const numOfREs = numOFDMSymbols * numOfSubcarriers;//#######
    const numOfREsForAllSystem = numOfREs * numberOfRBs;//#########################

    const rateForREs = numOfREs * (bitsPerSymbol / timeForSymbol);//###########################

    const rateForRBs = numberOfRBs * rateForREs;//#########################

    const OFDMRate = rateForREs * numOfSubcarriers;//########################

    const maximumCapacity = rateForRBs * numberOfParallelRBs;

    const spectralEfficiency = maximumCapacity / totalBandwidth; // bps/Hz
    
    // Calculate additional parameters for display


    return {
      rateForREs: rateForREs / 1000000, // Data rate for RE (Mbps)
      numOfREs, // Num of RE
      numOfREsForAllSystem, // Total Num of REs
      OFDMRate: OFDMRate / 1000000, // Rate for OFDM Symbols (Mbps)
      rateForRBs: rateForRBs / 1000000, // Rate for RBs (Mbps)
      numberOfRBs, // Nums of RBs
      maximumCapacity: maximumCapacity / 1000000, // Maximum capacity (Mbps)
      spectralEfficiency, // Spectral efficiency (bps/Hz)
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
          <div class="bg-gradient-to-r from-cyan-100 to-cyan-200 p-4 rounded-xl">
            <div class="text-sm text-cyan-700 font-semibold uppercase tracking-wide mb-2">Data Rate for RE</div>
            <div class="text-xl font-bold text-cyan-700">${results.rateForREs.toFixed(2)} Mbps</div>
          </div>
          <div class="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-xl">
            <div class="text-sm text-blue-700 font-semibold uppercase tracking-wide mb-2">Num of RE</div>
            <div class="text-xl font-bold text-blue-700">${results.numOfREs.toFixed(0)}</div>
          </div>
          <div class="bg-gradient-to-r from-teal-100 to-teal-200 p-4 rounded-xl">
            <div class="text-sm text-teal-700 font-semibold uppercase tracking-wide mb-2">Total Num of REs</div>
            <div class="text-xl font-bold text-teal-700">${results.numOfREsForAllSystem.toFixed(0)}</div>
          </div>
          <div class="bg-gradient-to-r from-cyan-100 to-cyan-200 p-4 rounded-xl">
            <div class="text-sm text-cyan-700 font-semibold uppercase tracking-wide mb-2">Rate for OFDM Symbols</div>
            <div class="text-xl font-bold text-cyan-700">${results.OFDMRate.toFixed(2)} Mbps</div>
          </div>
          <div class="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-xl">
            <div class="text-sm text-blue-700 font-semibold uppercase tracking-wide mb-2">Rate for RBs</div>
            <div class="text-xl font-bold text-blue-700">${results.rateForRBs.toFixed(2)} Mbps</div>
          </div>
          <div class="bg-gradient-to-r from-teal-100 to-teal-200 p-4 rounded-xl">
            <div class="text-sm text-teal-700 font-semibold uppercase tracking-wide mb-2">Nums of RBs</div>
            <div class="text-xl font-bold text-teal-700">${results.numberOfRBs.toFixed(0)}</div>
          </div>
          <div class="bg-gradient-to-r from-cyan-100 to-cyan-200 p-4 rounded-xl">
            <div class="text-sm text-cyan-700 font-semibold uppercase tracking-wide mb-2">Maximum Capacity</div>
            <div class="text-xl font-bold text-cyan-700">${results.maximumCapacity.toFixed(2)} Mbps</div>
          </div>
          <div class="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-xl">
            <div class="text-sm text-blue-700 font-semibold uppercase tracking-wide mb-2">Spectral Efficiency</div>
            <div class="text-xl font-bold text-blue-700">${results.spectralEfficiency.toFixed(2)} bps/Hz</div>
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
          "result-value text-lg text-cyan-700 bg-white rounded-xl p-6";
        return existingResult;
      }
    }

    // Create new container
    const newContainer = document.createElement("div");
    newContainer.className = "result-highlight rounded-2xl p-8 mt-8 shadow-lg";
    newContainer.innerHTML = `
      <h3 class="text-xl font-bold text-cyan-700 mb-4 flex items-center">
        <i class="fas fa-chart-line mr-3"></i>
        OFDM Calculation Results
      </h3>
      <div class="result-value text-lg text-cyan-700 bg-white rounded-xl p-6"></div>
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
