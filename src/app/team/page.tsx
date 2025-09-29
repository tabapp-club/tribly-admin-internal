'use client';

import { AlertCircle } from 'lucide-react';

export default function TeamOverviewPage() {
  // Feature disabled
  return (
    <div className="min-h-screen bg-[#f6f6f6] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Team Overview Disabled</h2>
            <p className="text-gray-600">This feature has been temporarily disabled.</p>
          </div>
        </div>
      </div>
    </div>
  );
}