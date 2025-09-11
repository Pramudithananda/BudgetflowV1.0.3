const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Create HTML page with APK download instructions
const htmlContent = `
<!DOCTYPE html>
<html lang="si">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BudgetFlow APK Download</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 32px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 18px;
        }
        .app-icon {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #64a12d, #4a7d1f);
            border-radius: 20px;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: white;
        }
        .feature-list {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .feature-list h3 {
            color: #333;
            margin-bottom: 15px;
        }
        .feature-list ul {
            list-style: none;
        }
        .feature-list li {
            padding: 8px 0;
            color: #555;
        }
        .feature-list li:before {
            content: "✓ ";
            color: #64a12d;
            font-weight: bold;
            margin-right: 10px;
        }
        .download-section {
            background: #f0f8ff;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 20px;
            border: 2px solid #4a90e2;
        }
        .download-btn {
            background: linear-gradient(135deg, #64a12d, #4a7d1f);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            display: inline-block;
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
            transition: transform 0.3s;
            text-align: center;
            width: 100%;
        }
        .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(100, 161, 45, 0.3);
        }
        .method {
            margin: 20px 0;
            padding: 20px;
            background: #fff;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
        }
        .method h3 {
            color: #333;
            margin-bottom: 10px;
        }
        .method p {
            color: #666;
            line-height: 1.6;
        }
        .code {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
        }
        .status {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #999;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="app-icon">💰</div>
        <h1>BudgetFlow</h1>
        <p class="subtitle">Event Planning & Budget Management App</p>
        
        <div class="status">
            ✅ <strong>SQLite Database Configured</strong><br>
            ✅ <strong>Firebase Removed</strong><br>
            ✅ <strong>Ready for APK Build</strong>
        </div>

        <div class="feature-list">
            <h3>📱 App Features</h3>
            <ul>
                <li>Event Management</li>
                <li>Expense Tracking</li>
                <li>Budget Monitoring</li>
                <li>SQLite Local Database</li>
                <li>Offline Support</li>
                <li>Data Export/Import</li>
                <li>Multi-language Support</li>
            </ul>
        </div>

        <div class="download-section">
            <h2>📥 APK Download කරන්න</h2>
            
            <div class="method">
                <h3>🚀 Method 1: Quick Test (Expo Go)</h3>
                <p>1. Install Expo Go from Play Store</p>
                <p>2. Terminal එකේ run කරන්න:</p>
                <div class="code">npx expo start --tunnel</div>
                <p>3. QR code scan කරන්න</p>
            </div>

            <div class="method">
                <h3>☁️ Method 2: Cloud Build (EAS)</h3>
                <a href="https://expo.dev/signup" target="_blank" class="download-btn">
                    Create Expo Account (Free)
                </a>
                <p>Terminal commands:</p>
                <div class="code">npx eas login<br>npx eas build --platform android --profile production</div>
            </div>

            <div class="method">
                <h3>🌐 Method 3: Online APK Builder</h3>
                <a href="https://www.webintoapp.com/store/expo-apk-ipa-app-builder" target="_blank" class="download-btn">
                    Open WebIntoApp Builder
                </a>
                <p>Upload the project ZIP file and get APK instantly!</p>
                <a href="/BudgetFlow-SQLite.zip" class="download-btn" style="background: linear-gradient(135deg, #4a90e2, #357abd);">
                    📦 Download Project ZIP (243KB)
                </a>
            </div>

            <div class="method">
                <h3>📲 Method 4: Appetize.io (Online Emulator)</h3>
                <a href="https://appetize.io/upload" target="_blank" class="download-btn" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24);">
                    Test on Appetize.io
                </a>
                <p>Upload ZIP and test online without downloading!</p>
            </div>
        </div>

        <div class="warning">
            <strong>⚠️ සටහන:</strong> Production APK එකක් build කිරීමට විනාඩි 10-15ක් ගතවේ. 
            Expo Go භාවිතයෙන් වහාම test කළ හැක.
        </div>

        <div class="footer">
            <p>BudgetFlow v1.0.3 | SQLite Edition</p>
            <p>© 2024 - Built with React Native & Expo</p>
        </div>
    </div>
</body>
</html>
`;

// Serve the HTML page
app.get('/', (req, res) => {
    res.send(htmlContent);
});

// Serve the ZIP file
app.get('/BudgetFlow-SQLite.zip', (req, res) => {
    const zipPath = path.join(__dirname, 'BudgetFlow-SQLite.zip');
    if (fs.existsSync(zipPath)) {
        res.download(zipPath);
    } else {
        res.status(404).send('ZIP file not found. Please build it first.');
    }
});

// API endpoint to trigger build
app.get('/api/build-status', async (req, res) => {
    try {
        const zipExists = fs.existsSync(path.join(__dirname, 'BudgetFlow-SQLite.zip'));
        res.json({
            status: 'ready',
            zipAvailable: zipExists,
            message: 'Project is ready for APK build',
            instructions: {
                expo: 'Use Expo Go app for instant testing',
                eas: 'Use EAS Build for production APK',
                online: 'Use WebIntoApp for quick APK generation'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(\`
    ================================================
    🚀 BudgetFlow APK Download Server Started!
    ================================================
    
    📱 Access the download page at:
    http://localhost:\${PORT}
    
    Available endpoints:
    - / : Main download page
    - /BudgetFlow-SQLite.zip : Download project ZIP
    - /api/build-status : Check build status
    
    ================================================
    \`);
});