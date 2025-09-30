'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { ImprovedInput } from '@/components/ui/ImprovedInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Smartphone, Shield } from 'lucide-react';

export default function LoginPage() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { sendOTP, verifyOTP } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);

    try {
      await sendOTP(mobileNumber);
      setOtpSent(true);
      setStep('otp');
      setOtp(['', '', '', '', '', '']); // Reset OTP inputs
      startCountdown();

      addNotification({
        title: 'OTP Sent!',
        message: `Verification code sent to ${mobileNumber}`,
        type: 'success',
        isRead: false
      });
    } catch (error) {
      addNotification({
        title: 'Failed to Send OTP',
        message: 'Please check your mobile number and try again.',
        type: 'error',
        isRead: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6 || isLoading) return;
    
    setIsLoading(true);

    try {
      await verifyOTP(mobileNumber, otpString);
      addNotification({
        title: 'Welcome!',
        message: 'You have successfully logged in.',
        type: 'success',
        isRead: false
      });
      router.push('/');
    } catch (error) {
      addNotification({
        title: 'Verification Failed',
        message: 'Invalid OTP. Please try again.',
        type: 'error',
        isRead: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-verify when OTP reaches 6 digits
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6 && step === 'otp' && !isLoading) {
      handleVerifyOTP();
    }
  }, [otp, step, isLoading]);

  // Focus first OTP input when step changes to OTP
  useEffect(() => {
    if (step === 'otp') {
      const firstInput = document.getElementById('otp-0');
      firstInput?.focus();
    }
  }, [step]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0 || isLoading) return;
    
    setIsLoading(true);
    try {
      await sendOTP(mobileNumber);
      setOtp(['', '', '', '', '', '']); // Reset OTP inputs
      startCountdown();

      addNotification({
        title: 'OTP Resent!',
        message: 'New verification code sent to your mobile number.',
        type: 'success',
        isRead: false
      });
    } catch (error) {
      addNotification({
        title: 'Failed to Resend OTP',
        message: 'Please try again later.',
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
            {step === 'mobile' 
              ? 'Enter your mobile number to get started'
              : 'Enter the verification code sent to your mobile'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'mobile' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <ImprovedInput
                id="mobileNumber"
                label="Mobile Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                icon={<Smartphone className="h-4 w-4" />}
                required
                validate={(value) => {
                  if (!value) return 'Mobile number is required';
                  
                  // Clean the input (remove spaces, dashes, parentheses)
                  const cleanNumber = value.replace(/[\s\-\(\)]/g, '');
                  
                  // Indian mobile number validation
                  const indianMobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
                  
                  if (!indianMobileRegex.test(cleanNumber)) {
                    return 'Please enter a valid Indian mobile number (10 digits starting with 6-9)';
                  }
                  
                  return null;
                }}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  We sent a 6-digit code to
                </p>
                <p className="font-medium">{mobileNumber}</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground text-center block">
                  Verification Code
                </label>
                <div className="flex justify-center gap-2" role="group" aria-label="OTP verification code">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                      disabled={isLoading}
                      aria-label={`OTP digit ${index + 1}`}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
              </div>

              {isLoading && (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground">Verifying OTP...</p>
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || isLoading}
                  className="text-sm text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  {countdown > 0 
                    ? `Resend OTP in ${countdown}s`
                    : 'Resend OTP'
                  }
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('mobile');
                    setOtp(['', '', '', '', '', '']);
                    setOtpSent(false);
                    setCountdown(0);
                    if (timerRef.current) {
                      clearInterval(timerRef.current);
                      timerRef.current = null;
                    }
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Change mobile number
                </button>
              </div>
            </form>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
