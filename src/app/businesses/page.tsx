'use client';

import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

export default function BusinessOverviewPage() {
  const [isClient, setIsClient] = useState(false);
  const [BusinessOverviewClient, setBusinessOverviewClient] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Only load the client component on the client side
    const loadClientComponent = async () => {
      const { default: ClientComponent } = await import('@/components/BusinessOverviewClient');
      setBusinessOverviewClient(() => ClientComponent);
      setIsClient(true);
    };
    
    loadClientComponent();
  }, []);

  // Show loading state during hydration and while loading the client component
  if (!isClient || !BusinessOverviewClient) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
                  <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading businesses...</h2>
          <p className="text-gray-600">Please wait while we load your business data.</p>
      </div>
    </div>
  );
}

  return <BusinessOverviewClient />;
}