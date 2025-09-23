/**
 * Copyright © 2025 The Cardology Advantage. All rights reserved.
 * 
 * Dedicated sign-in page for the Decode Your Kid application.
 * Provides a full-page authentication experience with login and signup options.
 */

'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Heart, Sparkles, Users, Shield } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export default function SignInPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
    if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, router]);

  // Show loading spinner while checking auth state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Decode Your Kid</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover your child's unique personality and potential through birth card readings
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Features */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-800 flex items-center">
                  <Sparkles className="h-6 w-6 mr-2" />
                  Why Sign Up?
                </CardTitle>
                <CardDescription>
                  Join thousands of parents discovering their children's unique gifts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Save Multiple Children</h3>
                    <p className="text-sm text-gray-600">
                      Create profiles for all your children and track their unique birth card readings
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Access Anywhere</h3>
                    <p className="text-sm text-gray-600">
                      Your data syncs across all devices - access from phone, tablet, or computer
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure & Private</h3>
                    <p className="text-sm text-gray-600">
                      Your family's information is protected with enterprise-grade security
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-100 to-pink-100">
              <CardContent className="pt-6">
                <blockquote className="text-center">
                  <p className="text-gray-700 italic mb-2">
                    "Decode Your Kid helped me understand my daughter's emotional needs in ways I never imagined. The birth card readings are incredibly accurate!"
                  </p>
                  <footer className="text-sm text-gray-600">
                    — Sarah M., Mother of 3
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Authentication */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-purple-800">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <CardDescription>
                  {mode === 'login' 
                    ? 'Sign in to access your child\'s birth card readings'
                    : 'Join Decode Your Kid to save and track your readings'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={mode} onValueChange={(value) => setMode(value as AuthMode)}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4">
                    <LoginForm
                      onSwitchToSignUp={() => setMode('signup')}
                      onForgotPassword={() => {/* Handle forgot password */}}
                    />
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <SignUpForm onSwitchToLogin={() => setMode('login')} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Copyright © 2025 The Cardology Advantage. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
