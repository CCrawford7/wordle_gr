'use client';

import { useState, useEffect } from 'react';

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

const CONSENT_KEY = 'lexouli-cookie-consent';

export default function CookieConsent() {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (savedConsent === 'accepted' || savedConsent === 'rejected') {
      setConsentStatus(savedConsent as ConsentStatus);
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsentStatus('accepted');
    setIsVisible(false);

    // Enable Google AdSense personalized ads
    if (typeof window !== 'undefined' && (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle) {
      // Signal consent to Google
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({
        google_ad_client: 'ca-pub-2774055096389711',
        enable_page_level_ads: true,
      });
    }
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setConsentStatus('rejected');
    setIsVisible(false);

    // Disable personalized ads (still show non-personalized)
    if (typeof window !== 'undefined') {
      (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({
        google_ad_client: 'ca-pub-2774055096389711',
        enable_page_level_ads: true,
        google_npa: 1, // Non-personalized ads
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p className="font-medium mb-1">Χρήση Cookies</p>
          <p>
            Χρησιμοποιούμε cookies για διαφημίσεις και ανάλυση. Πατήστε &quot;Αποδοχή&quot; για εξατομικευμένες διαφημίσεις ή &quot;Απόρριψη&quot; για μη εξατομικευμένες.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            We use cookies for ads and analytics. Click &quot;Accept&quot; for personalized ads or &quot;Reject&quot; for non-personalized ads.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Απόρριψη
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
          >
            Αποδοχή
          </button>
        </div>
      </div>
    </div>
  );
}

// Export a hook to check consent status
export function useConsentStatus(): ConsentStatus {
  const [status, setStatus] = useState<ConsentStatus>('pending');

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (savedConsent === 'accepted' || savedConsent === 'rejected') {
      setStatus(savedConsent as ConsentStatus);
    }
  }, []);

  return status;
}
