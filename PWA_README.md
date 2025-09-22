# PWA (Progressive Web App) Setup

This document outlines the PWA features implemented in the Tribly Admin Dashboard.

## Features Implemented

### 1. App Manifest
- **File**: `public/manifest.json`
- **Status Bar Color**: `#f6f6f6`
- **Theme Color**: `#f6f6f6`
- **Display Mode**: Standalone
- **Icons**: Multiple sizes (72x72 to 512x512)

### 2. Service Worker
- **File**: `public/sw.js`
- **Features**:
  - Offline caching
  - Background sync
  - Push notifications
  - Cache management

### 3. App Icons
- **Source**: `public/icon.svg` (provided SVG)
- **Generated Sizes**: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- **Format**: PNG with maskable support

### 4. PWA Installer Component
- **File**: `src/components/PWAInstaller.tsx`
- **Features**:
  - Automatic install prompt
  - Installation status detection
  - User-friendly install interface

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate app icons:
   ```bash
   npm run generate-icons
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## PWA Testing

### Desktop (Chrome/Edge)
1. Open the app in Chrome or Edge
2. Look for the install button in the address bar
3. Click "Install" to add to desktop
4. Test offline functionality

### Mobile (Android)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. Confirm installation

### Mobile (iOS)
1. Open the app in Safari
2. Tap the share button
3. Select "Add to Home Screen"
4. Confirm installation

## PWA Features

### Offline Support
- Cached pages work offline
- Service worker handles network requests
- Graceful degradation when offline

### App-like Experience
- Standalone display mode
- Custom status bar color
- App shortcuts for quick access
- Responsive design for all devices

### Performance
- Optimized caching strategy
- Fast loading times
- Reduced data usage

## Configuration

### Status Bar Color
The status bar color is set to `#f6f6f6` in:
- `public/manifest.json` (theme_color, background_color)
- `src/app/layout.tsx` (metadata.themeColor)

### Icons
Icons are generated from `public/icon.svg` using Sharp:
- Multiple sizes for different devices
- Maskable icons for adaptive theming
- Optimized PNG format

### Service Worker
The service worker (`public/sw.js`) provides:
- Cache-first strategy for static assets
- Network-first strategy for API calls
- Background sync for offline actions
- Push notification support

## Troubleshooting

### Icons Not Showing
1. Ensure icons are generated: `npm run generate-icons`
2. Check that icons exist in `public/icons/`
3. Verify manifest.json references correct paths

### Install Prompt Not Appearing
1. Check browser compatibility (Chrome/Edge recommended)
2. Ensure HTTPS (required for PWA)
3. Verify manifest.json is valid
4. Check service worker registration

### Offline Not Working
1. Verify service worker is registered
2. Check browser developer tools > Application > Service Workers
3. Ensure cache is populated
4. Test network throttling in dev tools

## Browser Support

- **Chrome**: Full support
- **Edge**: Full support  
- **Firefox**: Partial support
- **Safari**: Partial support (iOS 11.3+)
- **Mobile Chrome**: Full support
- **Mobile Safari**: Partial support

## Security Considerations

- HTTPS required for PWA features
- Service worker scope is limited to app domain
- Cache is cleared when app is uninstalled
- No sensitive data stored in cache

## Performance Monitoring

Monitor PWA performance using:
- Lighthouse audits
- Chrome DevTools > Application tab
- Web Vitals metrics
- Service worker logs

## Future Enhancements

- Background sync for form submissions
- Push notifications for real-time updates
- Advanced caching strategies
- Offline data synchronization
- App shortcuts for common actions
