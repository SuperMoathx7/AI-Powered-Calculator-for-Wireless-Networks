// Wireless Communication System Calculator
// Handles wireless system calculations and display

class WirelessCalculator {
  constructor() {
    this.initializeEventListeners();
  }

  // Get wireless system inputs with validation
  getInputs() {
    return {
      bandwidth: this.getInputValue("bandwidth", false),
      cutoffFreq: this.getInputValue("cutoff-frequency", false),
      bitQuantizer: this.getInputValue("bit-quantizer", false),
      rs: this.getInputValue("rs-compression"),
      rc: this.getInputValue("rc-encoding"),
      overhead: this.getInputValue("overhead-bits", false),
      timeOneSegment: this.getInputValue("time-one-segment") / 1000,//new
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

    // Input validation based on field type
    this.validateInput(id, parsed);

    return parsed;
  }

  // Input validation function
  validateInput(id, value) {
    switch (id) {
      case "bandwidth":
        if (value <= 0) {
          throw new Error("Bandwidth must be positive (greater than 0 Hz)");
        }
        if (value > 5000000000) { // 5 GHz limit
          throw new Error("Bandwidth too large (maximum 5 GHz)");
        }
        break;

      case "cutoff-frequency":
        if (value <= 0) {
          throw new Error("Cutoff frequency must be positive (greater than 0 Hz)");
        }
        if (value > 5000000000) { // 5 GHz limit
          throw new Error("Cutoff frequency too large (maximum 5 GHz)");
        }
        break;

      case "bit-quantizer":
        if (value <= 0) {
          throw new Error("Number of bit quantizer must be positive");
        }
        if (!Number.isInteger(value)) {
          throw new Error("Number of bit quantizer must be a whole number");
        }
        break;

      case "rs-compression":
        if (value <= 0) {
          throw new Error("Compression rate (Rs) must be positive");
        }
        if (value > 1) {
          throw new Error("Compression rate (Rs) cannot exceed 1 (100%)");
        }
        break;

      case "rc-encoding":
        if (value <= 0) {
          throw new Error("Channel encoder rate (Rc) must be positive");
        }
        if (value > 1) {
          throw new Error("Channel encoder rate (Rc) cannot exceed 1 (100%)");
        }
        break;

      case "overhead-bits":
        if (value < 0) {
          throw new Error("Number of overhead bits cannot be negative");
        }
        if (value > 1000) {
          throw new Error("Number of overhead bits too large (maximum 1000)");
        }
        if (!Number.isInteger(value)) {
          throw new Error("Number of overhead bits must be a whole number");
        }
        break;

      case "time-one-segment":
        if (value <= 0) {
          throw new Error("Time for one segment must be positive (greater than 0 ms)");
        }
        if (value > 10000) { // 10 seconds limit
          throw new Error("Time for one segment too large (maximum 10000 ms)");
        }
        break;
    }
  }

  // Cross-field validation function
  validateCrossFields(inputs) {
    const { bandwidth, cutoffFreq, bitQuantizer, rs, rc, overhead, timeOneSegment } = inputs;


    // Check if compression and encoding rates make sense together
    if (rs < 0.1 && rc < 0.5) {
      throw new Error("Very low compression and encoding rates may result in impractical system performance");
    }

    // Check for realistic bit quantizer values
    if (bitQuantizer > 16) {
      console.warn("Warning: High bit quantizer values (>16) may be impractical for most systems");
    }

    // Check overhead relative to time segment
    const overheadRate = overhead / timeOneSegment;

    // Validate that time segment allows reasonable processing
    if (timeOneSegment < 0.1) {
      console.warn("Warning: Very short time segments (<0.1ms) may be difficult to implement");
    }
  }

  // Perform wireless system calculations
  calculate(inputs) {
    const { bandwidth, cutoffFreq, bitQuantizer, rs, rc, overhead, timeOneSegment } = inputs;

    // Cross-field validation
    this.validateCrossFields(inputs);

    // Use minimum of bandwidth and cutoff frequency for sampling
    const effectiveFreq = Math.min(cutoffFreq, bandwidth);

    // Nyquist sampling rate (2 * highest frequency)
    const samplerOutput = 2 * effectiveFreq;

    // Quantizer output (bits per sample * sampling rate)
    const quantizerOutput = bitQuantizer * samplerOutput;

    // Source encoder output (compression applied)
    const sourceEncoderOutput = rs * quantizerOutput;

    // Channel encoder output (error correction coding)
    const channelEncoderOutput = sourceEncoderOutput / rc;

    // Interleaver output (same as channel encoder for this model)
    const interleaverOutput = channelEncoderOutput;

    const interleaverInBits = interleaverOutput * timeOneSegment;

    // Burst format overhead
    const burstformat = (overhead/timeOneSegment) + interleaverOutput;//new
    console.log("overhead/timonesegment", overhead/timeOneSegment);
    console.log("Burst format output:", burstformat);
    return {
      samplerOutput,
      quantizerOutput,
      sourceEncoderOutput,
      channelEncoderOutput,
      interleaverOutput,
      burstformat,
      effectiveFreq,
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
          <div class="bg-gradient-to-r from-purple-light to-purple-soft p-4 rounded-xl">
            <div class="text-sm text-purple-deep font-semibold uppercase tracking-wide mb-2">Sampling Rate</div>
            <div class="text-xl font-bold text-purple-deep">${results.samplerOutput.toFixed(
              2
            )} samples/sec</div>
          </div>
          <div class="bg-gradient-to-r from-purple-medium to-purple-deep p-4 rounded-xl text-white">
            <div class="text-sm opacity-90 font-semibold uppercase tracking-wide mb-2">Quantizer Rate</div>
            <div class="text-xl font-bold">${(
              results.quantizerOutput / 1000
            ).toFixed(2)} Kbps</div>
          </div>
          <div class="bg-gradient-to-r from-indigo-100 to-indigo-200 p-4 rounded-xl">
            <div class="text-sm text-indigo-700 font-semibold uppercase tracking-wide mb-2">Source Encoder Rate</div>
            <div class="text-xl font-bold text-indigo-700">${(results.sourceEncoderOutput / 1000).toFixed(
              2
            )} Kbps</div>
          </div>
          <div class="bg-gradient-to-r from-purple-light to-purple-soft p-4 rounded-xl">
            <div class="text-sm text-purple-deep font-semibold uppercase tracking-wide mb-2">Channel Encoder Rate</div>
            <div class="text-xl font-bold text-purple-deep">${(results.channelEncoderOutput / 1000).toFixed(
              2
            )} Kbps</div>
          </div>
          <div class="bg-gradient-to-r from-purple-medium to-purple-deep p-4 rounded-xl text-white">
            <div class="text-sm opacity-90 font-semibold uppercase tracking-wide mb-2">Interleaver Rate</div>
            <div class="text-xl font-bold">${(results.interleaverOutput / 1000).toFixed(
              2
            )} Kbps</div>
          </div>
          <div class="bg-gradient-to-r from-indigo-100 to-indigo-200 p-4 rounded-xl">
            <div class="text-sm text-indigo-700 font-semibold uppercase tracking-wide mb-2">Burst Formatting Rate</div>
            <div class="text-xl font-bold text-indigo-700">${(results.burstformat / 1000).toFixed(
              2
            )} Kbps</div>
          </div>
        </div>
        <div class="mt-4 text-center">
          <div class="inline-flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full">
            <i class="fas fa-check-circle mr-2"></i>
            Calculation Complete
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
        System Performance Results
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
window.WirelessCalculator = WirelessCalculator;
