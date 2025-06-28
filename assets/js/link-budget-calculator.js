// Link Budget Calculator
// Handles link budget calculations and display

class LinkBudgetCalculator {
  constructor() {
    this.initializeEventListeners();
  }

  // Get link budget inputs with validation
  getInputs() {
    return {
      apTxPower: this.getInputValue("access-point-transmit-power"),
      apAntennaGain: this.getInputValue("access-point-antenna-gain"),
      apRxSensitivity: this.getInputValue("access-point-receive-sensitivity"),
      clientTxPower: this.getInputValue("client-transmit-power"),
      clientAntennaGain: this.getInputValue("client-antenna-gain"),
      clientRxSensitivity: this.getInputValue("client-receive-sensitivity"),
      cableLossEachSide: this.getInputValue("cable-loss-each-side"),
      distanceKm: this.getInputValue("distance"),
      frequencyGhz: this.getInputValue("frequency"),
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

  // Perform link budget calculations
  calculate(inputs) {
    const {
      apTxPower,
      apAntennaGain,
      apRxSensitivity,
      clientTxPower,
      clientAntennaGain,
      clientRxSensitivity,
      cableLossEachSide,
      distanceKm,
      frequencyGhz,
    } = inputs;

    // Convert distance to meters and frequency to Hz for FSPL calculation
    const distanceM = distanceKm * 1000;
    const frequencyHz = frequencyGhz * 1e9;

    // Calculate Free Space Path Loss (FSPL) in dB
    const fsplDb =
      20 * Math.log10(distanceM) + 20 * Math.log10(frequencyHz) - 147.56;

    // AP to Client Link
    const rxPowerClient =
      apTxPower +
      apAntennaGain -
      cableLossEachSide -
      fsplDb -
      cableLossEachSide +
      clientAntennaGain;
    const linkMarginApToClient = rxPowerClient - clientRxSensitivity;

    // Client to AP Link
    const rxPowerAp =
      clientTxPower +
      clientAntennaGain -
      cableLossEachSide -
      fsplDb -
      cableLossEachSide +
      apAntennaGain;
    const linkMarginClientToAp = rxPowerAp - apRxSensitivity;

    // Determine Link Status
    const linkReliable =
      linkMarginApToClient >= 0 && linkMarginClientToAp >= 0 ? "Yes" : "No";

    return {
      transmittedPowerAp: apTxPower,
      receivedSignalStrengthClient: rxPowerClient,
      transmittedPowerClient: clientTxPower,
      receivedSignalStrengthAp: rxPowerAp,
      freeSpaceLoss: fsplDb,
      linkMarginApToClient: linkMarginApToClient,
      linkMarginClientToAp: linkMarginClientToAp,
      status: linkReliable,
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-xl">
            <div class="text-sm text-purple-700 font-semibold uppercase tracking-wide mb-2">AP Transmitted Power</div>
            <div class="text-xl font-bold text-purple-700">${results.transmittedPowerAp.toFixed(
              2
            )} dBm</div>
          </div>
          <div class="bg-gradient-to-r from-violet-100 to-violet-200 p-4 rounded-xl">
            <div class="text-sm text-violet-700 font-semibold uppercase tracking-wide mb-2">AP Received Power</div>
            <div class="text-xl font-bold text-violet-700">${results.receivedSignalStrengthAp.toFixed(
              2
            )} dBm</div>
          </div>
          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-xl">
            <div class="text-sm text-purple-700 font-semibold uppercase tracking-wide mb-2">Client Transmitted Power</div>
            <div class="text-xl font-bold text-purple-700">${results.transmittedPowerClient.toFixed(
              2
            )} dBm</div>
          </div>
          <div class="bg-gradient-to-r from-violet-100 to-violet-200 p-4 rounded-xl">
            <div class="text-sm text-violet-700 font-semibold uppercase tracking-wide mb-2">Client Received Power</div>
            <div class="text-xl font-bold text-violet-700">${results.receivedSignalStrengthClient.toFixed(
              2
            )} dBm</div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gradient-to-r from-indigo-100 to-indigo-200 p-4 rounded-xl">
            <div class="text-sm text-indigo-700 font-semibold uppercase tracking-wide mb-2">Free Space Path Loss</div>
            <div class="text-xl font-bold text-indigo-700">${results.freeSpaceLoss.toFixed(
              2
            )} dB</div>
          </div>
          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-xl">
            <div class="text-sm text-purple-700 font-semibold uppercase tracking-wide mb-2">AP to Client Margin</div>
            <div class="text-xl font-bold text-purple-700">${results.linkMarginApToClient.toFixed(
              2
            )} dB</div>
          </div>
          <div class="bg-gradient-to-r from-violet-100 to-violet-200 p-4 rounded-xl">
            <div class="text-sm text-violet-700 font-semibold uppercase tracking-wide mb-2">Client to AP Margin</div>
            <div class="text-xl font-bold text-violet-700">${results.linkMarginClientToAp.toFixed(
              2
            )} dB</div>
          </div>
        </div>
        <div class="text-center">
          <div class="inline-flex items-center ${
            results.status === "Yes"
              ? "text-green-600 bg-green-50"
              : "text-red-600 bg-red-50"
          } px-6 py-3 rounded-full">
            <i class="fas ${
              results.status === "Yes" ? "fa-check-circle" : "fa-times-circle"
            } mr-2"></i>
            Link ${results.status === "Yes" ? "Reliable" : "Not Reliable"} (${
        results.status
      })
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
        <i class="fas fa-satellite-dish mr-3"></i>
        Link Budget Analysis
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
window.LinkBudgetCalculator = LinkBudgetCalculator;
