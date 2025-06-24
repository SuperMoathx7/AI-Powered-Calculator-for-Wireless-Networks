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
        
        // Basic calculation logic (placeholder for real calculations)
        document.querySelectorAll('.calculate-btn').forEach(button => {
            button.addEventListener('click', function() {
                const section = this.closest('.calculator-section');
                const resultValue = section.querySelector('.result-value');
                
                // Simple animation effect
                resultValue.style.opacity = '0';
                setTimeout(() => {
                    resultValue.style.opacity = '1';
                    
                    // For demo purposes - in a real app this would be actual calculations
                    if (section.id === 'wireless') {
                        resultValue.textContent = 'Data Rate: 48 Mbps | Max Range: 8.2 km';
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