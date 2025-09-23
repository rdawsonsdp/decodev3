/**
 * Copyright © 2025 The Cardology Advantage. All rights reserved.
 * 
 * TypeScript interfaces and types for Firebase/Firestore data structures.
 * Defines the shape of user profiles, child data, and reading history.
 */

import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface ChildProfile {
  id: string;
  userId: string;
  name: string;
  birthdate: string; // ISO date string
  birthCard: string; // e.g., "A♥"
  yearlyForecast: any; // Current year's forecast data
  planetaryPeriods: any[]; // Array of planetary period data
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean; // For soft deletion
}

export interface ReadingHistory {
  id: string;
  childId: string;
  userId: string;
  readingType: 'birth' | 'yearly' | 'planetary';
  cardData: any; // The actual card/reading data
  notes?: string; // User's personal notes
  createdAt: Timestamp;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

export interface CreateChildData {
  name: string;
  birthdate: string;
  birthCard: string;
  yearlyForecast: any;
  planetaryPeriods: any[];
}

export interface UpdateChildData {
  name?: string;
  birthdate?: string;
  birthCard?: string;
  yearlyForecast?: any;
  planetaryPeriods?: any[];
}
