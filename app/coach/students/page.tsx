'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCoachData } from '@/lib/hooks/useCoachData';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Users, UserPlus, UserCheck, UserX, Search, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CoachStudentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { students, requests, acceptRequest, rejectRequest, loading } = useCoachData(user?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'students' | 'requests'>('students');

  const filteredStudents = students.filter(student =>
    student.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAcceptRequest = async (requestId: string, studentId: string) => {
    const result = await acceptRequest(requestId, studentId);
    if (!result.error) {
      toast.success('Öğrenci kabul edildi');
    } else {
      toast.error('İşlem başarısız oldu');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const result = await rejectRequest(requestId);
    if (!result.error) {
      toast.success('İstek reddedildi');
    } else {
      toast.error('İşlem başarısız oldu');
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Öğrenciler</h1>
          <p className="mt-1 text-sm text-gray-600">
            Öğrencilerinizi yönetin ve yeni istekleri değerlendirin
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('students')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'students'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Öğrencilerim ({students.length})
          </button>
          <button
            onClick={() => setSelectedTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'requests'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bekleyen İstekler ({requests.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Öğrenci ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Tab */}
      {selectedTab === 'students' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Aktif Öğrenciler</h3>
              <span className="text-sm text-gray-500">
                {filteredStudents.length} öğrenci
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {filteredStudents.length > 0 ? (
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/coach/students/${student.user_id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-blue-600">
                          {student.user?.full_name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.user?.full_name || 'Anonim Öğrenci'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.user?.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            student.goal === 'lose_weight' ? 'bg-red-100 text-red-800' :
                            student.goal === 'gain_weight' ? 'bg-green-100 text-green-800' :
                            student.goal === 'build_muscle' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {student.goal === 'lose_weight' ? 'Kilo Verme' :
                             student.goal === 'gain_weight' ? 'Kilo Alma' :
                             student.goal === 'build_muscle' ? 'Kas Geliştirme' : 'Koruma'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {student.age && `${student.age} yaş`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/coach/students/${student.user_id}`);
                        }}
                      >
                        Görüntüle
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/coach/students/${student.user_id}/messages`);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'Aramanıza uygun öğrenci bulunamadı' : 'Henüz öğrenciniz yok'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setSelectedTab('requests')}
                    className="mt-4"
                    variant="outline"
                  >
                    İstekleri Gör
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Requests Tab */}
      {selectedTab === 'requests' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bekleyen Koç İstekleri</h3>
              <span className="text-sm text-gray-500">
                {requests.length} istek
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-yellow-600">
                            {request.user?.full_name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {request.user?.full_name || 'Anonim Kullanıcı'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {request.message || 'Profesyonel bir koçla çalışmak istiyorum.'}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">
                              {request.user?.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id, request.student_id)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Kabul Et
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Reddet
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Henüz yeni koç isteği yok</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}