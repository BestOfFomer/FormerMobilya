'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User as UserIcon, Mail, Phone, Calendar, Shield, Edit2, Save, X, Lock, Key, Info, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';

// Force dynamic rendering - authenticated page
export const dynamic = 'force-dynamic';

const profileSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  phone: z.string().regex(/^05\d{9}$/, 'Telefon numarası 05XXXXXXXXX formatında olmalıdır').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifrenizi girin'),
  newPassword: z.string().min(6, 'Yeni şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string().min(1, 'Şifre onayını girin'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const { user, setUser } = useAuthStore();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleProfileSubmit = async (data: ProfileFormData) => {
    setIsSubmittingProfile(true);
    try {
      const response = await api.auth.updateProfile(data) as any;
      setUser(response.user);
      toast.success('Profil bilgileriniz güncellendi');
      setIsEditingProfile(false);
    } catch (error: any) {
      toast.error(error.message || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setIsSubmittingPassword(true);
    try {
      await api.auth.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Şifreniz başarıyla değiştirildi');
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.message || 'Şifre değiştirirken bir hata oluştu');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleCancelProfile = () => {
    profileForm.reset();
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hesap Ayarları</h1>
        <p className="text-muted-foreground mt-1">
          Profil bilgilerinizi ve güvenlik ayarlarınızı yönetin
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Profil Bilgileri</span>
            <span className="sm:hidden">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Şifre Değiştir</span>
            <span className="sm:hidden">Şifre</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Üyelik Bilgileri</span>
            <span className="sm:hidden">Üyelik</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Kişisel Bilgilerim</h2>
                  <p className="text-sm text-muted-foreground">
                    İletişim bilgilerinizi güncelleyin
                  </p>
                </div>
                {!isEditingProfile && (
                  <Button onClick={() => setIsEditingProfile(true)} variant="outline">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Düzenle
                  </Button>
                )}
              </div>

              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-base">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    Ad Soyad
                  </Label>
                  <Input
                    id="name"
                    {...profileForm.register('name')}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-muted' : ''}
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    E-posta Adresi
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register('email')}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-muted' : ''}
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-base">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Telefon Numarası
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="05XXXXXXXXX"
                    {...profileForm.register('phone')}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-muted' : ''}
                  />
                  {profileForm.formState.errors.phone && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Actions */}
                {isEditingProfile && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      type="submit" 
                      disabled={isSubmittingProfile}
                      className="flex-1"
                    >
                      {isSubmittingProfile ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Değişiklikleri Kaydet
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelProfile}
                      disabled={isSubmittingProfile}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      İptal
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Şifre Değiştir
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Hesabınızın güvenliği için güçlü bir şifre seçin
                </p>
              </div>

              {/* Security Info */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-6 dark:border-blue-900 dark:bg-blue-950">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Güvenlik İpuçları
                    </p>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                      <li>En az 6 karakter kullanın</li>
                      <li>Büyük ve küçük harf, rakam ve özel karakter ekleyin</li>
                      <li>Başka sitelerde kullanmadığınız bir şifre seçin</li>
                    </ul>
                  </div>
                </div>
              </div>

              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Mevcut Şifre
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register('currentPassword')}
                    placeholder="Mevcut şifrenizi girin"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    Yeni Şifre
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register('newPassword')}
                    placeholder="Yeni şifrenizi girin"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    Yeni Şifre (Tekrar)
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    placeholder="Yeni şifrenizi tekrar girin"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingPassword}
                    className="w-full"
                  >
                    {isSubmittingPassword ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                        Değiştiriliyor...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Şifremi Değiştir
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Info Tab */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Üyelik Bilgileri
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Hesap detaylarınızı görüntüleyin
                </p>
              </div>
              
              <div className="space-y-6">
                {/* User ID */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Kullanıcı ID
                  </Label>
                  <div className="font-mono text-sm bg-muted px-4 py-3 rounded-lg break-all">
                    {user?._id}
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Hesap Türü
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium capitalize inline-flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {user?.role === 'admin' ? 'Yönetici' : 'Müşteri'}
                    </div>
                  </div>
                </div>

                {/* Created Date */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Kayıt Tarihi
                  </Label>
                  <div className="text-base font-medium bg-muted px-4 py-3 rounded-lg">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '-'
                    }
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Hesap Durumu
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse" />
                      Aktif
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
