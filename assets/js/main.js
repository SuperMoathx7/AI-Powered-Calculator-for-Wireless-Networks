// Main Wireless Networks Calculator
// Combines all calculator modules and handles main application logic

class WirelessNetworksApp {
  constructor() {
    // Initialize all calculator modules
    this.wirelessCalculator = new WirelessCalculator();
    this.ofdmCalculator = new OFDMCalculator();
    this.linkBudgetCalculator = new LinkBudgetCalculator();
    this.cellularCalculator = new CellularCalculator();
    this.aiService = new AIService();

    // Initialize the application
    this.initializeApp();
  }

  initializeApp() {
    this.initializeTabSwitching();
    this.initializeCalculatorButtons();
    this.initializeInputValidation();
    this.initializePageAnimations();
  }

  // Tab switching functionality with smooth animations
  initializeTabSwitching() {
    document.querySelectorAll(".tab-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        // Remove active class from all buttons and sections
        document
          .querySelectorAll(".tab-btn")
          .forEach((btn) => btn.classList.remove("active"));
        document
          .querySelectorAll(".calculator-section")
          .forEach((section) => section.classList.remove("active"));

        // Add active class to clicked button with animation
        button.classList.add("active");

        // Show corresponding section with fade animation
        const tabId = button.getAttribute("data-tab");
        const targetSection = document.getElementById(tabId);
        targetSection.classList.add("active");

        // Hide all AI explanation sections when switching tabs
        document
          .querySelectorAll("[id^='ai-explanation']")
          .forEach((aiSection) => {
            aiSection.classList.add("hidden");
          });
      });
    });
  }

  // Initialize calculator button event listeners
  initializeCalculatorButtons() {
    document.querySelectorAll(".calculate-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const section = button.closest(".calculator-section");
        await this.handleCalculation(button, section);
      });
    });
  }

  // Handle calculation for any calculator type
  async handleCalculation(button, section) {
    // Hide all AI explanation sections when starting new calculations
    document.querySelectorAll("[id^='ai-explanation']").forEach((aiSection) => {
      aiSection.classList.add("hidden");
    });

    // Add loading state to button
    const originalText = button.innerHTML;
    button.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-3"></i>Calculating...';
    button.disabled = true;

    try {
      let calculator,
        inputs,
        results,
        calculationResults,
        calculationType,
        sectionId;

      // Determine which calculator to use based on section ID
      switch (section.id) {
        case "wireless":
          calculator = this.wirelessCalculator;
          inputs = calculator.getInputs();
          results = calculator.calculate(inputs);
          calculator.displayResults(section, results);
          calculationResults = { ...inputs, ...results };
          calculationType = "wireless";
          sectionId = "";
          console.log("Wireless System Results:", calculationResults);
          break;

        case "ofdm":
          calculator = this.ofdmCalculator;
          inputs = calculator.getInputs();
          results = calculator.calculate(inputs);
          calculator.displayResults(section, results);
          calculationResults = { ...inputs, ...results };
          calculationType = "ofdm";
          sectionId = "ofdm";
          console.log("OFDM System Results:", calculationResults);
          break;

        case "link":
          calculator = this.linkBudgetCalculator;
          inputs = calculator.getInputs();
          results = calculator.calculate(inputs);
          calculator.displayResults(section, results);
          calculationResults = { ...inputs, ...results };
          calculationType = "link";
          sectionId = "link";
          console.log("Link Budget Results:", calculationResults);
          break;

        case "cellular":
          calculator = this.cellularCalculator;
          inputs = calculator.getInputs();
          results = calculator.calculate(inputs);
          calculator.displayResults(section, results);
          calculationResults = { ...inputs, ...results };
          calculationType = "cellular";
          sectionId = "cellular";
          console.log("Cellular System Results:", calculationResults);
          break;

        default:
          throw new Error("Unknown calculator section");
      }

      // Show AI explanation
      await this.aiService.showExplanation(
        calculationResults,
        calculationType,
        sectionId
      );
    } catch (error) {
      this.displayError(section, error);
    } finally {
      // Restore button after delay
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 1000);
    }
  }

  // Display error message
  displayError(section, error) {
    let resultValue = section.querySelector(".result-value");

    if (!resultValue) {
      const resultContainer =
        section.querySelector(".result-highlight") ||
        section.querySelector(".bg-gradient-to-r");

      if (resultContainer) {
        const existingResult = resultContainer.querySelector("div:last-child");
        if (existingResult) {
          existingResult.className =
            "result-value text-lg text-purple-deep bg-white rounded-xl p-6";
          resultValue = existingResult;
        }
      }

      if (!resultValue) {
        const newContainer = document.createElement("div");
        newContainer.className =
          "result-highlight rounded-2xl p-8 mt-8 shadow-lg";
        newContainer.innerHTML = `
          <h3 class="text-xl font-bold text-purple-deep mb-4 flex items-center">
            <i class="fas fa-chart-line mr-3"></i>
            Calculation Results
          </h3>
          <div class="result-value text-lg text-purple-deep bg-white rounded-xl p-6"></div>
        `;
        section.appendChild(newContainer);
        resultValue = newContainer.querySelector(".result-value");
      }
    }

    resultValue.innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-exclamation-circle text-red-500 text-3xl mb-4"></i>
        <div class="text-red-600 font-semibold mb-2">Calculation Error</div>
        <div class="text-gray-600">${error.message}</div>
      </div>
    `;
  }

  // Input validation and real-time feedback
  initializeInputValidation() {
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        const value = parseFloat(input.value);

        // Remove previous validation classes
        input.classList.remove("border-red-500", "border-green-500");

        if (input.value && !isNaN(value)) {
          // Valid input
          input.classList.add("border-green-500");
        } else if (input.value) {
          // Invalid input
          input.classList.add("border-red-500");
        }
      });

      // Add focus effects
      input.addEventListener("focus", (e) => {
        input.parentElement.classList.add("transform", "scale-105");
      });

      input.addEventListener("blur", (e) => {
        input.parentElement.classList.remove("transform", "scale-105");
      });
    });
  }

  // Initialize page animations
  initializePageAnimations() {
    document.addEventListener("DOMContentLoaded", () => {
      // Add entrance animations to elements
      const animatedElements = document.querySelectorAll(".page-transition");

      animatedElements.forEach((element, index) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";

        setTimeout(() => {
          element.style.transition = "all 0.6s ease-out";
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }, index * 200);
      });

      // Add floating animation to background elements
      const floatingElements = document.querySelectorAll(".floating");
      floatingElements.forEach((element) => {
        element.style.animation = `float ${
          6 + Math.random() * 2
        }s ease-in-out infinite`;
        element.style.animationDelay = `${Math.random() * 2}s`;
      });
    });
  }

  // Utility function to show notifications
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;

    const colors = {
      info: "bg-blue-500 text-white",
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-black",
    };

    notification.className += ` ${colors[type]}`;
    notification.innerHTML = `
      <div class="flex items-center">
        <span>${message}</span>
        <button class="ml-3 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new WirelessNetworksApp();

  // Export app instance for external access
  window.WirelessNetworksApp = app;

  // Export individual calculators for backwards compatibility
  window.WirelessCalculatorAPI = {
    calculateWirelessSystem: (inputs) =>
      app.wirelessCalculator.calculate(inputs),
    calculateOFDMSystem: (inputs) => app.ofdmCalculator.calculate(inputs),
    calculateLinkBudget: (inputs) => app.linkBudgetCalculator.calculate(inputs),
    calculateCellularSystem: (inputs) =>
      app.cellularCalculator.calculate(inputs),
    getAIExplanation: (results, type) =>
      app.aiService.getExplanation(results, type),
    showNotification: (message, type) => app.showNotification(message, type),
  };
});
