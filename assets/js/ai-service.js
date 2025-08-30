// AI Service Module
// Handles AI explanation functionality for all calculators

class AIService {
  constructor() {
    this.API_KEY =
      "Put API key here";
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
- Overhead Bits: ${calculationResults.overhead} bits
- Time One Segment: ${calculationResults.timeOneSegment} seconds

Calculated System Outputs:
- Sampling Rate: ${calculationResults.samplerOutput} samples/sec
- Quantizer Output: ${calculationResults.quantizerOutput} bits/sec
- Source Encoder Output: ${calculationResults.sourceEncoderOutput} bits/sec
- Channel Encoder Output: ${calculationResults.channelEncoderOutput} bits/sec
- Final Interleaver Output: ${calculationResults.interleaverOutput} bits/sec
- Burst Format Output: ${calculationResults.burstformat} bits/sec

Please provide:
1. Technical analysis of each calculation step
2. Explanation of the signal processing chain
3. Performance implications
4. Recommendations for optimization
5. Real-world applications context

and make the output suitable for engineering students, and make it in paragraphs, a header, then paragraphs, without formatting, only text, and in short please, in short, two paragraphs at most.`;
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
6. Applications in modern wireless standards (WiFi, LTE, 5G)

and make the output suitable for engineering students, and make it in paragraphs, a header, then paragraphs, without formatting, only text, and in short please, in short, two paragraphs at most.
`;
          break;

        case "link":
          prompt = `As a RF link budget expert, please analyze these bidirectional link budget calculations and provide detailed technical insights:

Input Parameters:
- AP Transmit Power: ${calculationResults.transmittedPowerAp} dBm
- AP Antenna Gain: ${calculationResults.apAntennaGain} dBi
- AP RX Sensitivity: ${calculationResults.apRxSensitivity} dBm
- Client Transmit Power: ${calculationResults.transmittedPowerClient} dBm
- Client Antenna Gain: ${calculationResults.clientAntennaGain} dBi
- Client RX Sensitivity: ${calculationResults.clientRxSensitivity} dBm
- Cable Loss Each Side: ${calculationResults.cableLossEachSide} dB
- Distance: ${calculationResults.distanceKm} km
- Frequency: ${calculationResults.frequencyGhz} GHz

Calculated Link Budget Results:
- AP Transmitted Power: ${calculationResults.transmittedPowerAp} dBm
- Client Received Signal Strength: ${calculationResults.receivedSignalStrengthClient} dBm
- Client Transmitted Power: ${calculationResults.transmittedPowerClient} dBm
- AP Received Signal Strength: ${calculationResults.receivedSignalStrengthAp} dBm
- Free Space Path Loss: ${calculationResults.freeSpaceLoss} dB
- Link Margin (AP to Client): ${calculationResults.linkMarginApToClient} dB
- Link Margin (Client to AP): ${calculationResults.linkMarginClientToAp} dB
- Link Status: ${calculationResults.status}

Please provide:
1. Bidirectional link budget analysis and interpretation
2. Free Space Path Loss calculation assessment
3. Link margin adequacy evaluation for both directions
4. Cable loss impact on overall system performance
5. Recommendations for link optimization and reliability
6. Real-world wireless deployment considerations

and make the output suitable for engineering students, and make it in paragraphs, a header, then paragraphs, without formatting, only text, and in short please, in short, two paragraphs at most.
`;
          break;

        case "cellular":
          prompt = `As a cellular network design expert, please analyze these cellular system calculations and provide comprehensive insights:

Input Parameters:
- Time per Carrier: ${calculationResults.timePerCarrier} seconds
- Number of Users: ${calculationResults.numUsers}
- Average Calls per Day: ${calculationResults.avgCallsPerDay}
- Base Station Power: ${calculationResults.basePower} watts
- Path Loss Exponent: ${calculationResults.pathLossExponent}
- Interference Margin: ${calculationResults.interferenceMargin} dB
- Cluster Size: ${calculationResults.clusterSize}
- Required GoS: ${calculationResults.requiredGoS}%
- Power per Carrier: ${calculationResults.powerPerCarrier} watts

Calculated Cellular System Results:
- Maximum Distance: ${calculationResults.maxDistance} m
- Cell Size: ${calculationResults.cellSize} m²
- Number of Cells: ${calculationResults.numCells}
- Traffic Load: ${calculationResults.trafficLoad} Erlang
- Cluster Size: ${calculationResults.clusterSize}
- Minimum Carriers Required: ${calculationResults.minCarriers}
- Actual GoS Achieved: ${calculationResults.actualGoS}%
- System Efficiency: ${calculationResults.efficiency}%

Please provide:
1. Cellular network design analysis with focus on coverage and capacity planning
2. Traffic engineering evaluation including Erlang-B blocking probability analysis
3. Power budget assessment and interference management considerations
4. Cluster size impact on frequency reuse and system capacity
5. Grade of Service (GoS) performance evaluation and optimization recommendations
6. Real-world deployment considerations for cellular network planning

and make the output suitable for engineering students, and make it in paragraphs, a header, then paragraphs, without formatting, only text, and in short please, in short, two paragraphs at most.
`;
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
