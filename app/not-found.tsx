import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Sayfa Bulunamadı
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>
        <div className="space-y-4">
          <Link href="/" passHref>
            <Button className="w-full">
              Ana Sayfaya Dön
            </Button>
          </Link>
          <Link href="/dashboard" passHref>
            <Button variant="outline" className="w-full">
              Dashboard'a Git
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}