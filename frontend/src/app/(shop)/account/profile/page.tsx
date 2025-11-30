'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';

const profileSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  phone: z.string().regex(/^05\d{9}$/, 'Telefon numarası 05XXXXXXXXX formatında olmalıdır').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser } = useAuthStore();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const response = await api.auth.updateProfile(data) as any;
      setUser(response.user);
      toast.success('Profil bilgileriniz güncellendi');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card className="py-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profil Bilgileri</CardTitle>
              <CardDescription>
                Hesap bilgilerinizi görüntüleyin ve düzenleyin
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>Düzenle</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                {...form.register('name')}
                disabled={!isEditing}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                disabled={!isEditing}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="05XXXXXXXXX"
                {...form.register('phone')}
                disabled={!isEditing}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  İptal
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Hesap Detayları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kullanıcı ID</span>
            <span className="font-mono">{user?._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rol</span>
            <span className="capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kayıt Tarihi</span>
            <span>
              {user?.createdAt 
                ? new Date(user.createdAt).toLocaleDateString('tr-TR')
                : '-'
              }
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
