'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCoachData } from '@/lib/hooks/useCoachData';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileText, Plus, Users, Calendar, Target } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CoachNutritionPlansPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { students, nutritionPlans, createNutritionPlan, loading } = useCoachData(user?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    daily_calories: '',
    protein_ratio: '0.3',
    carbs_ratio: '0.4',
    fat_ratio: '0.3',
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

    const totalRatio = parseFloat(formData.protein_ratio) + parseFloat(formData.carbs_ratio) + parseFloat(formData.fat_ratio);
    if (Math.abs(totalRatio - 1.0) > 0.01) {
      toast.error('Makro oranları toplamı 100% olmalıdır');
      return;
    }

    const result = await createNutritionPlan({
      student_id: formData.student_id,
      title: formData.title,
      description: formData.description || null,
      daily_calories: parseInt(formData.daily_calories),
      protein_ratio: parseFloat(formData.protein_ratio),
      carbs_ratio: parseFloat(formData.carbs_ratio),
      fat_ratio: parseFloat(formData.fat_ratio),
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
    });

    if (!result.error) {
      toast.success('Beslenme planı oluşturuldu');
      setFormData({
        student_id: '',
        title: '',
        description: '',
        daily_calories: '',
        protein_ratio: '0.3',
        carbs_ratio: '0.4',
        fat_ratio: '0.3',
        start_date: '',
        end_date: '',
      });
      setShowAddForm(false);
    } else {
      toast.error('Plan oluşturulurken hata oluştu');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Beslenme Planları</h1>
          <p className="mt-1 text-sm text-gray-600">
            Öğrencileriniz için kişiselleştirilmiş beslenme planları oluşturun
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Plan</span>
          </Button>
        </div>
      </div>

      {/* Add Plan Form */}
      {showAddForm && (
        <Card className="animate-slide-up">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Yeni Beslenme Planı</h3>
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
                  label="Plan Başlığı *"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: Kilo Verme Planı"
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
                  placeholder="Plan açıklaması..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Günlük Kalori Hedefi *"
                  type="number"
                  min="800"
                  max="5000"
                  value={formData.daily_calories}
                  onChange={(e) => setFormData({ ...formData, daily_calories: e.target.value })}
                  placeholder="2000"
                  required
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="form-label">Protein %</label>
                    <Input
                      type="number"
                      step="0.05"
                      min="0.1"
                      max="0.5"
                      value={parseFloat(formData.protein_ratio) * 100}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) / 100;
                        setFormData({ ...formData, protein_ratio: value.toString() });
                      }}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="form-label">Karbonhidrat %</label>
                    <Input
                      type="number"
                      step="0.05"
                      min="0.2"
                      max="0.7"
                      value={parseFloat(formData.carbs_ratio) * 100}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) / 100;
                        setFormData({ ...formData, carbs_ratio: value.toString() });
                      }}
                      placeholder="40"
                    />
                  </div>
                  <div>
                    <label className="form-label">Yağ %</label>
                    <Input
                      type="number"
                      step="0.05"
                      min="0.1"
                      max="0.4"
                      value={parseFloat(formData.fat_ratio) * 100}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) / 100;
                        setFormData({ ...formData, fat_ratio: value.toString() });
                      }}
                      placeholder="30"
                    />
                  </div>
                </div>
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
                <Button type="submit">Planı Oluştur</Button>
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

      {/* Plans List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Aktif Planlar</h3>
            <span className="text-sm text-gray-500">
              {nutritionPlans.filter(p => p.is_active).length} aktif plan
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {nutritionPlans.length > 0 ? (
            <div className="space-y-4">
              {nutritionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => router.push(`/coach/nutrition-plans/${plan.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FileText className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{plan.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {plan.user?.full_name || 'Öğrenci'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {plan.daily_calories} kcal
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            P: {Math.round(plan.protein_ratio * 100)}% 
                            C: {Math.round(plan.carbs_ratio * 100)}% 
                            F: {Math.round(plan.fat_ratio * 100)}%
                          </span>
                          {plan.start_date && (
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {plan.start_date} - {plan.end_date || 'Süresiz'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        plan.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/coach/nutrition-plans/${plan.id}`);
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
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Henüz beslenme planı oluşturmadınız</p>
              {students.length > 0 ? (
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4"
                >
                  İlk Planı Oluştur
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