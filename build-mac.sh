#!/bin/bash

echo "🚀 Building Easy Photo Picker for macOS..."

# Install dependencies if needed
if [ ! -d "node_modules/electron-builder" ]; then
    echo "📦 Installing electron-builder..."
    npm install --save-dev electron-builder@24.9.1
fi

# Build the frontend
echo "🔨 Building frontend..."
npm run build

# Package the app
echo "📦 Creating macOS installer..."
npx electron-builder --mac

echo "✅ Done! Your installer is in the 'installable' folder"
echo "📁 Look for: Easy Photo Picker-1.0.0.dmg or Easy Photo Picker-1.0.0-arm64.dmg"
