# MahsaNet Alert Proejct

Live Site: https://alert.mahsanet.com

# Mahsa Alert

A real-time alert system for Iran showing missile strikes, nuclear facilities, and evacuation areas.

## Features

- **Real-time Map**: Interactive map showing missile strikes, nuclear facilities, and evacuation areas
- **Layer Filtering**: Toggle visibility of different map layers
- **User Location**: Get your current location and proximity alerts
- **Evacuation Areas**: Navigate through evacuation areas with the EvacSlider component
- **Push Notifications**: Real-time push notifications for important alerts and updates
- **Responsive Design**: Works on both desktop and mobile devices
- **Dark/Light Theme**: Toggle between dark and light themes
- **PWA Support**: Progressive Web App with offline capabilities

## Push Notifications

The app includes a comprehensive push notification system that works both in the foreground and background:

### Features
- **Foreground Notifications**: Beautiful toast notifications when the app is open
- **Background Notifications**: Native system notifications when the app is closed
- **Permission Management**: User-friendly permission prompts
- **Notification Actions**: Click to view details or dismiss notifications
- **Test Functionality**: Test button in the header to demonstrate notifications

### Components
- **NotificationToast**: Individual notification display with animations
- **NotificationManager**: Manages multiple notifications in a stack
- **NotificationPermission**: Prompts users to enable notifications

### Service Worker
The `firebase-messaging-sw.js` handles background notifications with:
- Firebase Cloud Messaging integration
- Custom notification actions (View Details, Dismiss)
- Proper app focus/opening behavior
- Fallback support for older browsers

### Usage
1. Users will see a permission prompt after 3 seconds
2. Once enabled, notifications appear as toast messages in the foreground
3. Background notifications show as native system notifications
4. Click the bell icon in the header to test notifications

## Components

### EvacSlider

The EvacSlider component uses shadcn's Drawer component to provide an elegant interface for navigating evacuation areas. It features:

- **Drawer Interface**: Modern bottom drawer that slides up from the bottom of the screen
- **Trigger Row**: A compact trigger button positioned at the bottom of the page
  - **Desktop**: Centered with appropriate spacing from the bottom
  - **Mobile**: Full-width trigger for better touch interaction
- **Arrow Navigation**: Left and right arrow buttons surrounding the evacuation date
- **Date Display**: Shows the evacuation date in Persian format between the navigation arrows
- **Slider Control**: Fine-grained control with a range slider below the date
- **Area Counter**: Shows current area position (e.g., "1 از 2" - 1 of 2)
- **Auto-zoom**: Automatically zooms to the selected evacuation area on the map
- **Smooth Animations**: Native drawer animations with backdrop blur

The component automatically extracts evacuation areas from the GeoJSON data, sorts them by date (newest first), and provides an intuitive interface for exploring the evacuation zones with a modern drawer UI.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── EvacSlider.tsx          # Evacuation area navigation with drawer interface
│   ├── MapComponent.tsx        # Main map component
│   ├── LayerFilter.tsx         # Layer visibility controls
│   ├── NotificationToast.tsx   # Individual notification display
│   ├── NotificationManager.tsx # Notification stack management
│   ├── NotificationPermission.tsx # Permission prompt
│   └── ...
├── ui/
│   ├── drawer.tsx              # shadcn drawer component
│   └── theme-provider.tsx      # Theme provider
├── map-entities/
│   ├── borders/                # Border and evacuation area data
│   ├── layers/                 # Map layer configurations
│   └── user-location/          # User location handling
├── utils/
│   └── notifications.ts        # Notification utilities
└── ...
public/
├── firebase-messaging-sw.js    # Service worker for push notifications
└── ...
```
