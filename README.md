# Pomodoro Timer Electron App

A sleek desktop Pomodoro timer application built with React, TypeScript, and Electron. Features a beautiful UI with animated GIFs, encouraging messages, and audio notifications.

## Features

- 🍅 **Pomodoro Technique**: 25-minute work sessions and 5-minute breaks
- 🎨 **Beautiful UI**: Dynamic backgrounds and animated GIFs
- 🔊 **Audio Notifications**: Cat meow sound when timer completes
- 💬 **Encouraging Messages**: Motivational text during work and break sessions
- 🖼️ **Custom Window Controls**: Frameless window with custom minimize/close buttons
- 🎯 **Always on Top**: Stays visible while you work

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd pomodoro-timer-app
```

### 2. Install Dependencies
```bash
# Install core dependencies
npm install

# Install Vite for development server
npm install vite

# Install React and TypeScript dependencies
npm install react react-dom typescript @types/react @types/react-dom

# Install Vite React plugin
npm install @vitejs/plugin-react

# Install Electron dependencies
npm install electron --save-dev
npm install electron-builder --save-dev

# Install additional development dependencies
npm install concurrently wait-on --save-dev
```

## Development

### Running in Development Mode
```bash
# Start the development server with Electron
npm run electron-dev
```

This command will:
1. Start the Vite development server
2. Wait for the server to be ready
3. Launch the Electron app

### Building for Production

#### 1. Build the React App
```bash
npm run build
```

#### 2. Build Electron Distribution
```bash
# Build for current platform
npm run dist

# Or use electron-builder directly with options
npx electron-builder
```

## File Structure

```
pomodoro-timer-app/
├── public/
│   ├── electron.cjs          # Main Electron process
│   ├── preload.js           # Preload script for IPC
│   └── app-icon.ico         # Application icon
├── src/
│   ├── assets/              # Images, GIFs, and audio files
│   ├── App.tsx              # Main React component
│   ├── App.css              # Styles
│   ├── main.tsx             # React entry point
│   ├── electron.d.ts        # Electron TypeScript definitions
│   └── custom.d.ts          # Custom module declarations
├── dist/                    # Built React app
├── dist-electron/           # Built Electron distributables
└── package.json
```

### Platform-Specific Builds
```bash
# All platforms
npx electron-builder --win --mac --linux
```

## Troubleshooting

### Common Issues

1. **Electron app won't start**: Make sure all dependencies are installed and the development server is running
2. **Audio not playing**: Check browser permissions and audio file paths
3. **Icons not showing**: Verify asset paths and file locations in the public folder
4. **Build fails**: Ensure TypeScript compilation passes with `npm run build`

### Development Tips

- Use `npm run electron-dev` for development with hot reload
- Check the Electron developer tools for debugging
- Verify all asset paths are correct for both development and production
- Test the built application before distributing

## License

This project is licensed under the MIT License - see the LICENSE file for details.
