/**
 * Copyright © 2025 The Cardology Advantage. All rights reserved.
 * 
 * User profile management component for displaying user information
 * and providing account management options.
 */

'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Settings, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { format } from 'date-fns';

export default function UserProfile() {
  const { user, userProfile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userProfile) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-purple-100 text-purple-800 text-xl">
              {getInitials(userProfile.displayName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{userProfile.displayName}</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {user.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">Member Since</p>
              <p className="text-gray-600">
                {userProfile.createdAt && 
                  format(userProfile.createdAt.toDate(), 'MMM yyyy')
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">Status</p>
              <Badge variant="secondary" className="text-xs">
                {user.emailVerified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Preferences</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {userProfile.preferences.theme === 'light' ? 'Light' : 'Dark'} Theme
            </Badge>
          </div>
        </div>

        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {loading ? 'Signing Out...' : 'Sign Out'}
        </Button>
      </CardContent>
    </Card>
  );
}
