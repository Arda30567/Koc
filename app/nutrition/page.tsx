'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useStudentData } from '@/lib/hooks/useStudentData';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDate, getDailyTotals } from '@/lib/utils';
import { Apple, Plus, Trash2, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function NutritionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { meals, addMeal, loading } = useStudentData(user?.id || '');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    meal_type: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const dailyTotals = getDailyTotals(selectedDate);
  const dayMeals = meals.filter(meal => meal.date === selectedDate);

  const macroData = [
    { name: 'Protein', value: dailyTotals.protein, color: '#ef4444' },
    { name: 'Karbonhidrat', value: dailyTotals.carbs, color: '#3b82f6' },
    { name: 'Yağ', value: dailyTotals.fat, color: '#f59e0b' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await addMeal({
      name: formData.name,
      meal_type: formData.meal_type,
      date: selectedDate,
      calories: parseInt(formData.calories),
      protein: parseFloat(formData.protein),
      carbs: parseFloat(formData.carbs),
      fat: parseFloat(formData.fat),
    });

    if (!result.error) {
      setFormData({
        name: '',
        meal_type: 'breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
      });
      setShowAddForm(false);
    }
  };

  const mealTypeLabels = {
    breakfast: 'Kahvaltı',
    lunch: 'Öğle Yemeği',
    dinner: 'Akşam Yemeği',
    snack: 'Atıştırmalık',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Beslenme Takibi</h1>
          <p className="mt-1 text-sm text-gray-600">
            Günlük kalori ve makro besin takibi
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
            <span>Öğün Ekle</span>
          </Button>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Günlük Özet</h3>
            <p className="text-sm text-gray-600">{formatDate(selectedDate)}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{dailyTotals.calories}</p>
                <p className="text-sm text-gray-600">Kalori</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{dailyTotals.protein}g</p>
                <p className="text-sm text-gray-600">Protein</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{dailyTotals.carbs}g</p>
                <p className="text-sm text-gray-600">Karbonhidrat</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{dailyTotals.fat}g</p>
                <p className="text-sm text-gray-600">Yağ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Makro Dağılımı</h3>
          </CardHeader>
          <CardContent>
            {dailyTotals.calories > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}g`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <Apple className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">Henüz öğün yok</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Meal Form */}
      {showAddForm && (
        <Card className="animate-slide-up">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Yeni Öğün Ekle</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Öğün Adı"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: Tavuk Salatası"
                  required
                />
                <select
                  className="form-input"
                  value={formData.meal_type}
                  onChange={(e) => setFormData({ ...formData, meal_type: e.target.value as any })}
                >
                  {Object.entries(mealTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  label="Kalori"
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="0"
                  required
                />
                <Input
                  label="Protein (g)"
                  type="number"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  placeholder="0"
                  required
                />
                <Input
                  label="Karbonhidrat (g)"
                  type="number"
                  step="0.1"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  placeholder="0"
                  required
                />
                <Input
                  label="Yağ (g)"
                  type="number"
                  step="0.1"
                  value={formData.fat}
                  onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                  placeholder="0"
                  required
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

      {/* Meals List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Öğünler</h3>
        </CardHeader>
        <CardContent>
          {dayMeals.length > 0 ? (
            <div className="space-y-3">
              {dayMeals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Apple className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{meal.name}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {mealTypeLabels[meal.meal_type]} • {meal.calories} kcal
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right text-sm">
                      <p className="font-medium text-gray-900">Makro</p>
                      <p className="text-gray-500">
                        P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      onClick={() => console.log('Edit meal:', meal.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Apple className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Bu gün için henüz öğün kaydı yok</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="mt-4"
              >
                İlk Öğünü Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}