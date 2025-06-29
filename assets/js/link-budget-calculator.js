// Link Budget Calculator
// Handles link budget calculations and display

class LinkBudgetCalculator {
  constructor() {
    this.initializeEventListeners();
  }

  // Get link budget inputs with validation
  getInputs() {
    const inputs = {
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

    this.validateInputs(inputs);
    return inputs;
  }

  // Comprehensive input validation
  validateInputs(inputs) {
    const errors = [];
    const warnings = [];

    // Validate transmit power levels (typical range: -30 to +50 dBm)
    if (inputs.apTxPower < -50 || inputs.apTxPower > 100) {
      if (inputs.apTxPower < -50) {
        errors.push("AP transmit power is too low (< -50 dBm)");
      } else {
        errors.push("AP transmit power is too high (> 100 dBm) - exceeds regulatory limits");
      }
    } else if (inputs.apTxPower > 50) {
      warnings.push("AP transmit power is very high (> 50 dBm) - check regulatory compliance");
    } else if (inputs.apTxPower < 0) {
      warnings.push("AP transmit power is below 0 dBm - may result in poor coverage");
    }

    if (inputs.clientTxPower < -50 || inputs.clientTxPower > 100) {
      if (inputs.clientTxPower < -50) {
        errors.push("Client transmit power is too low (< -50 dBm)");
      } else {
        errors.push("Client transmit power is too high (> 100 dBm) - exceeds regulatory limits");
      }
    } else if (inputs.clientTxPower > 30) {
      warnings.push("Client transmit power is very high (> 30 dBm) - typical mobile devices use < 30 dBm");
    }

    // Validate antenna gains (typical range: -10 to +30 dBi)
    if (inputs.apAntennaGain < -20 || inputs.apAntennaGain > 50) {
      if (inputs.apAntennaGain < -20) {
        errors.push("AP antenna gain is unrealistically low (< -20 dBi)");
      } else {
        errors.push("AP antenna gain is unrealistically high (> 50 dBi)");
      }
    } else if (inputs.apAntennaGain > 30) {
      warnings.push("AP antenna gain is very high (> 30 dBi) - verify antenna specifications");
    }

    if (inputs.clientAntennaGain < -20 || inputs.clientAntennaGain > 50) {
      if (inputs.clientAntennaGain < -20) {
        errors.push("Client antenna gain is unrealistically low (< -20 dBi)");
      } else {
        errors.push("Client antenna gain is unrealistically high (> 50 dBi)");
      }
    } else if (inputs.clientAntennaGain > 15) {
      warnings.push("Client antenna gain is high (> 15 dBi) - typical mobile devices have lower gains");
    }

    // Validate receiver sensitivity (typical range: -110 to -30 dBm)
    if (inputs.apRxSensitivity > -10 || inputs.apRxSensitivity < -130) {
      if (inputs.apRxSensitivity > -10) {
        errors.push("AP receiver sensitivity is too high (> -10 dBm) - receivers need negative sensitivity");
      } else {
        errors.push("AP receiver sensitivity is unrealistically low (< -130 dBm)");
      }
    } else if (inputs.apRxSensitivity > -50) {
      warnings.push("AP receiver sensitivity is poor (> -50 dBm) - modern receivers typically have better sensitivity");
    }

    if (inputs.clientRxSensitivity > -10 || inputs.clientRxSensitivity < -130) {
      if (inputs.clientRxSensitivity > -10) {
        errors.push("Client receiver sensitivity is too high (> -10 dBm) - receivers need negative sensitivity");
      } else {
        errors.push("Client receiver sensitivity is unrealistically low (< -130 dBm)");
      }
    }

    // Validate cable loss (typical range: 0 to 10 dB per side)
    if (inputs.cableLossEachSide < 0) {
      errors.push("Cable loss cannot be negative");
    } else if (inputs.cableLossEachSide > 20) {
      warnings.push("Cable loss is very high (> 20 dB) - check cable specifications and length");
    }

    // Validate distance (must be positive, practical range: 0.001 to 1000 km)
    if (inputs.distanceKm <= 0) {
      errors.push("Distance must be positive");
    } else if (inputs.distanceKm > 1000) {
      warnings.push("Distance exceeds 1000 km - beyond typical wireless communication range");
    } else if (inputs.distanceKm < 0.001) {
      warnings.push("Distance is very short (< 1 m) - near field effects may apply");
    }

    // Validate frequency (typical wireless range: 0.1 to 100 GHz)
    if (inputs.frequencyGhz <= 0) {
      errors.push("Frequency must be positive");
    } else if (inputs.frequencyGhz > 100) {
      warnings.push("Frequency exceeds 100 GHz - atmospheric absorption becomes significant");
    } else if (inputs.frequencyGhz < 0.1) {
      warnings.push("Frequency is very low (< 100 MHz) - not typical for modern wireless systems");
    }

    // Cross-field validation
    const totalTxPowerAP = inputs.apTxPower + inputs.apAntennaGain;
    const totalTxPowerClient = inputs.clientTxPower + inputs.clientAntennaGain;
    
    if (totalTxPowerAP > 80) {
      warnings.push(`Total AP EIRP (${totalTxPowerAP.toFixed(1)} dBm) is very high - check regulatory limits`);
    }
    
    if (totalTxPowerClient > 60) {
      warnings.push(`Total client EIRP (${totalTxPowerClient.toFixed(1)} dBm) is very high for mobile devices`);
    }

    // Check for reasonable link margins
    const estimatedFSPL = 20 * Math.log10(inputs.distanceKm * 1000) + 20 * Math.log10(inputs.frequencyGhz * 1e9) - 147.56;
    const estimatedMarginAP = totalTxPowerAP - inputs.cableLossEachSide * 2 - estimatedFSPL + inputs.clientAntennaGain - inputs.clientRxSensitivity;
    const estimatedMarginClient = totalTxPowerClient - inputs.cableLossEachSide * 2 - estimatedFSPL + inputs.apAntennaGain - inputs.apRxSensitivity;

    if (estimatedMarginAP < -20 || estimatedMarginClient < -20) {
      warnings.push("Estimated link margins are very poor - link may not be reliable");
    }

    // Display errors and warnings
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }

    if (warnings.length > 0) {
      console.warn("Link Budget Calculator Warnings:", warnings.join("; "));
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
