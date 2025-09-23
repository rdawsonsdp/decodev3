/**
 * Copyright © 2025 The Cardology Advantage. All rights reserved.
 * 
 * User profile page for managing account settings and viewing saved children.
 * Provides access to user information and account management features.
 */

'use client'

import React from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { useChildData } from '@/lib/firebase/useChildData';
import AuthGuard from '@/components/auth/AuthGuard';
import Navigation from '@/components/Navigation';
import UserProfile from '@/components/auth/UserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Calendar, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const { children, loading } = useChildData();

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
              <p className="text-gray-600">
                Manage your account and view your saved children's birth card readings
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* User Profile Card */}
              <div>
                <UserProfile />
              </div>

              {/* Saved Children */}
              <div>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-purple-600" />
                          Saved Children
                        </CardTitle>
                        <CardDescription>
                          Your children's birth card profiles
                        </CardDescription>
                      </div>
                      <Link href="/">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Child
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading...</p>
                      </div>
                    ) : children.length > 0 ? (
                      <div className="space-y-4">
                        {children.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Heart className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{child.name}</h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>Born {new Date(child.birthdate).toLocaleDateString()}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {child.birthCard}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Link href="/">
                              <Button variant="outline" size="sm">
                                View Reading
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No children saved yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Create your first birth card reading to get started
                        </p>
                        <Link href="/">
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Reading
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and account management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link href="/">
                      <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                        <Plus className="h-6 w-6 mb-2" />
                        <span>New Reading</span>
                      </Button>
                    </Link>
                    
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                      <Calendar className="h-6 w-6 mb-2" />
                      <span>Reading History</span>
                    </Button>
                    
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                      <Heart className="h-6 w-6 mb-2" />
                      <span>Share App</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
