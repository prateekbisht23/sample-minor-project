# CivicSight-AI Mobile App

A React Native mobile application for reporting civic issues with AI-powered classification and real-time tracking.

## 🚀 Features

- **Dark Theme UI**: Modern, rounded interface inspired by the reference design
- **Camera Integration**: Capture photos of civic issues with real-time camera
- **AI Classification**: Automatic issue categorization using mocked AI services
- **Location Services**: GPS-based location tracking for accurate issue reporting
- **Real-time Updates**: Track issue status and progress
- **User Authentication**: Secure login and registration with JWT
- **Issue Management**: View, filter, and manage your reported issues
- **Interactive Map**: Visual representation of nearby issues

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack & Tab)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context API
- **API Integration**: Axios with automatic token handling
- **Camera**: Expo Camera
- **Location**: Expo Location
- **Storage**: Expo Secure Store
- **Maps**: React Native Maps

## 📱 Screens

### Authentication
- **Login Screen**: Email/password authentication
- **Register Screen**: User registration with validation

### Main App
- **Home Screen**: Dashboard with current issue status and nearby reports
- **My Reports**: Personal issue tracking with filters and status updates
- **Map Screen**: Interactive map showing issue locations
- **Settings**: User profile and app preferences

### Reporting
- **Camera Screen**: Full-screen camera with capture controls
- **Report Form**: AI-powered issue categorization and submission

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🔧 Configuration

### API Configuration

Update the API base URL in `src/config/constants.js`:

```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';
```

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:3000/api
```

## 📁 Project Structure

```
src/
├── api/                 # API configuration
├── components/          # Reusable UI components
├── config/             # App constants and configuration
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── navigation/         # Navigation setup
├── screens/            # Screen components
│   ├── Auth/          # Authentication screens
│   ├── Main/          # Main app screens
│   └── Reporting/     # Issue reporting screens
└── services/          # API service functions
```

## 🎨 Design System

### Colors
- **Primary**: Purple (#7c3aed)
- **Secondary**: Yellow (#eab308)
- **Background**: Dark (#1e1e2d)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Components
- **Button**: Multiple variants (primary, secondary, outline, ghost, danger)
- **Input**: Form inputs with validation
- **Card**: Container components with different variants
- **IssueListItem**: Issue display component
- **Header**: Navigation header component

## 🔐 Authentication

The app uses JWT-based authentication with secure token storage:

- Tokens are stored using Expo Secure Store
- Automatic token refresh and logout on expiration
- Role-based access control (user/admin)

## 📍 Location Services

- Automatic location detection on app start
- Manual location refresh
- Fallback to default location (Cracow, Poland)
- Location-based issue filtering

## 🤖 AI Integration

The app includes mocked AI services for:

- **Image Classification**: Categorizes issues from photos
- **Voice Transcription**: Converts voice recordings to text
- **Confidence Scoring**: Provides confidence levels for AI predictions

## 📱 Platform Support

- **iOS**: Full support with native camera and location services
- **Android**: Full support with native camera and location services
- **Web**: Limited support (camera and location features not available)

## 🚀 Deployment

### Expo Build

1. **Configure app.json** with your app details
2. **Build for production**:
   ```bash
   expo build:android
   expo build:ios
   ```

### App Store Deployment

1. **Configure app.json** with store details
2. **Submit to stores**:
   ```bash
   expo submit:android
   expo submit:ios
   ```

## 🧪 Testing

### Demo Credentials

- **Email**: demo@civicsight.com
- **Password**: demo123

### Test Features

- Camera capture and gallery selection
- AI image classification
- Location services
- Issue reporting and tracking
- Real-time status updates

## 🔧 Development

### Code Style

- Use functional components with hooks
- Follow React Native best practices
- Use NativeWind for styling
- Implement proper error handling
- Add loading states for async operations

### Debugging

- Use React Native Debugger
- Enable remote debugging
- Check Expo logs for errors
- Test on both iOS and Android

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Check the documentation
- Review error messages
- Test with demo credentials
- Ensure backend API is running

---

**Happy Coding! 🚀**
