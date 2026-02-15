'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

declare global {
  interface Window {
    adsbygoogle?: Array<{ push: (args: Record<string, unknown>) => void }>;
  }
}

interface AdModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const COUNTDOWN_SECONDS = 5;

export default function AdModal({ isOpen, onComplete }: AdModalProps) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const adRef = useRef<HTMLModElement | null>(null);
  const adPushedRef = useRef(false);

  // Run countdown timer
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    adPushedRef.current = false;

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  // Push AdSense ad when modal opens
  useEffect(() => {
    if (!isOpen || adPushedRef.current) return;

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      try {
        if (adRef.current && typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({});
          adPushedRef.current = true;
        }
      } catch {
        // AdSense may not be loaded in dev or with ad blockers
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  // Block close during countdown
  const handleClose = useCallback(() => {
    if (countdown > 0) return;
    onComplete();
  }, [countdown, onComplete]);

  const isReady = countdown === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('modal.ad.title')}
      size="md"
      showCloseButton={false}
    >
      <div className="space-y-4">
        {/* AdSense Display Ad */}
        <div className="flex items-center justify-center min-h-[250px] bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '250px' }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
            data-ad-format="auto"
            data-full-width-responsive="true"
            ref={adRef}
          />
        </div>

        {/* Login prompt */}
        <p className="text-sm text-slate-500 text-center">
          {t('modal.ad.message')}
        </p>

        {/* Countdown / Continue button */}
        <div className="flex justify-center">
          {isReady ? (
            <Button variant="primary" size="lg" onClick={onComplete}>
              {t('modal.ad.continue')}
            </Button>
          ) : (
            <div className="px-6 py-3 rounded-lg bg-slate-100 text-slate-400 font-medium text-center">
              {t('modal.ad.countdown').replace('{seconds}', String(countdown))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
