'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCoachData } from '@/lib/hooks/useCoachData';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Activity, Plus, Users, Calendar, Target, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CoachFitnessProgramsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { students, fitnessPrograms, createFitnessProgram, loading } = useCoachData(user?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration_weeks: '4',
    sessions_per_week: '3',
    start_date: '',
    end_date: '',
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_id) {
      toast.error('Lütfen bir öğrenci seçin');
      return;
    }

    const result = await createFitnessProgram({
      student_id: formData.student_id,
      title: formData.title,
      description: formData.description || null,
      difficulty: formData.difficulty,
      duration_weeks: parseInt(formData.duration_weeks),
      sessions_per_week: parseInt(formData.sessions_per_week),
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
    });

    if (!result.error) {
      toast.success('Fitness programı oluşturuldu');
      setFormData({
        student_id: '',
        title: '',
        description: '',
        difficulty: 'beginner',
        duration_weeks: '4',
        sessions_per_week: '3',
        start_date: '',
        end_date: '',
      });
      setShowAddForm(false);
    } else {
      toast.error('Program oluşturulurken hata oluştu');
    }
  };

  const difficultyLabels = {
    beginner: 'Başlangıç',
    intermediate: 'Orta',
    advanced: 'İleri',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fitness Programları</h1>
          <p className="mt-1 text-sm text-gray-600">
            Öğrencileriniz için kişiselleştirilmiş egzersiz programları oluşturun
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Program</span>
          </Button>
        </div>
      </div>

      {/* Add Program Form */}
      {showAddForm && (
        <Card className="animate-slide-up">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Yeni Fitness Programı</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Öğrenci *</label>
                  <select
                    className="form-input"
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    required
                  >
                    <option value="">Öğrenci seçin</option>
                    {students.map((student) => (
                      <option key={student.user_id} value={student.user_id}>
                        {student.user?.full_name || student.user?.email}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Program Başlığı *"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: Başlangıç Seviye Programı"
                  required
                />
              </div>

              <div>
                <label className="form-label">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  rows={3}
                  placeholder="Program açıklaması..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Zorluk Seviyesi *</label>
                  <select
                    className="form-input"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  >
                    {Object.entries(difficultyLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Süre (hafta) *</label>
                  <Input
                    type="number"
                    min="1"
                    max="52"
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData({ ...formData, duration_weeks: e.target.value })}
                    placeholder="4"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Haftalık Antrenman *</label>
                  <Input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.sessions_per_week}
                    onChange={(e) => setFormData({ ...formData, sessions_per_week: e.target.value })}
                    placeholder="3"
                    required
                  />
                </div>
                <div></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Başlangıç Tarihi</label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Bitiş Tarihi</label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button type="submit">Programı Oluştur</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Programs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Aktif Programlar</h3>
            <span className="text-sm text-gray-500">
              {fitnessPrograms.filter(p => p.is_active).length} aktif program
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {fitnessPrograms.length > 0 ? (
            <div className="space-y-4">
              {fitnessPrograms.map((program) => (
                <div
                  key={program.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => router.push(`/coach/fitness-programs/${program.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Dumbbell className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{program.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {program.user?.full_name || 'Öğrenci'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {difficultyLabels[program.difficulty]}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {program.duration_weeks} hafta
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Activity className="h-4 w-4 mr-1" />
                            Haftada {program.sessions_per_week} antrenman
                          </span>
                          {program.start_date && (
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {program.start_date} - {program.end_date || 'Süresiz'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        program.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {program.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/coach/fitness-programs/${program.id}`);
                        }}
                      >
                        Görüntüle
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Henüz fitness programı oluşturmadınız</p>
              {students.length > 0 ? (
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4"
                >
                  İlk Programı Oluştur
                </Button>
              ) : (
                <p className="text-sm text-gray-400 mt-2">
                  Önce öğrenci kabul etmelisiniz
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}