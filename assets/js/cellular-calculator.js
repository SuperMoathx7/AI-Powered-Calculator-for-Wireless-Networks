// Cellular System Calculator
// Handles cellular system calculations and display

class CellularCalculator {
  constructor() {
    this.initializeEventListeners();
  }

  // Get cellular system inputs with validation
  getInputs() {
    return {
      subscribers: this.getInputValue("subscribers", false),
      traffic: this.getInputValue("traffic"),
      cellRadius: this.getInputValue("cell-radius"),
      frequencyReuse: this.getInputValue("frequency-reuse", false),
      channels: this.getInputValue("channels", false),
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

  // Perform cellular system calculations
  calculate(inputs) {
    const { subscribers, traffic, cellRadius, frequencyReuse, channels } =
      inputs;

    // Cellular system calculations
    const cellArea = Math.PI * Math.pow(cellRadius, 2); // km²
    const totalTraffic = subscribers * traffic; // Total Erlang
    const channelsPerCell = Math.floor(channels / frequencyReuse);
    const capacityPerCell = channelsPerCell * 0.9; // Assume 90% efficiency (Erlang-B)
    const subscriberCapacity = Math.floor(capacityPerCell / traffic);
    const spectralReuse = frequencyReuse;
    const areaEfficiency = subscriberCapacity / cellArea;

    return {
      cellArea,
      totalTraffic,
      channelsPerCell,
      capacityPerCell,
      subscriberCapacity,
      spectralReuse,
      areaEfficiency,
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
          <div class="bg-gradient-to-r from-teal-100 to-teal-200 p-4 rounded-xl">
            <div class="text-sm text-teal-700 font-semibold uppercase tracking-wide mb-2">Cell Capacity</div>
            <div class="text-xl font-bold text-teal-700">${results.capacityPerCell.toFixed(
              1
            )} Erlang</div>
          </div>
          <div class="bg-gradient-to-r from-indigo-100 to-indigo-200 p-4 rounded-xl">
            <div class="text-sm text-indigo-700 font-semibold uppercase tracking-wide mb-2">Coverage Area</div>
            <div class="text-xl font-bold text-indigo-700">${results.cellArea.toFixed(
              2
            )} km²</div>
          </div>
          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-xl">
            <div class="text-sm text-purple-700 font-semibold uppercase tracking-wide mb-2">Subscriber Capacity</div>
            <div class="text-xl font-bold text-purple-700">${
              results.subscriberCapacity
            }</div>
          </div>
        </div>
        <div class="mt-4 text-center">
          <div class="inline-flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full">
            <i class="fas fa-check-circle mr-2"></i>
            Cellular Design Complete
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
        <i class="fas fa-network-wired mr-3"></i>
        Cellular System Analysis
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
window.CellularCalculator = CellularCalculator;
