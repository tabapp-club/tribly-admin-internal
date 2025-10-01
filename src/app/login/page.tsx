'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { ImprovedInput } from '@/components/ui/ImprovedInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Lock } from 'lucide-react';
import { authApi } from '@/utils/api';

interface LoginResponse {
  message: string;
  data: {
    status: boolean;
    token: string;
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);

    try {
      // Call login API
      const loginResponse = await authApi.login(email, password) as LoginResponse;


      // Check if login was successful
      if (loginResponse.data && loginResponse.data.status) {
        const loginData = loginResponse.data;

        if (loginData.status && loginData.token) {
          // Store the token
          localStorage.setItem('auth_token', loginData.token);

          // Call /me API to get user details
          try {
            const meResponse = await authApi.getMe();

            if (meResponse.data) {
              // Save user details to localStorage
              localStorage.setItem('user_data', JSON.stringify(meResponse.data));
            }
          } catch {
            // Continue with login even if /me fails - user can still access the app
          }

          // Update auth context
          await login(email, password);

          // Check auth state after login

          addNotification({
            title: 'Welcome!',
            message: 'You have successfully logged in.',
            type: 'success',
            isRead: false
          });

          // Small delay to ensure state updates
          setTimeout(() => {
            router.push('/');
          }, 100);
        } else {
          throw new Error('Login failed - invalid credentials');
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid email or password. Please try again.';
      addNotification({
        title: 'Login Failed',
        message: errorMessage,
        type: 'error',
        isRead: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Tribly Admin</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <ImprovedInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
              validate={(value) => {
                if (!value) return 'Email is required';

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                  return 'Please enter a valid email address';
                }

                return null;
              }}
            />

            <ImprovedInput
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              required
              validate={(value) => {
                if (!value) return 'Password is required';
                if (value.length < 6) {
                  return 'Password must be at least 6 characters long';
                }
                return null;
              }}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
