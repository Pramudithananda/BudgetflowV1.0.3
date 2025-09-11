# 💰 BudgetFlow

> A modern and intuitive budget management application to track your expenses and manage your finances effectively.

[![Made with React Native](https://img.shields.io/badge/Made%20with-React%20Native-61DAFB.svg)](https://reactnative.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](https://github.com/yourusername/budgetflow)

## 📱 Screenshots

<div align="center">
  <img src="https://github.com/Pramudithananda/BudgetFlow/blob/main_budget/Screenshot_2025-08-18-13-29-16-802_com.budgetflow.app.jpg" alt="Dashboard" width="250" style="margin: 10px;">
  <img src="https://github.com/Pramudithananda/BudgetFlow/blob/main_budget/Screenshot_2025-08-18-13-29-23-268_com.budgetflow.app.jpg" alt="Categories" width="250" style="margin: 10px;">
  <img src="https://github.com/Pramudithananda/BudgetFlow/blob/main_budget/Screenshot_2025-08-18-13-30-14-440_com.budgetflow.app.jpg" alt="BudgetFlow Overview" width="250" style="margin: 10px;">
</div>

## ✨ Features

### 🎯 Core Features
- **Real-time Budget Tracking** - Monitor your total budget and spending in real-time
- **Expense Categories** - Organize expenses into customizable categories
- **Status Management** - Track Outstanding, Pending, Available, and Spent amounts
- **Progress Visualization** - Visual progress bars and status indicators
- **Report Generation** - Download detailed financial reports

### 📊 Dashboard Overview
- **Total Budget Display** - Rs. 193,300 with visual progress indicator
- **Received vs Remaining** - Clear breakdown of received (Rs. 110,800) and remaining (Rs. 82,500) amounts
- **Expense Status Cards** - Quick view of all financial statuses:
  - 🔴 Outstanding: Rs. 32,500
  - 🟡 Pending: Rs. 50,000
  - 🔵 Available: Rs. 85,000
  - 🟢 Spent: Rs. 25,800

### 📂 Category Management
- **Custom Categories** - Create and manage expense categories
- **Expense Tracking** - Track number of expenses per category
- **Amount Overview** - View total amount spent in each category
- **Categories Available**:
  - Cat 2: Rs. 65,000 (1 expense)
  - Cat3: Rs. 0 (0 expenses)
  - Test: Rs. 128,300 (4 expenses)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/budgetflow.git
   cd budgetflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the application**
   
   For Android:
   ```bash
   npx react-native run-android
   ```
   
   For iOS:
   ```bash
   npx react-native run-ios
   ```

## 🏗️ Architecture

### Project Structure
```
budgetflow/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   │   ├── Dashboard.js    # Main dashboard
│   │   ├── Categories.js   # Category management
│   │   └── BudgetFlow.js   # Budget overview
│   ├── navigation/         # Navigation configuration
│   ├── services/          # API and data services
│   ├── utils/             # Helper functions
│   └── styles/            # Styling files
├── assets/                # Images, fonts, etc.
└── android/               # Android specific files
```

### Tech Stack
- **Frontend**: React Native
- **Navigation**: React Navigation
- **State Management**: React Context/Redux
- **UI Components**: Custom components with modern design
- **Icons**: React Native Vector Icons
- **Charts**: React Native Chart Kit

## 🎨 Design System

### Color Palette
- **Primary Green**: `#7CB342` - Main app color
- **Success Green**: `#4CAF50` - Positive indicators
- **Warning Orange**: `#FF9800` - Pending status
- **Error Red**: `#F44336` - Outstanding amounts
- **Info Blue**: `#2196F3` - Available funds
- **Background**: `#F5F5F5` - App background

### Typography
- **Headers**: Bold, large fonts for main titles
- **Body Text**: Regular weight for content
- **Numbers**: Emphasized styling for monetary values

## 📱 App Navigation

The app features a bottom tab navigation with 5 main sections:

1. **🏠 BudgetFlow** - Main overview screen
2. **📊 Categories** - Expense category management
3. **👥 Funders** - Funding source management
4. **📈 Dashboard** - Detailed analytics and reports
5. **⚙️ Settings** - App configuration

## 💡 Usage

### Adding a New Category
1. Navigate to the Categories screen
2. Tap the "Add Category" button
3. Enter category name and initial budget
4. Save to create the new category

### Tracking Expenses
1. Select the appropriate category
2. Enter expense details
3. Choose expense status (Outstanding, Pending, etc.)
4. Save the expense

### Generating Reports
1. Go to the Dashboard
2. Click "Download Report" button
3. Choose report format and date range
4. Download or share the report

## 🤝 Contributing

We welcome contributions to BudgetFlow! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow React Native best practices
- Write clean, documented code
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please create an issue on our [GitHub Issues](https://github.com/pramudithananda/budgetflow/issues) page.

**Bug Report Template:**
- Device/Platform information
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@Ranjith](https://github.com/Pramudithanand)
- Email: ranjithpalugolla@gmail.com
- LinkedIn: [RANJITH](https://www.linkedin.com/in/ranjith-karunarathne-941a01367?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Material Design for UI inspiration
- Contributors and testers who helped improve the app

## 📊 Statistics

![GitHub stars](https://img.shields.io/github/stars/yourusername/budgetflow?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/budgetflow?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/budgetflow)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/budgetflow)

---

<div align="center">
  <strong>Made with ❤️ for better financial management</strong>
  <br>
  <sub>BudgetFlow - Take control of your finances</sub>
</div>
