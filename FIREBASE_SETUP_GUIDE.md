# Firebase Setup Guide for Decode Your Kid

This guide will walk you through setting up Firebase Authentication and Firestore for the Decode Your Kid application.

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `decode-your-kid` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## 3. Create Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location for your database (choose closest to your users)
5. Click "Done"

## 4. Get Firebase Configuration

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (`</>`)
4. Register your app with a nickname (e.g., "Decode Your Kid Web")
5. Copy the Firebase configuration object

## 5. Environment Variables

Your Firebase configuration has been hardcoded in the application for easier deployment. The configuration is already set up in `lib/firebase/config.ts` with your project details:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyD_dezrw0yEUlpa1R1OBuQYFF9zZIjPYF0",
  authDomain: "cardology-a9fff.firebaseapp.com",
  projectId: "cardology-a9fff",
  storageBucket: "cardology-a9fff.firebasestorage.app",
  messagingSenderId: "374070175162",
  appId: "1:374070175162:web:6733fb1b4146cb26fae983"
};
```

**Note**: For production applications, it's recommended to use environment variables for security. You can optionally create a `.env.local` file if you prefer environment variable management.

## 6. Firestore Security Rules

In your Firebase project, go to "Firestore Database" > "Rules" and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Children profiles belong to authenticated users
    match /children/{childId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Reading history belongs to authenticated users
    match /readings/{readingId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

Click "Publish" to save the rules.

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Try creating an account and signing in
3. Check your Firestore database to see if user data is being created

## 8. Optional: Firebase Emulator (Development)

For local development, you can use Firebase emulators:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize emulators: `firebase init emulators`
4. Start emulators: `firebase emulators:start`

The app will automatically connect to emulators when running in development mode.

## 9. Deployment Considerations

For production deployment:

1. Update Firestore security rules to be more restrictive
2. Enable additional authentication providers if needed
3. Set up Firebase Hosting for optimal performance
4. Configure custom domain if desired

## Troubleshooting

### Common Issues:

1. **"Firebase App not initialized"**: Check your environment variables
2. **"Permission denied"**: Verify Firestore security rules
3. **"User not authenticated"**: Ensure user is signed in before accessing data

### Support:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Firebase Community](https://firebase.google.com/community)

## Security Best Practices

1. Never expose Firebase service account keys in client-side code
2. Use Firestore security rules to protect user data
3. Validate all user inputs on the client and server
4. Regularly review and update security rules
5. Monitor Firebase usage and set up billing alerts

---

**Copyright © 2025 The Cardology Advantage. All rights reserved.**
