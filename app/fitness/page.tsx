'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useStudentData } from '@/lib/hooks/useStudentData';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import { Dumbbell, Plus, Trash2, Calendar, Clock } from 'lucide-react';

export default function FitnessPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { fitnessLogs, addFitnessLog, loading } = useStudentData(user?.id || '');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    exercise_name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    notes: '',
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

  const dayLogs = fitnessLogs.filter(log => log.date === selectedDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await addFitnessLog({
      exercise_name: formData.exercise_name,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      weight: formData.weight ? parseFloat(formData.weight) : null,
      duration: formData.duration ? parseInt(formData.duration) : null,
      date: selectedDate,
      notes: formData.notes,
    });

    if (!result.error) {
      setFormData({
        exercise_name: '',
        sets: '',
        reps: '',
        weight: '',
        duration: '',
        notes: '',
      });
      setShowAddForm(false);
    }
  };

  const exerciseSuggestions = [
    'Bench Press', 'Squat', 'Deadlift', 'Pull-ups', 'Push-ups',
    'Shoulder Press', 'Barbell Row', 'Bicep Curl', 'Tricep Extension',
    'Leg Press', 'Leg Curl', 'Calf Raises', 'Plank', 'Crunches'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fitness Takibi</h1>
          <p className="mt-1 text-sm text-gray-600">
            Egzersiz ve antrenman kayıtları
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Egzersiz Ekle</span>
          </Button>
        </div>
      </div>

      {/* Add Exercise Form */}
      {showAddForm && (
        <Card className="animate-slide-up">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Yeni Egzersiz Ekle</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Egzersiz Adı</label>
                  <input
                    type="text"
                    list="exercise-suggestions"
                    value={formData.exercise_name}
                    onChange={(e) => setFormData({ ...formData, exercise_name: e.target.value })}
                    className="form-input"
                    placeholder="Örn: Bench Press"
                    required
                  />
                  <datalist id="exercise-suggestions">
                    {exerciseSuggestions.map(exercise => (
                      <option key={exercise} value={exercise} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="form-label">Set Sayısı</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                    placeholder="3"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Tekrar Sayısı</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.reps}
                    onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                    placeholder="12"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Ağırlık (kg)</label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="form-label">Süre (dk)</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="45"
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Notlar</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-input"
                  rows={3}
                  placeholder="Ek notlarınız..."
                />
              </div>
              
              <div className="flex space-x-3">
                <Button type="submit">Kaydet</Button>
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

      {/* Today's Workout Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Dumbbell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bugünkü Egzersizler</p>
                <p className="text-2xl font-bold text-gray-900">{dayLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Süre</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dayLogs.reduce((total, log) => total + (log.duration || 0), 0)} dk
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bu Hafta</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fitnessLogs.filter(log => {
                    const logDate = new Date(log.date);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return logDate >= weekAgo;
                  }).length} antrenman
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercise List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Egzersizler</h3>
            <span className="text-sm text-gray-500">
              {formatDate(selectedDate)}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {dayLogs.length > 0 ? (
            <div className="space-y-4">
              {dayLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Dumbbell className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{log.exercise_name}</p>
                      <p className="text-sm text-gray-500">
                        {log.sets} set × {log.reps} tekrar
                        {log.weight && ` @ ${log.weight}kg`}
                      </p>
                      {log.notes && (
                        <p className="text-xs text-gray-400 mt-1">{log.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {log.duration && (
                      <span className="text-sm text-gray-500">
                        {log.duration} dk
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      onClick={() => console.log('Edit log:', log.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Dumbbell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Bu gün için henüz egzersiz kaydı yok</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="mt-4"
              >
                İlk Egzersizi Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Workouts */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Son Egzersizler</h3>
        </CardHeader>
        <CardContent>
          {fitnessLogs.slice(0, 10).length > 0 ? (
            <div className="space-y-3">
              {fitnessLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{log.exercise_name}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(log.date)} • {log.sets} set × {log.reps} tekrar
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    {log.weight && <p className="font-medium">{log.weight} kg</p>}
                    {log.duration && <p className="text-gray-500">{log.duration} dk</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz egzersiz kaydı yok</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}