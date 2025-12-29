'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useStudentData } from '@/lib/hooks/useStudentData';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDate, calculateBMI, getBMICategory } from '@/lib/utils';
import { TrendingUp, Plus, Weight, Ruler } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function MeasurementsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { measurements, addMeasurement, student, loading } = useStudentData(user?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    bicep: '',
    thigh: '',
    body_fat_percentage: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await addMeasurement({
      weight: parseFloat(formData.weight),
      chest: formData.chest ? parseFloat(formData.chest) : null,
      waist: formData.waist ? parseFloat(formData.waist) : null,
      hips: formData.hips ? parseFloat(formData.hips) : null,
      bicep: formData.bicep ? parseFloat(formData.bicep) : null,
      thigh: formData.thigh ? parseFloat(formData.thigh) : null,
      body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
      date: formatDate(new Date()),
      notes: formData.notes,
    });

    if (!result.error) {
      setFormData({
        weight: '',
        chest: '',
        waist: '',
        hips: '',
        bicep: '',
        thigh: '',
        body_fat_percentage: '',
        notes: '',
      });
      setShowAddForm(false);
    }
  };

  const latestMeasurement = measurements[0];
  const previousMeasurement = measurements[1];
  
  const weightData = measurements
    .slice(0, 30)
    .reverse()
    .map(m => ({
      date: formatDate(m.date, { month: 'short', day: 'numeric' }),
      weight: m.weight,
      ...(m.body_fat_percentage && { bodyFat: m.body_fat_percentage }),
    }));

  const getChange = (current?: number, previous?: number) => {
    if (!current || !previous) return null;
    const change = current - previous;
    return {
      value: Math.abs(change).toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
      color: change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-600',
    };
  };

  const weightChange = getChange(latestMeasurement?.weight, previousMeasurement?.weight);
  const bmi = latestMeasurement && student?.height ? calculateBMI(latestMeasurement.weight, student.height) : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vücut Ölçümleri</h1>
          <p className="mt-1 text-sm text-gray-600">
            Vücut kompozisyonu ve ilerleme takibi
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Ölçüm</span>
          </Button>
        </div>
      </div>

      {/* Current Stats */}
      {latestMeasurement && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Weight className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Güncel Kilo</p>
                    <p className="text-2xl font-bold text-gray-900">{latestMeasurement.weight} kg</p>
                  </div>
                </div>
                {weightChange && (
                  <div className={`text-sm font-medium ${weightChange.color}`}>
                    {weightChange.direction === 'up' ? '↗' : weightChange.direction === 'down' ? '↘' : '→'} 
                    {' '}{weightChange.value} kg
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {student?.height && bmi && bmiCategory && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Ruler className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">BMI</p>
                    <p className="text-2xl font-bold text-gray-900">{bmi}</p>
                    <p className={`text-sm ${bmiCategory.color}`}>{bmiCategory.category}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {latestMeasurement.body_fat_percentage && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Vücut Yağı</p>
                    <p className="text-2xl font-bold text-gray-900">{latestMeasurement.body_fat_percentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Add Measurement Form */}
      {showAddForm && (
        <Card className="animate-slide-up">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Yeni Ölçüm Ekle</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Kilo (kg) *</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70.0"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Göğüs (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="50"
                    max="200"
                    value={formData.chest}
                    onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    placeholder="100.0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Bel (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="40"
                    max="200"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    placeholder="80.0"
                  />
                </div>
                <div>
                  <label className="form-label">Kalça (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="50"
                    max="200"
                    value={formData.hips}
                    onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                    placeholder="95.0"
                  />
                </div>
                <div>
                  <label className="form-label">Biceps (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="20"
                    max="80"
                    value={formData.bicep}
                    onChange={(e) => setFormData({ ...formData, bicep: e.target.value })}
                    placeholder="35.0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Uyluk (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="30"
                    max="100"
                    value={formData.thigh}
                    onChange={(e) => setFormData({ ...formData, thigh: e.target.value })}
                    placeholder="55.0"
                  />
                </div>
                <div>
                  <label className="form-label">Vücut Yağı (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="3"
                    max="50"
                    value={formData.body_fat_percentage}
                    onChange={(e) => setFormData({ ...formData, body_fat_percentage: e.target.value })}
                    placeholder="15.0"
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

      {/* Progress Chart */}
      {measurements.length > 1 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">İlerleme Grafiği</h3>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    yAxisId="weight"
                    orientation="left"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    label={{ value: 'Kilo (kg)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="weight"
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    name="Kilo"
                    dot={{ fill: '#2563eb', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  {weightData[0]?.bodyFat && (
                    <Line 
                      yAxisId="bodyFat"
                      type="monotone" 
                      dataKey="bodyFat" 
                      stroke="#dc2626" 
                      strokeWidth={2}
                      name="Vücut Yağı %"
                      dot={{ fill: '#dc2626', r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Measurement History */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Ölçüm Geçmişi</h3>
        </CardHeader>
        <CardContent>
          {measurements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kilo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vücut Yağı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notlar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {measurements.slice(0, 10).map((measurement) => (
                    <tr key={measurement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(measurement.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {measurement.weight} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {measurement.waist ? `${measurement.waist} cm` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {measurement.body_fat_percentage ? `${measurement.body_fat_percentage}%` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                        {measurement.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Henüz ölçüm kaydı yok</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="mt-4"
              >
                İlk Ölçümü Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}