'use client';

import { AlertCircle } from 'lucide-react';

export default function TeamOnboardingPage() {
  // Feature disabled
  return (
    <div className="bg-[#f6f6f6] relative size-full min-h-screen p-4 sm:p-6 lg:p-8 overflow-hidden pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Team Onboarding Disabled</h2>
            <p className="text-gray-600">This feature has been temporarily disabled.</p>
          </div>
        </div>
      </div>
    </div>
  );
}