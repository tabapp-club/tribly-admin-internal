'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Phone, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
   const [isLoading, setIsLoading] = useState(false);
   const [resendTimer, setResendTimer] = useState(0);
   const [otpError, setOtpError] = useState<string | null>(null);
   const [otpInvalid, setOtpInvalid] = useState(false);
  const { sendOTP, verifyOTP } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      addNotification({
        title: 'Validation Error',
        message: 'Please enter your phone number.',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendOTP(phoneNumber, countryCode);
      addNotification({
        title: 'OTP Sent',
        message: 'Please check your phone for the verification code.',
        type: 'success'
      });
      setStep('otp');
      setResendTimer(60); // 60 seconds cooldown
    } catch (error) {
      addNotification({
        title: 'Failed to Send OTP',
        message: 'Unable to send OTP. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

   const handleVerifyOTP = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!otp.trim()) {
       setOtpError('Please enter the OTP.');
       setOtpInvalid(false);
       return;
     }

     setOtpError(null);
     setOtpInvalid(false);
     setIsLoading(true);
     try {
       await verifyOTP(phoneNumber, otp);
       addNotification({
         title: 'Welcome!',
         message: 'You have successfully logged in.',
         type: 'success'
       });
       router.push('/');
      } catch (error) {
        setOtp('');
        setOtpError('Invalid OTP. Please try again.');
        setOtpInvalid(true);
      } finally {
       setIsLoading(false);
     }
   };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      await sendOTP(phoneNumber, countryCode);
      addNotification({
        title: 'OTP Resent',
        message: 'A new verification code has been sent.',
        type: 'success'
      });
      setResendTimer(60);
    } catch (error) {
      addNotification({
        title: 'Failed to Resend OTP',
        message: 'Unable to resend OTP. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

   const handleBack = () => {
     setStep('phone');
     setOtp('');
     setResendTimer(0);
     setOtpError(null);
     setOtpInvalid(false);
   };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-28 h-28 rounded-2xl flex items-center justify-center">
              <Image
                src="/icon.png"
                alt="Tribly logo"
                width={128}
                height={128}
                priority
                className="h-20 w-20 rounded-xl"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Tribly Admin</CardTitle>
          <CardDescription>
            Sign in to manage your business platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">+1</SelectItem>
                      <SelectItem value="+91">+91</SelectItem>
                      <SelectItem value="+44">+44</SelectItem>
                      <SelectItem value="+61">+61</SelectItem>
                      <SelectItem value="+81">+81</SelectItem>
                      <SelectItem value="+86">+86</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="8088768134"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

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
              <div className="flex items-center gap-2 mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="p-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {countryCode} {phoneNumber}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input
                     id="otp"
                     type="text"
                     placeholder="Enter 6-digit OTP"
                     value={otp}
                     onChange={(e) => {
                       setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                       setOtpError(null);
                       setOtpInvalid(false);
                     }}
                     className={cn(
                       'pl-10 text-center tracking-widest',
                       (otpError || otpInvalid) && 'border-red-500 focus-visible:ring-red-500'
                     )}
                     aria-invalid={otpInvalid || !!otpError}
                     maxLength={6}
                     required
                    />
                 </div>
                 {otpError && (
                   <p className="text-sm text-red-500 flex items-center gap-1">
                     <AlertCircle className="h-3 w-3" />
                     {otpError}
                   </p>
                 )}
               </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || isLoading}
                  className="text-sm"
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </Button>
              </div>
            </form>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
