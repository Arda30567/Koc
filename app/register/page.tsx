'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { isValidEmail, isValidPassword } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'coach',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push(user.role === 'coach' ? '/coach/dashboard' : '/dashboard');
    }
  }, [user, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Ad soyad gereklidir';
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi girin';
    }

    const passwordValidation = isValidPassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await signUp(
      formData.email,
      formData.password,
      formData.full_name,
      formData.role
    );
    setLoading(false);

    if (!result.error) {
      toast.success('Kayıt başarılı! Giriş yapılıyor...');
      // Redirect will happen via useEffect
    } else {
      toast.error(result.error.message || 'Kayıt başarısız');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Yeni hesap oluşturun
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <a
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Giriş yapın
            </a>
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Tam Adınız"
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Adınız ve soyadınız"
                error={errors.full_name}
              />

              <Input
                label="Email adresi"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ornek@email.com"
                error={errors.email}
              />

              <Input
                label="Şifre"
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="En az 8 karakter"
                error={errors.password}
                helperText="En az 8 karakter, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter"
              />

              <Input
                label="Şifre Tekrar"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Şifrenizi tekrar girin"
                error={errors.confirmPassword}
              />

              <div>
                <label className="form-label">Hesap Türü</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={formData.role === 'student'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'student' | 'coach' })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-900">
                      Öğrenci - Fitness hedeflerimi takip etmek istiyorum
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="coach"
                      checked={formData.role === 'coach'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'student' | 'coach' })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-900">
                      Koç - Öğrencilere danışmanlık vermek istiyorum
                    </span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Kayıt Ol
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Kayıt olarak şunları kabul edersiniz
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-600">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Kullanım Koşulları
                  </a>{' '}
                  ve{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Gizlilik Politikası
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}