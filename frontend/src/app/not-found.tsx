import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="mt-4 text-3xl font-bold">Sayfa Bulunamadı</h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
            Lütfen URL'yi kontrol edin veya ana sayfaya dönün.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Ana Sayfaya Dön
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/search">
              <Search className="mr-2 h-5 w-5" />
              Ürün Ara
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            Yardıma mı ihtiyacınız var?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Bize ulaşın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
