// Link Budget Calculator
// Handles link budget calculations and display

class LinkBudgetCalculator {
  constructor() {
    this.initializeEventListeners();
  }

  // Get link budget inputs with validation
  getInputs() {
    return {
      txPower: this.getInputValue("tx-power-link"),
      txAntenna: this.getInputValue("tx-antenna"),
      rxAntenna: this.getInputValue("rx-antenna"),
      pathLoss: this.getInputValue("path-loss"),
      fadingMargin: this.getInputValue("fading-margin"),
      rxSensitivity: this.getInputValue("rx-sensitivity-link"),
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
      txPower,
      txAntenna,
      rxAntenna,
      pathLoss,
      fadingMargin,
      rxSensitivity,
    } = inputs;

    // Link budget calculations (all in dB/dBm)
    const eirp = txPower + txAntenna; // Effective Isotropic Radiated Power
    const receivedPower = eirp + rxAntenna - pathLoss - fadingMargin;
    const linkMargin = receivedPower - rxSensitivity;
    const maxPathLoss = eirp + rxAntenna - rxSensitivity - fadingMargin;

    // Additional calculations
    const freeSpaceRange = Math.sqrt(Math.pow(10, (maxPathLoss - 32.45) / 20)); // km (assuming 1 GHz)
    const snrEstimate = linkMargin + 10; // Rough estimate

    return {
      eirp,
      receivedPower,
      linkMargin,
      maxPathLoss,
      freeSpaceRange,
      snrEstimate,
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
          <div class="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-xl">
            <div class="text-sm text-orange-700 font-semibold uppercase tracking-wide mb-2">Link Margin</div>
            <div class="text-xl font-bold text-orange-700">${results.linkMargin.toFixed(
              1
            )} dB</div>
          </div>
          <div class="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-xl">
            <div class="text-sm text-red-700 font-semibold uppercase tracking-wide mb-2">Max Path Loss</div>
            <div class="text-xl font-bold text-red-700">${results.maxPathLoss.toFixed(
              1
            )} dB</div>
          </div>
          <div class="bg-gradient-to-r from-pink-100 to-pink-200 p-4 rounded-xl">
            <div class="text-sm text-pink-700 font-semibold uppercase tracking-wide mb-2">Est. Range</div>
            <div class="text-xl font-bold text-pink-700">${results.freeSpaceRange.toFixed(
              1
            )} km</div>
          </div>
        </div>
        <div class="mt-4 text-center">
          <div class="inline-flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full">
            <i class="fas fa-check-circle mr-2"></i>
            Link Budget Complete
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
