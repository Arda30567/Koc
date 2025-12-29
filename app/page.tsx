'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { 
  Users, 
  Target, 
  TrendingUp, 
  MessageCircle, 
  Award, 
  Calendar,
  Play,
  CheckCircle
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      router.push(user.role === 'coach' ? '/coach/dashboard' : '/dashboard');
    } else {
      router.push('/register');
    }
  };

  const features = [
    {
      name: 'Kalori Takibi',
      description: 'Günlük kalori ve makro besin takibi ile hedeflerinize ulaşın.',
      icon: Target,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Egzersiz Programı',
      description: 'Profesyonel koçlar tarafından hazırlanmış egzersiz programları.',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      name: 'Vücut Ölçümleri',
      description: 'İlerlemenizi grafiklerle takip edin ve motivasyonunuzu koruyun.',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      name: 'Topluluk Forumu',
      description: 'Benzer hedefleri olan kişilerle deneyimlerinizi paylaşın.',
      icon: MessageCircle,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  const testimonials = [
    {
      name: 'Ayşe Yılmaz',
      role: 'Öğrenci',
      content: '3 ayda 8 kilo verdim! Koçumun desteği ve uygulamanın takip özellikleri harika.',
      avatar: 'AY',
    },
    {
      name: 'Mehmet Demir',
      role: 'Fitness Koçu',
      content: 'Öğrencilerimi daha etkili bir şekilde takip edebiliyorum. Mükemmel bir platform.',
      avatar: 'MD',
    },
    {
      name: 'Zeynep Kaya',
      role: 'Öğrenci',
      content: 'Kas kazanım hedefimde çok yardımcı oldu. Topluluk desteği de harika!',
      avatar: 'ZK',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Aktif Kullanıcı' },
    { number: '500+', label: 'Profesyonel Koç' },
    { number: '50,000+', label: 'Başarı Hikayesi' },
    { number: '95%', label: 'Memnuniyet Oranı' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            <Logo className="mx-auto h-16 w-auto mb-8" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Fitness Hedeflerinize
              <span className="text-primary-600"> Ulaşın</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Profesyonel koçlarla çalışın, beslenmenizi takip edin, egzersizlerinizi planlayın ve 
              topluluk desteğiyle hedeflerinize ulaşın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="text-lg px-8 py-4"
              >
                Hemen Başla
              </Button>
              <Button
                onClick={() => router.push('/login')}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
              >
                Giriş Yap
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hero Image/Video Placeholder */}
        <div className="relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-10 w-10 text-white ml-1" />
                  </div>
                  <p className="text-primary-700 font-medium">Uygulama Tanıtımı</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Neden FitCoach?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tüm fitness ihtiyaçlarınız için tek platform. Profesyonel destek, 
              topluluk ve gelişmiş takip özellikleri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.name} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${feature.color} mb-4`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-gray-600">
              4 basit adımda fitness hedeflerinize ulaşın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Kayıt Olun',
                description: 'Ücretsiz hesap oluşturun ve profilinizi tamamlayın.',
              },
              {
                step: '2',
                title: 'Hedef Belirleyin',
                description: 'Kilo verme, kas kazanımı veya formda kalma hedeflerinizi belirleyin.',
              },
              {
                step: '3',
                title: 'Koç Seçin',
                description: 'Uzman koçlardan biriyle çalışmaya başlayın veya topluluğa katılın.',
              },
              {
                step: '4',
                title: 'Takip Edin',
                description: 'İlerlemenizi takip edin ve hedeflerinize ulaşın.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kullanıcılarımız Ne Diyor?
            </h2>
            <p className="text-xl text-gray-600">
              Gerçek kullanıcıların başarı hikayeleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-primary-600 font-bold">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hedeflerinize Ulaşmaya Hazır mısınız?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Ücretsiz kayıt olun ve profesyonel destekle fitness yolculuğunuza başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-4"
            >
              Ücretsiz Başla
            </Button>
            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-white text-white hover:bg-primary-700"
            >
              Giriş Yap
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Logo className="mx-auto h-10 w-auto mb-4" />
            <p className="text-gray-400 mb-4">
              Profesyonel fitness ve beslenme coaching platformu
            </p>
            <p className="text-sm text-gray-500">
              © 2024 FitCoach. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}