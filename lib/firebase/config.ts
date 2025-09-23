/**
 * Copyright © 2025 The Cardology Advantage. All rights reserved.
 * 
 * Firebase configuration and initialization for the Decode Your Kid application.
 * Handles authentication and Firestore database connections.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_dezrw0yEUlpa1R1OBuQYFF9zZIjPYF0",
  authDomain: "cardology-a9fff.firebaseapp.com",
  projectId: "cardology-a9fff",
  storageBucket: "cardology-a9fff.firebasestorage.app",
  messagingSenderId: "374070175162",
  appId: "1:374070175162:web:6733fb1b4146cb26fae983"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Only connect to emulators if not already connected
  if (!auth._delegate._config?.emulator) {
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
  if (!db._delegate._settings?.host?.includes('localhost')) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
}

export default app;
