# SeaBoo Mobile - React Native App

React Native mobile application for SeaBoo boat rental platform with full iOS/Android native functionality.

## Features

### 🚀 Core Functionality
- **Native iOS/Android App** with React Navigation
- **Cross-platform compatibility** with Expo
- **Real-time boat search** with location-based filtering
- **Interactive maps** with boat markers and user location
- **Complete booking system** with offline support
- **Real-time messaging** between customers and boat owners

### 📱 Mobile Native Features
- **Push Notifications** - Firebase Cloud Messaging integration
- **Geolocation Services** - Find nearby boats with GPS
- **Offline Mode** - Essential data cached for offline use
- **Camera Integration** - Upload boat photos and documents
- **Native UI Components** - Platform-specific interface elements

### 🔋 Offline Capabilities
- **Smart Caching** - Boats, bookings, and messages stored locally
- **Pending Actions** - Queue actions for sync when back online
- **Automatic Sync** - Background data synchronization
- **Offline Search** - Search cached boats without internet
- **Data Management** - Control cache size and sync frequency

### 🌍 Location Services
- **GPS Integration** - Real-time location tracking
- **Nearby Boats** - Find boats within customizable radius
- **Distance Calculations** - Show boat distance from user
- **Interactive Maps** - React Native Maps with custom markers
- **Location Permissions** - Proper iOS/Android permission handling

### 🔔 Push Notifications
- **Booking Confirmations** - Instant notification for booking status
- **New Messages** - Real-time chat notifications
- **Document Updates** - Alerts for document verification
- **Weather Alerts** - Safety notifications for adverse conditions
- **Special Offers** - Marketing notifications for deals

## Technical Architecture

### Framework & Navigation
```
React Native 0.73.2
├── @react-navigation/native - Navigation container
├── @react-navigation/bottom-tabs - Main tab navigation
├── @react-navigation/native-stack - Screen stack navigation
└── Expo ~50.0.0 - Development platform
```

### State Management & Data
```
@tanstack/react-query - Server state management
├── Smart caching strategies
├── Background refetching
├── Optimistic updates
└── Offline query support
```

### Services Architecture
```
services/
├── AuthService.tsx - User authentication & sessions
├── LocationService.tsx - GPS & geolocation features
├── NotificationService.ts - Push notifications & alerts
└── OfflineService.ts - Offline data & sync management
```

### Native Integrations
```
Native Features
├── @react-native-firebase/messaging - Push notifications
├── @react-native-geolocation-service - GPS location
├── react-native-maps - Interactive maps
├── react-native-permissions - iOS/Android permissions
└── @react-native-async-storage/async-storage - Local storage
```

## Screen Architecture

### Main Navigation (Bottom Tabs)
- **Home** - Featured boats, nearby boats, quick actions
- **Search** - Advanced search with filters and map view
- **Bookings** - User bookings management (active/past)
- **Messages** - Real-time chat with boat owners
- **Profile** - User settings, documents, offline management

### Secondary Screens (Stack Navigation)
- **BoatDetails** - Detailed boat information and booking
- **Booking** - Booking form and payment flow
- **Map** - Full-screen interactive map with boat markers
- **Documents** - Document upload and verification
- **Offline** - Offline data management and sync status

## Installation & Setup

### Prerequisites
```bash
# Install Expo CLI
npm install -g @expo/cli

# Install React Native CLI (if needed)
npm install -g react-native-cli
```

