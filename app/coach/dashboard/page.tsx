'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCoachData } from '@/lib/hooks/useCoachData';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, UserPlus, FileText, Activity } from 'lucide-react';

export default function CoachDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { students, requests, loading } = useCoachData(user?.id || '');

  useEffect(() => {
    if (!user || user.role !== 'coach') {
      router.push('/login');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Toplam Öğrenci',
      value: students.length.toString(),
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      href: '/coach/students',
    },
    {
      name: 'Bekleyen İstekler',
      value: requests.length.toString(),
      icon: UserPlus,
      color: 'bg-yellow-100 text-yellow-600',
      href: '/coach/students',
    },
    {
      name: 'Aktif Planlar',
      value: '12', // Mock data
      icon: FileText,
      color: 'bg-green-100 text-green-600',
      href: '/coach/nutrition-plans',
    },
    {
      name: 'Programlar',
      value: '8', // Mock data
      icon: Activity,
      color: 'bg-purple-100 text-purple-600',
      href: '/coach/fitness-programs',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Hoş geldiniz, Koç {user?.full_name || user?.email}!
        </h1>
        <p className="text-green-100">
          Öğrencilerinize profesyonel destek sağlamaya hazır mısınız?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="card-hover cursor-pointer" onClick={() => router.push(stat.href)}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={cn('p-3 rounded-lg', stat.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Son İstekler</h3>
            <Button
              onClick={() => router.push('/coach/students')}
              variant="outline"
              size="sm"
            >
              Tümünü Gör
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {request.user?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {request.user?.full_name || 'Anonim Kullanıcı'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {request.message || 'Koç isteği gönderdi'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => console.log('Accept request:', request.id)}
                    >
                      Kabul Et
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => console.log('Reject request:', request.id)}
                    >
                      Reddet
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Henüz yeni istek yok</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Students */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Son Öğrenciler</h3>
            <Button
              onClick={() => router.push('/coach/students')}
              variant="outline"
              size="sm"
            >
              Tümünü Gör
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <div className="space-y-4">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {student.user?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.user?.full_name || 'Anonim Öğrenci'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Hedef: {student.goal || 'Belirtilmemiş'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/coach/students/${student.user_id}`)}
                  >
                    Görüntüle
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Henüz öğrenciniz yok</p>
              <Button
                onClick={() => router.push('/coach/students')}
                className="mt-4"
                variant="outline"
              >
                İstekleri Gör
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}