'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetToken(data.resetToken);
        toast.success(data.message);
        
        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        toast.error(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bağlantı hatası');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md py-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/former_logo.png"
              alt="Former Mobilya"
              width={180}
              height={60}
              className="h-16 w-auto"
              priority
            />
          </div>
          <CardTitle className="text-2xl">Şifremi Unuttum</CardTitle>
          <CardDescription>
            Email adresinizi girin, size şifre sıfırlama kodu gönderelim
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="E-posta adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12"
            />

            {resetToken && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Şifre sıfırlama kodunuz:
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 text-center tracking-wider">
                  {resetToken}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
                  Bu kod 15 dakika geçerlidir
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Gönderiliyor...' : 'Kod Gönder'}
            </Button>

            <div className="text-center">
              <Link 
                href="/login" 
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Giriş sayfasına dön
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
