# SeaBoo iOS App Setup Guide

## Overview
Your SeaBoo iOS app is now ready for development and deployment. The iOS platform has been successfully added and synced with the latest web assets.

## Prerequisites for Mac Development

### 1. Install Xcode
- Download Xcode from the Mac App Store
- Ensure you have the latest version (Xcode 15+ recommended)
- Install Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

### 2. Install CocoaPods
```bash
sudo gem install cocoapods
```

### 3. Install iOS Dependencies
Navigate to your project directory and run:
```bash
cd ios
pod install
```

## Opening the Project on Your Mac

1. **Download the Project**
   - Download the entire project folder to your Mac
   - Or use git to clone the repository

2. **Navigate to iOS Directory**
   ```bash
   cd ios
   ```

3. **Open in Xcode**
   - Look for `App.xcworkspace` file (preferred) or `App.xcodeproj`
   - Double-click to open in Xcode
   - Or use command line:
     ```bash
     open App.xcworkspace
     ```

## Current Configuration

### App Details
- **App ID**: it.seaboo.app
- **App Name**: SeaBoo
- **Bundle ID**: it.seaboo.app
- **Web Assets**: Synced from `dist/public`

### Capacitor Configuration
```typescript
{
  appId: 'it.seaboo.app',
  appName: 'SeaBoo',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'automatic'
  }
}
```

## Development Workflow

### 1. Make Web Changes
```bash
# In project root
npm run dev          # Development server
npm run build        # Production build
```

### 2. Sync Changes to iOS
```bash
npx cap sync ios
```

### 3. Open in Xcode
```bash
npx cap open ios
```

## Building and Testing

### 1. Simulator Testing
- Select a simulator device in Xcode
- Press ⌘+R to build and run

### 2. Device Testing
- Connect your iPhone/iPad via USB
- Select your device in Xcode
- Press ⌘+R to build and install

### 3. Production Build
- Archive in Xcode: Product → Archive
- Upload to App Store Connect

## Troubleshooting

### Common Issues

1. **CocoaPods not installed**
   ```bash
   sudo gem install cocoapods
   pod install
   ```

2. **Build errors**
   ```bash
   npx cap sync ios
   cd ios && pod install
   ```

3. **Web assets not updating**
   ```bash
   npm run build
   npx cap sync ios
   ```

### File Structure
```
ios/
├── App/
│   ├── App/
│   │   ├── AppDelegate.swift
│   │   ├── Info.plist
│   │   ├── capacitor.config.json
│   │   └── public/ (your web assets)
│   ├── App.xcodeproj
│   └── App.xcworkspace (use this)
└── capacitor-cordova-ios-plugins/
```

## Next Steps

1. **On your Mac:**
   ```bash
   cd /path/to/seaboo-project
   cd ios
   pod install
   open App.xcworkspace
   ```

2. **Configure signing in Xcode:**
   - Select your development team
   - Configure bundle identifier if needed
   - Set up provisioning profiles

3. **Test the app:**
   - Run on simulator first
   - Then test on physical device

## App Store Deployment

When ready for App Store:
1. Update version in `Info.plist`
2. Create app icons (various sizes needed)
3. Configure app metadata in App Store Connect
4. Archive and upload through Xcode

The iOS app is now properly configured and ready for development on your Mac!