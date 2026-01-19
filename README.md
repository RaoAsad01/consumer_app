# Hexallo Consumer App

A React Native consumer application built with Expo, featuring event discovery, booking, and location-based services.

## 📱 Features

- **Authentication**: OTP-based login system
- **Event Discovery**: Browse events, deals, and nearby activities
- **Location Services**: Map-based event discovery with Google Maps
- **Profile Management**: User profile creation and updates
- **Categories**: Explore 24+ event categories
- **Bookmarking**: Save favorite events
- **Bottom Navigation**: Tab-based navigation with sliding categories panel

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator
- Expo Go app on your phone (for preview builds)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd consumerapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit `app.json` and update the `extra` section:
   ```json
   "extra": {
     "API_BASE_URL": "https://d1-api.hexallo.com/",
     "GOOGLE_MAPS_API_KEY": "your-google-maps-api-key",
     "ENV": "development",
     "ENABLE_LOGGING": "true"
   }
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   Or for a specific platform:
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   ```

## 📁 Project Structure

```
consumerapp/
├── src/
│   ├── api/              # API service layer
│   │   └── apiService.js
│   ├── components/        # Reusable UI components
│   │   ├── Typography.js
│   │   ├── EventCard.js
│   │   ├── LoadingSpinner.js
│   │   └── ...
│   ├── config/           # Configuration files
│   │   └── env.js       # Environment variables
│   ├── context/         # React Context providers
│   │   └── AppContext.js
│   ├── navigation/      # Navigation configuration
│   │   └── navigation.js
│   ├── screens/         # Screen components
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── MyTabs.js
│   │   └── ...
│   ├── utils/           # Utility functions
│   │   ├── logger.js    # Logging utility
│   │   └── ...
│   └── color/           # Color constants
│       └── color.js
├── assets/              # Images, fonts, SVGs
├── app.json            # Expo configuration
├── eas.json            # EAS Build configuration
└── package.json        # Dependencies
```

## 🔧 Configuration

### Environment Variables

The app uses `expo-constants` for environment configuration. Set these in `app.json`:

- `API_BASE_URL`: Backend API base URL
- `GOOGLE_MAPS_API_KEY`: Google Maps API key (required for NearbyEventsScreen)
- `ENV`: Environment (`development` | `production`)
- `ENABLE_LOGGING`: Enable/disable logging (`true` | `false`)

### Google Maps Setup

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Maps SDK for Android" API
3. Add the key to `app.json` and `android/app/src/main/AndroidManifest.xml`

## 🏗️ Building

### Preview Build (Expo)

```bash
eas build --profile preview --platform android
```

### Production Build

```bash
eas build --profile production --platform android
```

## 📦 Key Dependencies

- **Expo SDK 52**: Core Expo framework
- **React Navigation 7**: Navigation library
- **React Native Reanimated 3**: Animations
- **React Native Gesture Handler**: Gesture support
- **React Native Maps**: Map functionality
- **Axios**: HTTP client
- **Formik + Yup**: Form handling and validation
- **Expo Secure Store**: Secure token storage

## 🧪 Testing

```bash
npm test
```

## 📝 Code Quality

- **Logging**: Use `logger` from `src/utils/logger.js` instead of `console.log`
- **Environment**: Use `ENV` from `src/config/env.js` for configuration
- **State Management**: Use `AppContext` for global state
- **Components**: Add PropTypes for type checking

## 🔐 Security

- Tokens stored in Expo SecureStore
- API keys configured via environment variables
- ProGuard enabled for Android release builds

## 🐛 Troubleshooting

### App crashes on NearbyEventsScreen
- Ensure Google Maps API key is configured
- Check ProGuard rules in `android/app/proguard-rules.pro`

### Build fails
- Clear cache: `npx expo start --clear`
- Rebuild: `npx expo prebuild --clean`

### Navigation bar color issues
- Check `navigation.js` for screen name mappings
- Verify `loggedInScreens` array includes all tab screens

## 📄 License

Private - All rights reserved

## 👥 Team

Hexallo Development Team

---

**Note**: This app is configured for Expo preview builds. For production builds, ensure all environment variables are properly set in `eas.json` build profiles.
