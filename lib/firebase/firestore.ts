/**
 * Copyright © 2025 The Cardology Advantage. All rights reserved.
 * 
 * Firestore database service for managing child profiles and reading history.
 * Handles CRUD operations for user data persistence.
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { ChildProfile, ReadingHistory, CreateChildData, UpdateChildData } from './types';

export class FirestoreService {
  /**
   * Create a new child profile
   */
  static async createChild(userId: string, childData: CreateChildData): Promise<string> {
    try {
      const childProfile: Omit<ChildProfile, 'id'> = {
        userId,
        name: childData.name,
        birthdate: childData.birthdate,
        birthCard: childData.birthCard,
        yearlyForecast: childData.yearlyForecast,
        planetaryPeriods: childData.planetaryPeriods,
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        isActive: true,
      };

      const docRef = await addDoc(collection(db, 'children'), childProfile);
      return docRef.id;
    } catch (error) {
      console.error('Create child error:', error);
      throw error;
    }
  }

  /**
   * Get all children for a user
   */
  static async getChildren(userId: string): Promise<ChildProfile[]> {
    try {
      const q = query(
        collection(db, 'children'),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const children: ChildProfile[] = [];
      
      querySnapshot.forEach((doc) => {
        children.push({ id: doc.id, ...doc.data() } as ChildProfile);
      });
      
      return children;
    } catch (error) {
      console.error('Get children error:', error);
      throw error;
    }
  }

  /**
   * Get a specific child profile
   */
  static async getChild(childId: string): Promise<ChildProfile | null> {
    try {
      const childDoc = await getDoc(doc(db, 'children', childId));
      if (childDoc.exists()) {
        return { id: childDoc.id, ...childDoc.data() } as ChildProfile;
      }
      return null;
    } catch (error) {
      console.error('Get child error:', error);
      throw error;
    }
  }

  /**
   * Update a child profile
   */
  static async updateChild(childId: string, updates: UpdateChildData): Promise<void> {
    try {
      const childRef = doc(db, 'children', childId);
      await updateDoc(childRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Update child error:', error);
      throw error;
    }
  }

  /**
   * Soft delete a child profile
   */
  static async deleteChild(childId: string): Promise<void> {
    try {
      const childRef = doc(db, 'children', childId);
      await updateDoc(childRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Delete child error:', error);
      throw error;
    }
  }

  /**
   * Save reading history
   */
  static async saveReading(readingData: Omit<ReadingHistory, 'id' | 'createdAt'>): Promise<string> {
    try {
      const reading: Omit<ReadingHistory, 'id'> = {
        ...readingData,
        createdAt: serverTimestamp() as any,
      };

      const docRef = await addDoc(collection(db, 'readings'), reading);
      return docRef.id;
    } catch (error) {
      console.error('Save reading error:', error);
      throw error;
    }
  }

  /**
   * Get reading history for a child
   */
  static async getReadingHistory(childId: string): Promise<ReadingHistory[]> {
    try {
      const q = query(
        collection(db, 'readings'),
        where('childId', '==', childId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const readings: ReadingHistory[] = [];
      
      querySnapshot.forEach((doc) => {
        readings.push({ id: doc.id, ...doc.data() } as ReadingHistory);
      });
      
      return readings;
    } catch (error) {
      console.error('Get reading history error:', error);
      throw error;
    }
  }

  /**
   * Get all reading history for a user
   */
  static async getUserReadingHistory(userId: string): Promise<ReadingHistory[]> {
    try {
      const q = query(
        collection(db, 'readings'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const readings: ReadingHistory[] = [];
      
      querySnapshot.forEach((doc) => {
        readings.push({ id: doc.id, ...doc.data() } as ReadingHistory);
      });
      
      return readings;
    } catch (error) {
      console.error('Get user reading history error:', error);
      throw error;
    }
  }

  /**
   * Update reading notes
   */
  static async updateReadingNotes(readingId: string, notes: string): Promise<void> {
    try {
      const readingRef = doc(db, 'readings', readingId);
      await updateDoc(readingRef, { notes });
    } catch (error) {
      console.error('Update reading notes error:', error);
      throw error;
    }
  }
}
