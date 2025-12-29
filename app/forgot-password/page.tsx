'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { isValidEmail } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Geçerli bir email adresi girin');
      return;
    }

    setLoading(true);
    
    try {
      // Mock password reset - in real app, integrate with Supabase auth
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      toast.success('Şifre sıfırlama bağlantısı email adresinize gönderildi');
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      toast.error('Şifre sıfırlama başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Şifrenizi sıfırlayın
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Email adresinizi girin. Size şifre sıfırlama bağlantısı göndereceğiz.
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            {submitted ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Email gönderildi!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {email} adresine şifre sıfırlama bağlantısı gönderdik. Lütfen emailinizi kontrol edin.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  className="w-full"
                >
                  Giriş sayfasına dön
                </Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                  label="Email adresi"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  error={error}
                />

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                >
                  Sıfırlama Bağlantısı Gönder
                </Button>

                <div className="text-center">
                  <a
                    href="/login"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Giriş sayfasına dön
                  </a>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>
            Şifre sıfırlama bağlantısı 1 saat geçerlidir. Spam klasörünü de kontrol etmeyi unutmayın.
          </p>
        </div>
      </div>
    </div>
  );
}