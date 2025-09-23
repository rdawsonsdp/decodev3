/**
 * Copyright © 2025 The Cardology Advantage. All rights reserved.
 * 
 * Firebase Authentication service for user login, registration, and profile management.
 * Handles email/password authentication and user profile creation.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { UserProfile, AuthUser } from './types';

export class AuthService {
  /**
   * Register a new user with email and password
   */
  static async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user profile in Firestore
      await this.createUserProfile(userCredential.user, displayName);
      
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login timestamp
      await this.updateLastLogin(userCredential.user.uid);
      
      return userCredential;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Create user profile in Firestore
   */
  private static async createUserProfile(user: User, displayName: string): Promise<void> {
    const userProfile: Omit<UserProfile, 'uid'> = {
      email: user.email || '',
      displayName,
      createdAt: serverTimestamp() as any,
      lastLoginAt: serverTimestamp() as any,
      preferences: {
        theme: 'light',
        notifications: true,
      },
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
  }

  /**
   * Update last login timestamp
   */
  private static async updateLastLogin(uid: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  }

  /**
   * Get user profile from Firestore
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { uid, ...userDoc.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, updates);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  /**
   * Convert Firebase User to AuthUser
   */
  static convertToAuthUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
    };
  }
}
