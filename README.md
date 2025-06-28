# 🛰️ AI-Powered Calculator for Wireless Networks

[![GitHub stars](https://img.shields.io/github/stars/SuperMoathx7/Wireless?style=flat-square)](https://github.com/SuperMoathx7/Wireless/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/SuperMoathx7/Wireless?style=flat-square)](https://github.com/SuperMoathx7/Wireless/fork)
[![GitHub issues](https://img.shields.io/github/issues/SuperMoathx7/Wireless?style=flat-square)](https://github.com/SuperMoathx7/Wireless/issues)
[![License](https://img.shields.io/github/license/SuperMoathx7/Wireless?style=flat-square)](https://github.com/SuperMoathx7/Wireless/blob/main/LICENSE)

A comprehensive web-based calculator suite for wireless communication systems analysis and design. This project provides advanced tools for designing, analyzing, and optimizing modern wireless communication systems and mobile networks with AI-powered explanations.

## 🌟 Features

### 📡 **Wireless Communication System Calculator**

- Bandwidth and cutoff frequency analysis
- Bit quantizer configuration
- Compression and encoding rate calculations
- Overhead bits optimization
- Real-time system performance metrics

### 📊 **OFDM System Calculator**

- Subcarrier configuration and optimization
- Cyclic prefix ratio calculations
- Symbol rate analysis
- Modulation scheme selection (BPSK, QPSK, 16-QAM, 64-QAM)
- Guard interval optimization

### 📶 **Link Budget Calculator**

- Transmit and receive power analysis
- Antenna gain calculations
- Path loss estimation
- Fading margin analysis
- Coverage area predictions

### 🏢 **Cellular System Analysis**

- Advanced cellular network design and capacity planning
- Traffic load analysis with Erlang-B blocking probability calculations
- Coverage area optimization based on power budget analysis
- Maximum distance and cell size calculations
- Cluster size determination for frequency reuse planning
- Grade of Service (GoS) performance evaluation
- System efficiency and carrier requirement analysis

### 🤖 **AI-Powered Analysis**

- Intelligent result interpretation
- Performance optimization suggestions
- System design recommendations
- Educational explanations

## 🚀 Live Demo

Visit the live application: [Wireless Networks Calculator](https://supermoathx7.github.io/AI-Powered-Calculator-for-Wireless-Networks/)

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Inter, JetBrains Mono)
- **AI Integration**: Custom AI service for result analysis
- **Build Tools**: Modern web standards (no build process required)

## 📁 Project Structure

```
wireless-networks-calculator/
├── index.html                 # Main application file
├── README.md                 # Project documentation
├── assets/
│   ├── style.css            # Custom styles and animations
│   ├── imgs/                # Project images and screenshots
│   │   ├── amr.jpg         # Team member photo
│   │   └── moath.jpeg      # Team member photo
│   └── js/                  # JavaScript modules
│       ├── main.js         # Main application controller
│       ├── wireless-calculator.js    # Wireless system calculations
│       ├── ofdm-calculator.js        # OFDM system calculations
│       ├── link-budget-calculator.js # Link budget calculations
│       ├── cellular-calculator.js    # Cellular system calculations
│       └── ai-service.js            # AI analysis service
```

## 🔧 Installation & Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CDN resources)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/SuperMoathx7/Wireless.git
   cd Wireless
   ```

2. **Open in browser**

   ```bash
   # Simply open index.html in your preferred browser
   # Or use a local server:
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Start calculating!**
   - No build process required
   - No dependencies to install
   - Works offline (except AI features)

## 🎯 Usage Guide

### Getting Started

1. **Select Calculator Type**: Choose from the four available calculators using the navigation tabs
2. **Input Parameters**: Enter your system specifications in the provided fields
3. **Calculate Results**: Click the calculate button to generate results
4. **View AI Analysis**: Review the AI-powered explanations and recommendations

### Calculator Specific Usage

#### Wireless System Calculator

```javascript
// Example calculation flow
Input: Bandwidth = 2400 Hz, Cutoff Frequency = 2000 Hz
Output: System capacity, efficiency metrics, performance analysis
```

#### OFDM Calculator

```javascript
// Configuration example
Subcarriers: 64, Cyclic Prefix: 0.25, Modulation: 64-QAM
Result: Throughput, spectral efficiency, symbol timing
```

#### Link Budget

```javascript
// Coverage analysis
TX Power: 30 dBm, Path Loss: 110 dB, RX Sensitivity: -85 dBm
Result: Link margin, coverage radius, reliability metrics
```

#### Cellular System Analysis

```javascript
// Advanced network planning example
Time per Carrier: 180 seconds, Number of Users: 1000
Average Calls per Day: 8, Base Station Power: 10 watts
Result: Maximum distance, cell size, traffic load, minimum carriers required
```

## 🧮 Mathematical Models

### Wireless System Calculations

- **Shannon's Theorem**: C = B × log₂(1 + S/N)
- **Compression Efficiency**: η = Rs × Rc
- **System Capacity**: Capacity calculations based on bandwidth and encoding

### OFDM Calculations

- **Symbol Duration**: Ts = N/Rs where N = number of subcarriers
- **Guard Interval**: Tg = G × Ts where G = guard ratio
- **Spectral Efficiency**: SE = (log₂M × R) / (1 + G) bits/s/Hz

### Link Budget Analysis

- **Received Power**: Pr = Pt + Gt + Gr - Lp - Lf (dB)
- **Link Margin**: LM = Pr - Sensitivity (dB)
- **Path Loss**: Various models (Free space, Hata, Cost-231)

### Cellular System Analysis

- **Maximum Distance Calculation**: d_max = √(P_base / (P_carrier × 10^(α×PL/10)))
- **Cell Size Estimation**: A_cell = π × d_max²
- **Traffic Load Analysis**: λ = (N_users × avg_calls_per_day × time_per_carrier) / (24 × 3600)
- **Erlang-B Formula**: For blocking probability and carrier requirements
- **Grade of Service**: GoS performance evaluation and optimization
- **System Efficiency**: Overall network capacity and resource utilization

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports**: Report issues or bugs
- 💡 **Feature Requests**: Suggest new calculators or features
- 📝 **Documentation**: Improve documentation and examples
- 🔧 **Code**: Submit pull requests with improvements
- 🎨 **Design**: Enhance UI/UX design

### Contribution Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and structure
- Add comments for complex calculations
- Test all calculator functions thoroughly
- Update documentation for new features

## 👥 Meet the Team

<table>
  <tr>
    <td align="center">
      <img src="assets/imgs/amr.jpg" width="100px;" alt="Amr Zedan"/><br />
      <sub><b>Amr Zedan</b></sub><br />
      <sub>Student ID: 1210239</sub><br />
      <sub>Computer Engineering</sub><br />
      <a href="https://github.com/amrzedan2003" title="GitHub">🔗</a>
      <a href="https://linkedin.com/in/amrzedan" title="LinkedIn">💼</a>
    </td>
    <td align="center">
      <img src="assets/imgs/moath.jpeg" width="100px;" alt="Moath Abd Albaqi"/><br />
      <sub><b>Moath Abd Albaqi</b></sub><br />
      <sub>Student ID: 1210125</sub><br />
      <sub>Computer Engineering</sub><br />
      <a href="https://github.com/SuperMoathx7" title="GitHub">🔗</a>
      <a href="https://linkedin.com/in/moath-abdalbaqi" title="LinkedIn">💼</a>
    </td>
  </tr>
</table>

## 🎓 Academic Context

**Institution**: Birzeit University  
**Faculty**: Engineering & Technology  
**Program**: Computer Engineering  
**Academic Year**: 4th Year, 2nd Semester, 2025  
**Course**: Wireless Communications Systems

## 🔮 Future Enhancements

### Planned Features

- [ ] **5G Calculator**: mmWave and sub-6GHz analysis
- [ ] **MIMO Calculator**: Multiple antenna system analysis
- [ ] **Interference Analysis**: Co-channel and adjacent channel interference
- [ ] **Advanced Propagation Models**: Hata, Cost-231, and other path loss models
- [ ] **Network Optimization**: AI-powered cellular network optimization
- [ ] **Export Features**: PDF reports and data export functionality
- [ ] **Mobile App**: React Native mobile version
- [ ] **Database Integration**: Save and compare calculation scenarios
- [ ] **Advanced AI**: Machine learning-based system recommendations
- [ ] **Real-time Monitoring**: Live network performance analysis

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Birzeit University** - For providing the academic foundation
- **Faculty Members** - For guidance and technical support
- **Open Source Community** - For the amazing tools and libraries
- **Tailwind CSS** - For the beautiful and responsive design system
- **Font Awesome** - For the comprehensive icon library

## 📞 Support & Contact

### Getting Help

- 📧 **Email**: [zezoamer2018@gmail.com](mailto:zezoamer2018@gmail.com)
- 💬 **GitHub Issues**: [Create an issue](https://github.com/SuperMoathx7/Wireless/issues)
- 📱 **LinkedIn**: Connect with the development team

---

<div align="center">

**Made with ❤️ for educational purposes**

[![Birzeit University](https://img.shields.io/badge/Birzeit-University-blue?style=flat-square)](https://birzeit.edu)
[![Computer Engineering](https://img.shields.io/badge/Computer-Engineering-green?style=flat-square)](#)
[![2025](https://img.shields.io/badge/Year-2025-orange?style=flat-square)](#)

</div>
