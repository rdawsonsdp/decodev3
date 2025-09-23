/**
 * Copyright © 2025 The Cardology Advantage. All rights reserved.
 * 
 * Authentication guard component that protects routes and manages user access.
 * Redirects unauthenticated users to the sign-in page.
 */

'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/signin' 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // User needs to be authenticated but isn't
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        // User is authenticated but shouldn't be (e.g., on sign-in page)
        router.push('/');
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if auth requirements aren't met
  if (requireAuth && !user) {
    return null; // Will redirect
  }

  if (!requireAuth && user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
