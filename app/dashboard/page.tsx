'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useStudentData } from '@/lib/hooks/useStudentData';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Apple, Dumbbell, TrendingUp, User, MessageCircle } from 'lucide-react';
import { formatDate, getDailyTotals } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { student, meals, fitnessLogs, measurements, loading, error } = useStudentData(user?.id || '');

  useEffect(() => {
    if (!user || user.role !== 'student') {
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

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bir hata oluştu</h2>
        <p className="text-gray-600">Lütfen sayfayı yenileyin veya tekrar giriş yapın.</p>
      </div>
    );
  }

  const todayTotals = getDailyTotals(formatDate(new Date()));
  const latestMeasurement = measurements[0];
  const weeklyLogs = fitnessLogs.filter(log => {
    const logDate = new Date(log.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  });

  const weightData = measurements
    .slice(0, 30)
    .reverse()
    .map(m => ({
      date: formatDate(m.date, { month: 'short', day: 'numeric' }),
      weight: m.weight,
    }));

  const stats = [
    {
      name: 'Günlük Kalori',
      value: `${todayTotals.calories} kcal`,
      icon: Apple,
      color: 'bg-green-100 text-green-600',
      href: '/nutrition',
    },
    {
      name: 'Bu Hafta Egzersiz',
      value: `${weeklyLogs.length} antrenman`,
      icon: Dumbbell,
      color: 'bg-blue-100 text-blue-600',
      href: '/fitness',
    },
    {
      name: 'Güncel Kilo',
      value: latestMeasurement ? `${latestMeasurement.weight} kg` : 'Veri yok',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      href: '/measurements',
    },
    {
      name: 'Koç Durumu',
      value: student?.coach_id ? 'Aktif' : 'Bekliyor',
      icon: User,
      color: student?.coach_id ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600',
      href: '/settings',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Hoş geldin, {user?.full_name || user?.email}!
        </h1>
        <p className="text-primary-100">
          Fitness hedeflerine ulaşmak için hazır mısın?
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

      {/* Recent Activity & Weight Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Meals */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Son Öğünler</h3>
          </CardHeader>
          <CardContent>
            {meals.length > 0 ? (
              <div className="space-y-3">
                {meals.slice(0, 5).map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{meal.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{meal.meal_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{meal.calories} kcal</p>
                      <p className="text-sm text-gray-500">
                        P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Apple className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Henüz öğün kaydı yok</p>
                <Button
                  onClick={() => router.push('/nutrition')}
                  className="mt-4"
                  size="sm"
                >
                  İlk Öğünü Ekle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weight Progress Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Kilo Takibi</h3>
          </CardHeader>
          <CardContent>
            {weightData.length > 1 ? (
              <div className="chart-container-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                      domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Yeterli veri yok</p>
                <Button
                  onClick={() => router.push('/measurements')}
                  className="mt-4"
                  size="sm"
                >
                  İlk Ölçümü Ekle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover cursor-pointer" onClick={() => router.push('/nutrition/add')}>
          <CardContent className="p-6 text-center">
            <Apple className="mx-auto h-8 w-8 text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Öğün Ekle</h3>
            <p className="text-sm text-gray-600">Yeni bir öğün kaydı oluştur</p>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer" onClick={() => router.push('/fitness/add')}>
          <CardContent className="p-6 text-center">
            <Dumbbell className="mx-auto h-8 w-8 text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Antrenman Ekle</h3>
            <p className="text-sm text-gray-600">Egzersiz kaydı oluştur</p>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer" onClick={() => router.push('/measurements/add')}>
          <CardContent className="p-6 text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Ölçüm Ekle</h3>
            <p className="text-sm text-gray-600">Vücut ölçülerini güncelle</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}