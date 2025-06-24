// Tab switching functionality
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons and sections
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.calculator-section').forEach(section => section.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show corresponding section
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });


function getInputValue(id, isFloat = true) {
    const element = document.getElementById(id);
    
    if (!element) {
        throw new Error(`Input element with ID '${id}' not found in the HTML`);
    }
    
    const raw = element.value.trim();

    if (raw === '') {
        throw new Error(`Missing input: ${id.replace(/-/g, ' ')}`);
    }

    const parsed = isFloat ? parseFloat(raw) : parseInt(raw);

    if (isNaN(parsed)) {
        throw new Error(`Invalid number in: ${id.replace(/-/g, ' ')}`);
    }

    return parsed;
}


async function explanationFromAi(calculationResults) {
    try {
        // API configuration - you'll need to replace this with your actual API key
        const API_KEY = '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';
        const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
        
        if (!calculationResults) {
            throw new Error('No calculation results provided');
        }
        
        // Prepare the prompt with calculation results
        const prompt = `Please explain these wireless communication system calculation results:
        
Input Parameters:
- Bandwidth: ${calculationResults.bandwidth} Hz
- Cutoff Frequency: ${calculationResults.cutoffFreq} Hz
- Bit Quantizer: ${calculationResults.bitQuantizer} bits
- RS Compression: ${calculationResults.rs}
- RC Encoding: ${calculationResults.rc}
- Overhead Bits: ${calculationResults.overhead}

Calculated Outputs:
- Sampling Rate: ${calculationResults.samplerOutput} samples/sec
- Quantizer Output: ${calculationResults.quantizerOutput} bits/sec
- Source Encoder Output: ${calculationResults.sourceEncoderOutput} bits/sec
- Channel Encoder Output: ${calculationResults.channelEncoderOutput} bits/sec
- Interleaver Output: ${calculationResults.interleaverOutput} bits/sec

Please provide a clear explanation of these results and what they mean in the context of wireless communication systems.`;

        const requestBody = {
            model: "deepseek/deepseek-chat:free",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Wireless Communication Calculator'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            throw new Error('No response received from AI');
        }
        
    } catch (error) {
        console.error('Error getting AI explanation:', error);
        throw error;
    }
}



        // Basic calculation logic (placeholder for real calculations)
        document.querySelectorAll('.calculate-btn').forEach(button => {
            button.addEventListener('click', function() {
                const section = this.closest('.calculator-section');
                const resultValue = section.querySelector('.result-value');
                
                // Simple animation effect
                resultValue.style.opacity = '0';                setTimeout(() => {
                    resultValue.style.opacity = '1';
                    
                    // For demo purposes - in a real app this would be actual calculations
                    if (section.id === 'wireless') {
                        // resultValue.textContent = 'Data Rate: 48 Mbps | Max Range: 8.2 km';
                        //now i want to take the inputs that the user has entered and calculate the result for each output that i want.
                        try {
                                const bandwidth     = getInputValue('bandwidth',false);
                                const cutoffFreq    = getInputValue('cutoff-frequency',false);
                                const bitQuantizer  = getInputValue('bit-quantizer', false);
                                const rs            = getInputValue('rs-compression');
                                const rc            = getInputValue('rc-encoding');
                                const overhead      = getInputValue('overhead-bits', false);

                                var toUseWithSampling = (cutoffFreq<bandwidth)? cutoffFreq:bandwidth;
                                var samplerOutput = 2 * toUseWithSampling; // Nyquist rate
                                var quantizerOutput = bitQuantizer * samplerOutput;
                                var sourceEncoderOutput = rs * quantizerOutput;
                                var channelEncoderOutput = (1/rc) * sourceEncoderOutput;
                                var interleaverOutput = channelEncoderOutput;
                                //the output of burst formatter.

                                // Prepare calculation results object
                                const calculationResults = {
                                    bandwidth,
                                    cutoffFreq,
                                    bitQuantizer,
                                    rs,
                                    rc,
                                    overhead,
                                    samplerOutput,
                                    quantizerOutput,
                                    sourceEncoderOutput,
                                    channelEncoderOutput,
                                    interleaverOutput
                                };
                                
                                console.log(calculationResults);
                                
                                // Display basic results first
                                resultValue.innerHTML = `
                                    <div>Sampling Rate: ${samplerOutput.toFixed(2)} samples/sec</div>
                                    <div>Final Data Rate: ${interleaverOutput.toFixed(2)} bits/sec</div>
                                    <div>Getting AI explanation...</div>
                                `;
                                
                                // Get AI explanation automatically
                                (async () => {
                                    try {
                                        const explanation = await explanationFromAi(calculationResults);                                        resultValue.innerHTML = `
                                            <div>Sampling Rate: ${samplerOutput.toFixed(2)} samples/sec</div>
                                            <div>Final Data Rate: ${interleaverOutput.toFixed(2)} bits/sec</div>
                                            <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px;">
                                                <strong>AI Explanation:</strong><br>
                                                ${explanation.replace(/\n/g, '<br>')}
                                            </div>
                                        `;
                                    } catch (error) {                                        resultValue.innerHTML = `
                                            <div>Sampling Rate: ${samplerOutput.toFixed(2)} samples/sec</div>
                                            <div>Final Data Rate: ${interleaverOutput.toFixed(2)} bits/sec</div>
                                            <div style="margin-top: 15px; color: #ff6b6b;">
                                                AI Explanation: Error - ${error.message}
                                            </div>
                                        `;
                                    }
                                })();

                            } catch (error) {
                                alert(error.message);
                            }

                    } else if (section.id === 'ofdm') {
                        resultValue.textContent = 'Data Rate: 72 Mbps | Efficiency: 4.5 bps/Hz';
                    } else if (section.id === 'link') {
                        resultValue.textContent = 'Link Margin: 18 dB | Max Path Loss: 128 dB';
                    } else if (section.id === 'cellular') {
                        resultValue.textContent = 'Capacity: 980 Erlang | Coverage Area: 7.07 km²';
                    }
                }, 300);
            });
        });