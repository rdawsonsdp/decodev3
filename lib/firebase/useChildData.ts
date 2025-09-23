/**
 * Copyright © 2025 The Cardology Advantage. All rights reserved.
 * 
 * Custom hook for managing child data persistence with Firestore.
 * Handles saving, loading, and syncing child profiles and readings.
 */

'use client'

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { FirestoreService } from './firestore';
import { ChildProfile, CreateChildData, ReadingHistory } from './types';

export function useChildData() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load children for the current user
  const loadChildren = useCallback(async () => {
    if (!user) {
      setChildren([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userChildren = await FirestoreService.getChildren(user.uid);
      setChildren(userChildren);
    } catch (err: any) {
      setError(err.message || 'Failed to load children');
      console.error('Error loading children:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Save a new child profile
  const saveChild = useCallback(async (childData: CreateChildData): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const childId = await FirestoreService.createChild(user.uid, childData);
      await loadChildren(); // Refresh the list
      return childId;
    } catch (err: any) {
      setError(err.message || 'Failed to save child');
      console.error('Error saving child:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, loadChildren]);

  // Update an existing child profile
  const updateChild = useCallback(async (childId: string, updates: Partial<CreateChildData>) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await FirestoreService.updateChild(childId, updates);
      await loadChildren(); // Refresh the list
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update child');
      console.error('Error updating child:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadChildren]);

  // Delete a child profile
  const deleteChild = useCallback(async (childId: string) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await FirestoreService.deleteChild(childId);
      await loadChildren(); // Refresh the list
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete child');
      console.error('Error deleting child:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadChildren]);

  // Save reading history
  const saveReading = useCallback(async (
    childId: string,
    readingType: 'birth' | 'yearly' | 'planetary',
    cardData: any,
    notes?: string
  ): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      const readingId = await FirestoreService.saveReading({
        childId,
        userId: user.uid,
        readingType,
        cardData,
        notes,
      });
      return readingId;
    } catch (err: any) {
      setError(err.message || 'Failed to save reading');
      console.error('Error saving reading:', err);
      return null;
    }
  }, [user]);

  // Load reading history for a child
  const loadReadingHistory = useCallback(async (childId: string): Promise<ReadingHistory[]> => {
    if (!user) {
      setError('User not authenticated');
      return [];
    }

    try {
      const history = await FirestoreService.getReadingHistory(childId);
      return history;
    } catch (err: any) {
      setError(err.message || 'Failed to load reading history');
      console.error('Error loading reading history:', err);
      return [];
    }
  }, [user]);

  // Load children when user changes
  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  return {
    children,
    loading,
    error,
    saveChild,
    updateChild,
    deleteChild,
    saveReading,
    loadReadingHistory,
    refreshChildren: loadChildren,
  };
}