### Development Setup
```bash
# Install dependencies
cd mobile
npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Environment Configuration
Create `.env` file in mobile directory:
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_api_key
FIREBASE_MESSAGING_SENDER_ID=your_sender_id

# API Configuration
API_BASE_URL=http://localhost:5000  # Development
API_BASE_URL=https://your-production-url.com  # Production

# Google Maps (if needed)
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Offline Strategy

### Data Caching
- **Boats**: Cached for 24 hours, updated on app launch
- **Bookings**: Cached for 1 hour, critical for offline access
- **Messages**: Cached indefinitely, synced when online
- **User Profile**: Cached until logout

### Pending Actions Queue
- **Bookings**: Queued for completion when online
- **Messages**: Stored locally, sent when connection restored
- **Favorites**: Cached locally, synced with server
- **Reviews**: Queued for submission when online

### Sync Strategy
- **Automatic**: Background sync every 5 minutes when online
- **Manual**: Pull-to-refresh in all screens
- **Intelligent**: Only sync changed data to minimize bandwidth
- **Conflict Resolution**: Server data takes precedence

## Push Notifications

### Notification Types
1. **Booking Confirmations** - Instant booking status updates
2. **New Messages** - Real-time chat notifications
3. **Document Verification** - Document approval/rejection alerts
4. **Weather Alerts** - Safety notifications
5. **Special Offers** - Marketing promotions

### Implementation
```typescript
// Send booking confirmation
await NotificationService.notifyBookingConfirmed(
  bookingId, 
  boatName
);

// Send new message notification
await NotificationService.notifyNewMessage(
  senderName, 
  messagePreview, 
  messageId
);

// Schedule booking reminder (24h before)
await NotificationService.notifyBookingReminder(
  bookingId, 
  boatName, 
  startDate
);
```

## Location Services

### GPS Features
- **Current Location**: User's real-time position
- **Nearby Search**: Find boats within specified radius
- **Distance Calculation**: Show distance to each boat
- **Permission Handling**: Proper iOS/Android permission flow

### Map Integration
```typescript
// Get nearby boats
const nearbyBoats = await getNearbyBoats(50); // 50km radius

// Calculate distance
const distance = calculateDistance(
  userLat, userLon, 
  boatLat, boatLon
);
```

## Build & Deployment

### Development Build
```bash
# Expo development build
expo start

# Local development
npm run android  # Android
npm run ios      # iOS
```

### Production Build
```bash
# Build for app stores
expo build:android  # Android APK/AAB
expo build:ios      # iOS IPA

# Or using EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

### App Store Deployment
1. **iOS**: Submit to Apple App Store via App Store Connect
2. **Android**: Upload to Google Play Console
3. **OTA Updates**: Use Expo's over-the-air update system

## Performance Optimization

### Memory Management
- Lazy loading for large lists
- Image caching and compression
- Proper cleanup in useEffect hooks
- Background task management

### Network Optimization
- Request deduplication with React Query
- Intelligent caching strategies
- Offline-first approach
- Batch API calls where possible

### Battery Optimization
- Efficient location tracking
- Background sync throttling
- Smart notification scheduling
- CPU-intensive task optimization

## Security Features

### Data Protection
- Secure token storage with AsyncStorage
- Encrypted sensitive data
- Certificate pinning for API calls
- Biometric authentication support

### Privacy Compliance
- Location permission transparency
- Data usage disclosure
- GDPR compliance features
- User consent management

## Testing Strategy

### Unit Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage
```

### Integration Testing
- API integration tests
- Navigation flow tests
- Offline/online state tests
- Push notification tests

### Device Testing
- iOS physical devices and simulators
- Android devices and emulators
- Different screen sizes and orientations
- Various OS versions

## Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **iOS build errors**: Clean build folder and rebuild
3. **Android permission issues**: Check AndroidManifest.xml
4. **Notification not working**: Verify Firebase configuration

### Debug Tools
- **Flipper**: React Native debugging
- **React DevTools**: Component inspection
- **Network Inspector**: API call monitoring
- **Logs**: React Native logs and crash reports

## Future Enhancements

### Planned Features
- **Biometric Authentication** - Face ID/Touch ID login
- **Augmented Reality** - AR boat viewing
- **Voice Commands** - Voice search and navigation
- **Social Features** - User reviews and social sharing
- **Advanced Analytics** - Usage tracking and insights

### Performance Improvements
- **Code Splitting** - Reduce initial bundle size
- **Native Modules** - Performance-critical native code
- **Background Sync** - Intelligent background processing
- **Caching Strategies** - Advanced caching mechanisms