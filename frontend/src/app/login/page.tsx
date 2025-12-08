'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const redirectPath = searchParams.get('redirect') || '/account/orders';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData.email, loginData.password);
      
      toast.success('Giriş başarılı!');
      router.push(redirectPath);
    } catch (error: any) {
      toast.error(error.message || 'Giriş başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (registerData.password.length > 16) {
      toast.error('Şifre en fazla 16 karakter olabilir');
      return;
    }

    setIsLoading(true);
    try {
      await register(registerData.name, registerData.email, registerData.password);
      
      toast.success('Kayıt başarılı! Hoş geldiniz.');
      router.push('/account/orders');
    } catch (error: any) {
      // Display backend validation errors
      const errorMessage = error.message || 'Kayıt başarısız';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20" />
      
      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/30 dark:bg-green-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      
      {/* Glassmorphism card */}
      <Card className="w-full max-w-md relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-white/20 dark:border-slate-700/30 shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-500/5 py-6 transition-all duration-300 hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
              <Image
                src="/images/fomer_logo.png"
                alt="Former Mobilya"
                width={180}
                height={60}
                className="h-16 w-auto relative z-10"
                priority
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Hesabınıza giriş yapın</p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto p-0 bg-transparent gap-2">
              <TabsTrigger 
                value="login"
                className="relative py-3 px-6 rounded-lg font-medium text-slate-600 dark:text-slate-400 transition-all duration-300 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 data-[state=active]:shadow-sm before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-emerald-500 before:to-green-500 before:rounded-full before:scale-x-0 data-[state=active]:before:scale-x-100 before:transition-transform before:duration-300"
              >
                Giriş Yap
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="relative py-3 px-6 rounded-lg font-medium text-slate-600 dark:text-slate-400 transition-all duration-300 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 data-[state=active]:shadow-sm before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-emerald-500 before:to-green-500 before:rounded-full before:scale-x-0 data-[state=active]:before:scale-x-100 before:transition-transform before:duration-300"
              >
                Üye Ol
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-5 mt-8 animate-in fade-in-50 slide-in-from-bottom-3 duration-300">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="E-posta adresi"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                </div>
                
                <div className="relative space-y-2">
                  <Input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Şifre"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 pr-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    maxLength={16}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 hover:scale-110"
                  >
                    {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors duration-200"
                  >
                    Şifremi Unuttum
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    'Giriş Yap'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4 mt-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-300">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Ad Soyad"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="E-posta adresi"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                </div>
                
                <div className="relative space-y-2">
                  <Input
                    type={showRegPassword ? "text" : "password"}
                    placeholder="Şifre"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 pr-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    maxLength={16}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 hover:scale-110"
                  >
                    {showRegPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="relative space-y-2">
                  <Input
                    type={showRegConfirmPassword ? "text" : "password"}
                    placeholder="Şifre Tekrar"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 pr-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    maxLength={16}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 hover:scale-110"
                  >
                    {showRegConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Kayıt olunuyor...
                    </span>
                  ) : (
                    'Üye Ol'
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground pt-2">
                  Üye olarak{' '}
                  <Link href="/terms" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors duration-200">
                    Kullanım Koşulları
                  </Link>
                  'nı kabul etmiş olursunuz.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
