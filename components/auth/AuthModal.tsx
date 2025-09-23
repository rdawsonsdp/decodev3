/**
 * Copyright © 2025 The Cardology Advantage. All rights reserved.
 * 
 * Authentication modal component that handles login and signup flows.
 * Provides a unified interface for user authentication.
 */

'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft } from 'lucide-react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

type AuthMode = 'login' | 'signup' | 'forgot-password';

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  const handleClose = () => {
    setMode(defaultMode);
    onClose();
  };

  const handleSwitchToSignUp = () => setMode('signup');
  const handleSwitchToLogin = () => setMode('login');
  const handleForgotPassword = () => setMode('forgot-password');

  const renderContent = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignUp={handleSwitchToSignUp}
            onForgotPassword={handleForgotPassword}
          />
        );
      case 'signup':
        return <SignUpForm onSwitchToLogin={handleSwitchToLogin} />;
      case 'forgot-password':
        return (
          <div className="w-full max-w-md mx-auto">
            <div className="text-center space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSwitchToLogin}
                className="absolute left-4 top-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h3 className="text-xl font-semibold text-purple-800">
                Reset Password
              </h3>
              <p className="text-gray-600">
                Password reset functionality will be implemented here.
              </p>
              <Button
                onClick={handleSwitchToLogin}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
