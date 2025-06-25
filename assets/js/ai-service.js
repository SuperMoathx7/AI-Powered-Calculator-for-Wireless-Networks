// AI Service Module
// Handles AI explanation functionality for all calculators

class AIService {
  constructor() {
    this.API_KEY =
      "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";
    this.API_URL = "https://openrouter.ai/api/v1/chat/completions";
  }

  // AI explanation function with error handling for different calculation types
  async getExplanation(calculationResults, calculationType = "wireless") {
    try {
      if (!calculationResults) {
        throw new Error("No calculation results provided");
      }

      let prompt = "";

      // Create specific prompts for each calculation type
      switch (calculationType) {
        case "wireless":
          prompt = `As a wireless communication systems expert, please analyze these calculation results and provide a comprehensive technical explanation:
          
Input Parameters:
- Bandwidth: ${calculationResults.bandwidth} Hz
- Cutoff Frequency: ${calculationResults.cutoffFreq} Hz
- Bit Quantizer: ${calculationResults.bitQuantizer} bits
- RS Compression Rate: ${calculationResults.rs}
- RC Channel Encoding Rate: ${calculationResults.rc}
- Overhead Bits: ${calculationResults.overhead}

Calculated System Outputs:
- Sampling Rate: ${calculationResults.samplerOutput} samples/sec
- Quantizer Output: ${calculationResults.quantizerOutput} bits/sec
- Source Encoder Output: ${calculationResults.sourceEncoderOutput} bits/sec
- Channel Encoder Output: ${calculationResults.channelEncoderOutput} bits/sec
- Final Interleaver Output: ${calculationResults.interleaverOutput} bits/sec

Please provide:
1. Technical analysis of each calculation step
2. Explanation of the signal processing chain
3. Performance implications
4. Recommendations for optimization
5. Real-world applications context`;
          break;

        case "ofdm":
          prompt = `As an OFDM systems expert, please analyze these OFDM calculation results and provide comprehensive technical insights:

Input Parameters:
- Number of Subcarriers: ${calculationResults.subcarriers}
- Cyclic Prefix Ratio: ${calculationResults.cyclicPrefix}
- Symbol Rate: ${calculationResults.symbolRate} kSymbols/sec
- Modulation: ${calculationResults.modulation}
- Guard Interval: ${calculationResults.guardInterval} μs

Calculated OFDM Outputs:
- Data Rate: ${calculationResults.dataRate} Mbps
- Spectral Efficiency: ${calculationResults.spectralEfficiency} bps/Hz
- Total Symbol Time: ${calculationResults.totalSymbolTime} seconds
- Cyclic Prefix Overhead: ${calculationResults.cyclicPrefixOverhead}%
- Bits per Symbol: ${calculationResults.bitsPerSymbol}

Please provide:
1. Analysis of OFDM system performance
2. Explanation of subcarrier utilization
3. Impact of cyclic prefix on system efficiency
4. Modulation scheme analysis
5. Recommendations for optimization
6. Applications in modern wireless standards (WiFi, LTE, 5G)`;
          break;

        case "link":
          prompt = `As a RF link budget expert, please analyze these link budget calculations and provide detailed technical insights:

Input Parameters:
- Transmit Power: ${calculationResults.txPower} dBm
- TX Antenna Gain: ${calculationResults.txAntenna} dBi
- RX Antenna Gain: ${calculationResults.rxAntenna} dBi
- Path Loss: ${calculationResults.pathLoss} dB
- Fading Margin: ${calculationResults.fadingMargin} dB
- RX Sensitivity: ${calculationResults.rxSensitivity} dBm

Calculated Link Budget Results:
- EIRP: ${calculationResults.eirp} dBm
- Received Power: ${calculationResults.receivedPower} dBm
- Link Margin: ${calculationResults.linkMargin} dB
- Maximum Path Loss: ${calculationResults.maxPathLoss} dB
- Estimated Range: ${calculationResults.freeSpaceRange} km
- SNR Estimate: ${calculationResults.snrEstimate} dB

Please provide:
1. Link budget analysis and interpretation
2. Coverage range assessment
3. Link margin adequacy evaluation
4. Path loss model considerations
5. Recommendations for link optimization
6. Real-world deployment considerations`;
          break;

        case "cellular":
          prompt = `As a cellular network design expert, please analyze these cellular system calculations and provide comprehensive insights:

Input Parameters:
- Subscribers per Cell: ${calculationResults.subscribers}
- Traffic per User: ${calculationResults.traffic} Erlang
- Cell Radius: ${calculationResults.cellRadius} km
- Frequency Reuse Factor: ${calculationResults.frequencyReuse}
- Available Channels: ${calculationResults.channels}

Calculated Cellular System Results:
- Cell Area: ${calculationResults.cellArea} km²
- Total Traffic: ${calculationResults.totalTraffic} Erlang
- Channels per Cell: ${calculationResults.channelsPerCell}
- Capacity per Cell: ${calculationResults.capacityPerCell} Erlang
- Subscriber Capacity: ${calculationResults.subscriberCapacity}
- Area Efficiency: ${calculationResults.areaEfficiency} subscribers/km²

Please provide:
1. Cellular network capacity analysis
2. Coverage and capacity trade-offs
3. Frequency reuse impact assessment
4. Traffic engineering evaluation
5. Network optimization recommendations
6. Scalability considerations for network growth`;
          break;

        default:
          throw new Error("Unknown calculation type");
      }

      prompt +=
        "\n\nFormat your response in clear sections with technical depth suitable for engineering students.";

      const requestBody = {
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "system",
            content:
              "You are an expert wireless communication systems engineer. Provide detailed, technical explanations that are educationally valuable.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      };

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Wireless Communication Calculator",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `AI API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        throw new Error("No response received from AI service");
      }
    } catch (error) {
      console.error("Error getting AI explanation:", error);
      throw error;
    }
  }

  // Show AI explanation for a specific calculator type
  async showExplanation(calculationResults, calculationType, sectionId) {
    const aiSection = document.getElementById(
      `ai-explanation${sectionId ? "-" + sectionId : ""}`
    );
    const aiContent = document.getElementById(
      `ai-content${sectionId ? "-" + sectionId : ""}`
    );

    if (aiSection && aiContent) {
      aiSection.classList.remove("hidden");
      aiContent.innerHTML = `
        <div class="flex items-center justify-center py-8">
          <div class="spinner mr-3"></div>
          <span class="text-purple-deep font-semibold">AI is analyzing your ${calculationType} results...</span>
        </div>
      `;

      try {
        const explanation = await this.getExplanation(
          calculationResults,
          calculationType
        );
        aiContent.innerHTML = `
          <div class="prose prose-lg max-w-none">
            <div class="flex items-center mb-4">
              <i class="fas fa-brain text-purple-deep mr-2"></i>
              <span class="font-semibold text-purple-deep">AI Technical Analysis:</span>
            </div>
            <div class="text-gray-700 leading-relaxed whitespace-pre-line">
              ${explanation}
            </div>
          </div>
        `;
      } catch (error) {
        aiContent.innerHTML = `
          <div class="text-center py-8">
            <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
            <div class="text-red-600 font-semibold mb-2">AI Analysis Unavailable</div>
            <div class="text-gray-600">${error.message}</div>
            <div class="mt-4 text-sm text-gray-500">The calculation results are still valid above.</div>
          </div>
        `;
      }
    }
  }
}

// Export for use in main.js
window.AIService = AIService;
