# Firebase Setup Instructions

This document explains how to set up Firebase for the SleepVision app to enable user memory and data persistence.

## 🔥 Firebase Features Implemented

- **Authentication**: Google Sign-In with Firebase Auth
- **User Profiles**: Stored in Firestore with subscription tiers
- **Sleep Schedules**: AI-generated schedules saved to Firebase
- **Sleep Entries**: Daily sleep tracking data
- **Real-time Sync**: Data syncs across devices automatically

## 📋 Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project (e.g., "sleepvision-app")
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Google** provider
3. Add your domain to authorized domains
4. Copy the Web Client ID

### 3. Enable Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users

### 4. Get Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click **Add app** > **Web** (</>) 
4. Register your app
5. Copy the Firebase configuration object

### 5. Environment Variables

Create a `.env.local` file in your project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 🗄️ Database Structure

The app automatically creates these Firestore collections:

### Users Collection (`users`)
```typescript
{
  id: string,              // User UID
  email: string,           // User email
  name: string,            // Display name
  picture: string,         // Profile picture URL
  subscriptionTier: string, // 'sleep-focused' | 'full-transformation' | 'elite-performance'
  createdAt: Timestamp,    // Account creation
  lastLogin: Timestamp,    // Last sign-in
  preferences: {           // User preferences
    theme: string,
    notifications: boolean,
    timezone: string
  }
}
```

### Sleep Schedules Collection (`sleepSchedules`)
```typescript
{
  id: string,              // Auto-generated ID
  userId: string,          // Reference to user
  title: string,           // Schedule name
  schedule: Array<{        // Schedule items
    time: string,
    activity: string,
    description: string,
    category: 'evening' | 'night' | 'morning'
  }>,
  questionnaireData: object, // Original questionnaire responses
  createdAt: Timestamp,    // Creation time
  updatedAt: Timestamp,    // Last modification
  isActive: boolean        // Is this the active schedule?
}
```

### Sleep Entries Collection (`sleepEntries`)
```typescript
{
  id: string,              // Auto-generated ID
  userId: string,          // Reference to user
  date: string,            // Date (YYYY-MM-DD)
  bedtime: string,         // Bedtime (HH:MM)
  wakeTime: string,        // Wake time (HH:MM)
  sleepQuality: number,    // 1-10 rating
  mood: string,            // How they felt
  notes: string,           // Optional notes
  createdAt: Timestamp     // Entry creation time
}
```

## 🔒 Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own sleep schedules
    match /sleepSchedules/{scheduleId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Users can read/write their own sleep entries
    match /sleepEntries/{entryId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🧪 Testing

The app includes fallback demo authentication if Firebase is not configured:

- Demo user will be created if Google Sign-In fails
- Data will be stored locally only
- Perfect for development and testing

## 🚀 Features Enabled

Once Firebase is configured, users can:

- **Sign in with Google** - Secure authentication
- **Save sleep schedules** - AI-generated schedules persist
- **Track sleep daily** - Log bedtime, wake time, quality, mood
- **View sleep stats** - Average quality, duration, streaks
- **Access across devices** - Data syncs everywhere
- **Manage multiple schedules** - Save and switch between schedules

## 🔧 Troubleshooting

### Common Issues:

1. **"Firebase API key not found"**
   - Check your `.env.local` file exists
   - Verify environment variable names start with `VITE_`

2. **"Auth domain not authorized"**
   - Add your domain to Firebase Auth authorized domains
   - For development, add `localhost:3000` or your dev URL

3. **"Permission denied"**
   - Check Firestore security rules
   - Ensure user is authenticated

4. **"Function not found"**
   - The app will fallback to demo mode if Firebase fails
   - Check browser console for detailed error messages

## 📱 Production Deployment

For production:

1. Update Firestore rules to production mode
2. Add your production domain to authorized domains
3. Set up proper environment variables in your hosting platform
4. Consider enabling Firebase App Check for security

## 💡 Next Steps

Consider adding:
- **Push notifications** for sleep reminders
- **Analytics** to track user engagement
- **Offline support** with Firebase offline persistence
- **File storage** for user-generated content
- **Cloud Functions** for complex backend logic

Firebase provides the foundation for a fully-featured sleep tracking app with real-time data sync and secure user management.
