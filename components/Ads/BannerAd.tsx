'use client';

import { useEffect, useState } from 'react';

interface BannerAdProps {
  show: boolean;
}

export default function BannerAd({ show }: BannerAdProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!show || !mounted) return null;

  // This is a placeholder for actual Google AdSense integration
  // In production, replace with actual ad code:
  // <ins className="adsbygoogle" ... />

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-2">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Διαφήμιση
        </p>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            [Θέση για Google AdSense Banner]
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Οι διαφημίσεις υποστηρίζουν τη δωρεάν λειτουργία του Λεξούλι
        </p>
      </div>
    </div>
  );
}

// Instructions for setting up Google AdSense:
// 1. Sign up at https://www.google.com/adsense/
// 2. Get your ad client ID (ca-pub-XXXXXXXXXXXXXXXX)
// 3. Create an ad unit and get the ad slot ID
// 4. Replace the placeholder above with:
/*
<ins
  className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
  data-full-width-responsive="true"
/>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
*/
