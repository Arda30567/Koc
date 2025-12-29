'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useStudentData } from '@/lib/hooks/useStudentData';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Lock, UserPlus, Settings, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateProfile, signOut } = useAuth();
  const { student, updateStudent } = useStudentData(user?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });
  const [studentData, setStudentData] = useState({
    age: student?.age || '',
    height: student?.height || '',
    weight: student?.weight || '',
    goal: student?.goal || 'maintain',
    activity_level: student?.activity_level || 'moderate',
    privacy_setting: student?.privacy_setting || 'coach_only',
  });
  const [coachRequest, setCoachRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileUpdate = async () => {
    setIsSubmitting(true);
    const result = await updateProfile({ full_name: profileData.full_name });
    setIsSubmitting(false);
    
    if (!result.error) {
      toast.success('Profil güncellendi');
      setIsEditing(false);
    } else {
      toast.error('Profil güncellenirken hata oluştu');
    }
  };

  const handleStudentUpdate = async () => {
    setIsSubmitting(true);
    const result = await updateStudent({
      age: studentData.age ? parseInt(studentData.age as string) : null,
      height: studentData.height ? parseFloat(studentData.height as string) : null,
      weight: studentData.weight ? parseFloat(studentData.weight as string) : null,
      goal: studentData.goal as any,
      activity_level: studentData.activity_level as any,
      privacy_setting: studentData.privacy_setting as any,
    });
    setIsSubmitting(false);
    
    if (!result.error) {
      toast.success('Bilgiler güncellendi');
    } else {
      toast.error('Bilgiler güncellenirken hata oluştu');
    }
  };

  const handleCoachRequest = async () => {
    if (!coachRequest.trim()) {
      toast.error('Lütfen bir mesaj yazın');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/coach-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: coachRequest }),
      });
      
      if (response.ok) {
        toast.success('Koç isteği gönderildi');
        setCoachRequest('');
      } else {
        toast.error('İstek gönderilirken hata oluştu');
      }
    } catch (error) {
      toast.error('Bağlantı hatası');
    }
    setIsSubmitting(false);
  };

  const goalOptions = [
    { value: 'lose_weight', label: 'Kilo Vermek' },
    { value: 'gain_weight', label: 'Kilo Almak' },
    { value: 'maintain', label: 'Korumak' },
    { value: 'build_muscle', label: 'Kas Geliştirmek' },
  ];

  const activityOptions = [
    { value: 'sedentary', label: 'Hareketsiz (Masa başı iş)' },
    { value: 'light', label: 'Hafif (Haftada 1-3 gün egzersiz)' },
    { value: 'moderate', label: 'Orta (Haftada 3-5 gün egzersiz)' },
    { value: 'active', label: 'Aktif (Haftada 6-7 gün egzersiz)' },
    { value: 'very_active', label: 'Çok Aktif (Günde 2 kez egzersiz)' },
  ];

  const privacyOptions = [
    { value: 'public', label: 'Herkese Açık' },
    { value: 'coach_only', label: 'Sadece Koçum' },
    { value: 'private', label: 'Özel (Sadece Ben)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
        <p className="mt-1 text-sm text-gray-600">
          Hesap ve gizlilik ayarlarınızı yönetin
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Profil Bilgileri</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tam Ad"
                type="text"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Email"
                type="email"
                value={profileData.email}
                disabled
                helperText="Email adresiniz değiştirilemaz"
              />
            </div>
            
            {isEditing ? (
              <div className="flex space-x-3">
                <Button
                  onClick={handleProfileUpdate}
                  loading={isSubmitting}
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Kaydet</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setProfileData({ full_name: user?.full_name || '', email: user?.email || '' });
                  }}
                >
                  İptal
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
              >
                Düzenle
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Body Information */}
      {student && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Vücut Bilgileri</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Yaş"
                  type="number"
                  min="13"
                  max="100"
                  value={studentData.age}
                  onChange={(e) => setStudentData({ ...studentData, age: e.target.value })}
                  placeholder="25"
                />
                <Input
                  label="Boy (cm)"
                  type="number"
                  min="100"
                  max="250"
                  value={studentData.height}
                  onChange={(e) => setStudentData({ ...studentData, height: e.target.value })}
                  placeholder="175"
                />
                <Input
                  label="Kilo (kg)"
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  value={studentData.weight}
                  onChange={(e) => setStudentData({ ...studentData, weight: e.target.value })}
                  placeholder="70"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Hedef</label>
                  <select
                    className="form-input"
                    value={studentData.goal}
                    onChange={(e) => setStudentData({ ...studentData, goal: e.target.value })}
                  >
                    {goalOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Aktivite Seviyesi</label>
                  <select
                    className="form-input"
                    value={studentData.activity_level}
                    onChange={(e) => setStudentData({ ...studentData, activity_level: e.target.value })}
                  >
                    {activityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Gizlilik Ayarı</label>
                  <select
                    className="form-input"
                    value={studentData.privacy_setting}
                    onChange={(e) => setStudentData({ ...studentData, privacy_setting: e.target.value })}
                  >
                    {privacyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={handleStudentUpdate}
                loading={isSubmitting}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Bilgileri Güncelle</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coach Request */}
      {!student?.coach_id && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Koç İsteği</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Profesyonel bir koçla çalışmak istiyorsanız istek gönderin.
            </p>
            <div className="space-y-4">
              <textarea
                value={coachRequest}
                onChange={(e) => setCoachRequest(e.target.value)}
                className="form-input"
                rows={4}
                placeholder="Hedefleriniz ve koçtan beklentileriniz hakkında kısa bir mesaj yazın..."
              />
              <Button
                onClick={handleCoachRequest}
                loading={isSubmitting}
                className="flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Koç İsteği Gönder</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Hesap Güvenliği</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Şifre Değiştir</p>
                <p className="text-sm text-gray-600">
                  Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin
                </p>
              </div>
              <Button
                onClick={() => router.push('/forgot-password')}
                variant="outline"
              >
                Şifre Sıfırla
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Hesaptan Çıkış</p>
                <p className="text-sm text-gray-600">
                  Güvenli bir şekilde çıkış yapın
                </p>
              </div>
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                Çıkış Yap
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}