'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Bir hata oluştu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error.message || 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'}
          </p>
        </div>
        <div className="space-y-4">
          <Button onClick={reset} className="w-full">
            Sayfayı Yeniden Yükle
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  );
}