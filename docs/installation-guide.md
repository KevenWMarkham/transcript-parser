# Transcript Parser - Complete Installation Guide

## Overview

This guide provides step-by-step instructions for setting up a fresh machine to download, build, and run the Transcript Parser project from GitHub. Follow these instructions in order to ensure a successful setup.

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Install Prerequisites](#install-prerequisites)
3. [Clone the Repository](#clone-the-repository)
4. [Project Setup](#project-setup)
5. [Configure Environment](#configure-environment)
6. [Build the Application](#build-the-application)
7. [Run the Application](#run-the-application)
8. [Verify Installation](#verify-installation)
9. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10+, macOS 10.13+, or Ubuntu 18.04+
- **RAM**: 4GB (8GB recommended)
- **Disk Space**: 2GB free space (for tools, dependencies, and project)
- **Internet Connection**: Required for downloading dependencies and API calls

### Recommended

- **RAM**: 8GB+ for building and running Electron apps
- **CPU**: Multi-core processor for faster builds
- **SSD**: For better performance during development

---

## Install Prerequisites

### Step 1: Install Node.js

Node.js is required to run the application and manage dependencies.

#### Windows

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version (currently v18 or higher)
3. Run the installer (`node-vXX.X.X-x64.msi`)
4. Follow the installation wizard:
   - Accept the license agreement
   - Choose installation path (default: `C:\Program Files\nodejs\`)
   - **IMPORTANT**: Check the box that says "Automatically install necessary tools" (installs Python and Visual Studio Build Tools)
5. Click "Install" and wait for completion
6. Restart your computer

#### macOS

**Option 1: Using Official Installer**

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS** version for macOS
3. Run the `.pkg` installer and follow the prompts

**Option 2: Using Homebrew** (recommended if you have Homebrew)

```bash
brew install node
```

#### Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt update

# Install Node.js LTS using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Verify Node.js Installation

Open a terminal/command prompt and run:

```bash
node --version
# Should output: v18.X.X or higher

npm --version
# Should output: 9.X.X or higher
```

---

### Step 2: Install Git

Git is required to clone the repository from GitHub.

#### Windows

1. Visit [git-scm.com](https://git-scm.com/download/win)
2. Download the latest version for Windows
3. Run the installer (`Git-X.XX.X-64-bit.exe`)
4. Follow the installation wizard with these recommended settings:
   - **Select Components**: Keep defaults (Git Bash, Git GUI)
   - **Default Editor**: Choose your preferred editor (VS Code recommended)
   - **Adjusting PATH**: Select "Git from the command line and also from 3rd-party software"
   - **Line Ending**: Select "Checkout Windows-style, commit Unix-style"
   - **Terminal Emulator**: Use MinTTY (default)
   - **Git Pull Behavior**: Default (fast-forward or merge)
5. Click "Install" and wait for completion

#### macOS

**Option 1: Using Official Installer**

1. Visit [git-scm.com](https://git-scm.com/download/mac)
2. Download and run the installer

**Option 2: Using Homebrew** (recommended)

```bash
brew install git
```

**Option 3: Using Xcode Command Line Tools**

```bash
xcode-select --install
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git -y
```

#### Verify Git Installation

```bash
git --version
# Should output: git version 2.XX.X or higher
```

#### Configure Git (First Time Setup)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### Step 3: Install a Code Editor (Optional but Recommended)

#### Visual Studio Code (Recommended)

1. Visit [code.visualstudio.com](https://code.visualstudio.com/)
2. Download the installer for your operating system
3. Run the installer:
   - **Windows**: Run the `.exe` installer
   - **macOS**: Drag VS Code to Applications folder
   - **Linux**: Use `.deb` or `.rpm` package, or Snap

**Recommended VS Code Extensions**:

- ESLint (dbaeumer.vscode-eslint)
- Prettier - Code formatter (esbenp.prettier-vscode)
- TypeScript Vue Plugin (Vue.vscode-typescript-vue-plugin)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

#### Alternative Editors

- **JetBrains WebStorm**: [jetbrains.com/webstorm](https://www.jetbrains.com/webstorm/)
- **Sublime Text**: [sublimetext.com](https://www.sublimetext.com/)
- **Atom**: [atom.io](https://atom.io/)

---

### Step 4: Install Python (Windows Only - for native dependencies)

Some npm packages require Python for building native modules.

#### Windows

1. Visit [python.org](https://www.python.org/downloads/)
2. Download Python 3.11 or higher
3. Run the installer
4. **IMPORTANT**: Check the box "Add Python to PATH"
5. Click "Install Now"

Verify:

```bash
python --version
# Should output: Python 3.11.X or higher
```

**Note**: If you installed Node.js with "Automatically install necessary tools" checked, Python should already be installed.

#### macOS/Linux

Python usually comes pre-installed. Verify:

```bash
python3 --version
```

---

## Clone the Repository

### Step 1: Choose a Project Directory

Decide where you want to store the project. For example:

- **Windows**: `C:\code\` or `C:\Users\YourName\Projects\`
- **macOS/Linux**: `~/code/` or `~/Projects/`

### Step 2: Open Terminal/Command Prompt

- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **macOS**: Press `Cmd + Space`, type `Terminal`, press Enter
- **Linux**: Press `Ctrl + Alt + T`

### Step 3: Navigate to Your Project Directory

```bash
# Windows
cd C:\code

# macOS/Linux
cd ~/code
```

If the directory doesn't exist, create it:

```bash
# Windows
mkdir C:\code
cd C:\code

# macOS/Linux
mkdir ~/code
cd ~/code
```

### Step 4: Clone the Repository

```bash
git clone https://github.com/KevenWMarkham/transcript-parser.git
```

This will create a `transcript-parser` folder with all project files.

### Step 5: Navigate into the Project

```bash
cd transcript-parser
```

---

## Project Setup

### Step 1: Install Project Dependencies

Run the following command to install all required npm packages:

```bash
npm install
```

**What this does**:

- Downloads all dependencies listed in [package.json](../package.json)
- Installs both production and development dependencies
- Sets up Husky git hooks automatically
- May take 2-5 minutes depending on your internet speed

**Expected output**:

```
added XXX packages in XXs
```

### Step 2: Install Playwright Browsers (for End-to-End Testing)

```bash
npx playwright install
```

**What this does**:

- Downloads Chromium, Firefox, and WebKit browsers for testing
- Required for running E2E tests
- Takes about 200-300MB of disk space

---

## Configure Environment

### Step 1: Obtain Google Gemini API Key

The application requires a Google Gemini API key for transcription functionality.

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key (starts with `AIza...`)

**Important**: Keep this key secure and never commit it to git.

### Step 2: Create Environment File

In the project root directory (`transcript-parser`), create a new file named `.env`:

#### Windows (Command Prompt)

```bash
type nul > .env
notepad .env
```

#### Windows (PowerShell)

```powershell
New-Item -Path .env -ItemType File
notepad .env
```

#### macOS/Linux

```bash
touch .env
nano .env
```

### Step 3: Add API Key to .env File

Paste the following into the `.env` file:

```bash
# Google Gemini API Key (Required for transcription)
VITE_GEMINI_API_KEY=your_api_key_here

# Optional: Database configuration (for future features)
# DATABASE_URL=postgresql://user:password@localhost:5432/transcript_db
```

Replace `your_api_key_here` with your actual API key.

**Example**:

```bash
VITE_GEMINI_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Save and close the file:

- **Notepad**: File → Save, then close
- **Nano**: Press `Ctrl + O`, then `Enter` to save, `Ctrl + X` to exit

### Step 4: Verify .env File

Check that the file was created correctly:

```bash
# Windows
type .env

# macOS/Linux
cat .env
```

You should see your API key displayed.

---

## Build the Application

### Step 1: Build for Development (Quick Test)

To verify everything is set up correctly, run the development server:

```bash
npm run dev
```

**Expected output**:

```
VITE vX.X.X  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**What this does**:

- Starts the Vite development server
- Enables Hot Module Replacement (HMR) for live updates
- Opens the app at `http://localhost:5173`

Open a web browser and visit `http://localhost:5173` to see the app running.

Press `Ctrl + C` in the terminal to stop the server.

### Step 2: Build for Production

To create an optimized production build:

```bash
npm run build
```

**Expected output**:

```
vite v6.0.5 building for production...
✓ XXX modules transformed.
dist/index.html                   X.XX kB │ gzip: X.XX kB
dist/assets/index-XXXXX.js      XXX.XX kB │ gzip: XXX.XX kB
✓ built in XXXs
```

**What this does**:

- Runs TypeScript compiler to check for type errors
- Creates optimized production bundle in `dist/` folder
- Minifies JavaScript and CSS
- Ready for deployment or Electron packaging

### Step 3: Build Electron Application (Desktop App)

To build the desktop application:

#### Windows

```bash
npm run electron:build:win
```

**Expected output**:

```
• electron-builder  version=XX.X.XX
• loaded configuration  file=package.json ("build" field)
• building        target=nsis file=dist\Transcript Parser Setup X.X.X.exe
• building block map  blockMapFile=dist\Transcript Parser Setup X.X.X.exe.blockmap
```

The installer will be created in the `dist/` folder:

- `Transcript Parser Setup X.X.X.exe` - Installer
- `Transcript Parser X.X.X.exe` - Portable version

#### macOS

```bash
npm run electron:build:mac
```

Output: `.dmg` file in `dist/` folder

#### Linux

```bash
npm run electron:build:linux
```

Output: `.AppImage` or `.deb` file in `dist/` folder

**Build Time**: First build may take 5-10 minutes. Subsequent builds are faster.

---

## Run the Application

### Option 1: Development Mode (Web Browser)

Best for development and testing:

```bash
npm run dev
```

Open browser to `http://localhost:5173`

**Features**:

- Hot reload on file changes
- Source maps for debugging
- Fast refresh

### Option 2: Electron Development Mode (Desktop App)

Run the app as a desktop application during development:

```bash
npm run electron:dev
```

**What this does**:

- Starts Vite dev server
- Waits for server to be ready
- Launches Electron app pointing to dev server

**Features**:

- Desktop app experience
- DevTools available (`Ctrl+Shift+I`)
- Live reload on changes

### Option 3: Production Build (Web)

Preview the production build locally:

```bash
npm run preview
```

Opens at `http://localhost:4173` (or next available port)

### Option 4: Installed Electron App

After building with `npm run electron:build:win`, run the installer:

**Windows**:

1. Navigate to `dist/` folder
2. Run `Transcript Parser Setup X.X.X.exe`
3. Follow installation wizard
4. Launch from Start Menu

**macOS**:

1. Open the `.dmg` file
2. Drag app to Applications
3. Launch from Applications

**Linux**:

```bash
# AppImage
chmod +x dist/Transcript\ Parser-X.X.X.AppImage
./dist/Transcript\ Parser-X.X.X.AppImage

# .deb package
sudo dpkg -i dist/transcript-parser_X.X.X_amd64.deb
```

---

## Verify Installation

### Test 1: Check Development Server

```bash
npm run dev
```

✅ Success: Browser opens to `http://localhost:5173` and shows the app

### Test 2: Load Demo Transcript

1. In the running app, click **"🎬 Load Sprint 4 Demo (60 Entries)"** button
2. Verify:
   - ✅ 60 transcript entries load
   - ✅ Speaker summary panel shows 3 speakers
   - ✅ Smooth scrolling works
   - ✅ Color-coded speaker badges appear

### Test 3: Run Tests

```bash
npm test
```

✅ Success: All tests pass without errors

### Test 4: Run Linter

```bash
npm run lint
```

✅ Success: No linting errors

### Test 5: Test Transcription (Requires API Key)

1. Click "Choose Video File" or drag a video file (MP4, MOV, etc.)
2. Wait for video to load
3. Click "Start Transcription"
4. Verify:
   - ✅ Processing status updates
   - ✅ Transcript entries appear
   - ✅ Speaker diarization works
   - ✅ No API errors

**Note**: This test consumes API tokens and incurs small costs.

---

## Troubleshooting

### Issue 1: npm install fails with "EACCES" permission error

**Solution (macOS/Linux)**:

```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
npm install
```

**Solution (Windows)**:
Run Command Prompt as Administrator, then retry `npm install`.

---

### Issue 2: "node-gyp" or "python" errors during npm install

**Windows Solution**:

```bash
npm install --global windows-build-tools
```

**macOS Solution**:

```bash
xcode-select --install
```

**Linux Solution**:

```bash
sudo apt-get install build-essential
```

---

### Issue 3: Port 5173 already in use

**Solution**: Kill the process using the port or use a different port:

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

Or specify a different port:

```bash
npm run dev -- --port 3000
```

---

### Issue 4: API Key not working

**Possible causes**:

1. API key is incorrect
2. Gemini API not enabled in Google Cloud
3. Billing not set up on Google Cloud

**Solution**:

1. Verify API key in `.env` file
2. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Regenerate API key
4. Ensure billing is enabled in Google Cloud Console

---

### Issue 5: Electron build fails

**Windows - Missing Visual Studio Build Tools**:

```bash
npm install --global windows-build-tools
```

**macOS - Code signing issues**:
Add to `package.json` → `build` section:

```json
"mac": {
  "identity": null
}
```

**Linux - Missing dependencies**:

```bash
sudo apt-get install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0
```

---

### Issue 6: TypeScript errors during build

**Solution**:

```bash
# Clean build cache
rm -rf dist
rm -rf node_modules/.vite

# Rebuild
npm run build
```

---

### Issue 7: Git hooks not running

**Solution**:

```bash
# Reinstall Husky
npm run prepare

# Check hook permissions (macOS/Linux)
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

---

### Issue 8: Out of memory during build

**Solution**: Increase Node.js memory limit:

```bash
# Windows (PowerShell)
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# macOS/Linux
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## Next Steps

### For Development

1. Read the [README](../README.md) for detailed development guide
2. Explore the demo mode to understand features
3. Review code in `src/` directory
4. Check [manual.html](manual.html) for user documentation

### For Contributing

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make changes and commit: `npm run commit`
3. Push to GitHub: `git push origin feature/your-feature-name`
4. Create a Pull Request

### For Building Releases

1. Update version in [package.json](../package.json)
2. Build for all platforms:
   ```bash
   npm run electron:build:win
   npm run electron:build:mac
   npm run electron:build:linux
   ```
3. Upload installers to GitHub Releases

---

## Additional Resources

### Documentation

- [User Manual](manual.html) - Complete user guide
- [Development Guide](../dev.md) - Detailed development documentation
- [GitHub Repository](https://github.com/KevenWMarkham/transcript-parser) - Source code

### External Documentation

- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Support

- **GitHub Issues**: [Report bugs](https://github.com/KevenWMarkham/transcript-parser/issues)
- **Email**: Contact developer at keven@example.com

---

## Summary Checklist

Before you start development, ensure you have completed:

- ✅ Installed Node.js (v18+)
- ✅ Installed Git
- ✅ Installed a code editor (VS Code recommended)
- ✅ Cloned the repository from GitHub
- ✅ Ran `npm install` successfully
- ✅ Created `.env` file with Google Gemini API key
- ✅ Ran `npm run dev` and verified app loads
- ✅ Loaded demo transcript successfully
- ✅ Ran tests with `npm test`

---

## Quick Reference Commands

```bash
# Clone repository
git clone https://github.com/KevenWMarkham/transcript-parser.git
cd transcript-parser

# Install dependencies
npm install

# Configure environment
# Create .env file and add: VITE_GEMINI_API_KEY=your_key

# Development
npm run dev                    # Start dev server (web)
npm run electron:dev           # Start Electron dev mode

# Build
npm run build                  # Production build (web)
npm run electron:build:win     # Build Windows installer
npm run electron:build:mac     # Build macOS app
npm run electron:build:linux   # Build Linux app

# Testing
npm test                       # Run unit tests
npm run test:watch             # Run tests in watch mode
npm run test:e2e               # Run E2E tests

# Code Quality
npm run lint                   # Check for linting errors
npm run lint:fix               # Auto-fix linting errors
npm run format                 # Format code with Prettier

# Git
npm run commit                 # Interactive commit (recommended)
git commit -m "type: message"  # Manual commit
```

---

_Last Updated: December 19, 2024 • Version 1.0.0_
