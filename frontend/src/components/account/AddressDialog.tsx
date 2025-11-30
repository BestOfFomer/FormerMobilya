'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Address } from '@/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const addressSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalı'),
  fullName: z.string().min(2, 'Ad soyad en az 2 karakter olmalı'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Geçerli bir telefon numarası girin (10-11 hane)'),
  city: z.string().min(2, 'Şehir en az 2 karakter olmalı'),
  district: z.string().min(2, 'İlçe en az 2 karakter olmalı'),
  address: z.string().min(5, 'Adres en az 5 karakter olmalı'),
  isDefault: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressDialogProps {
  address?: Address;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function AddressDialog({ address, open, onOpenChange, onSave }: AddressDialogProps) {
  const isEditMode = !!address;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      title: '',
      fullName: '',
      phone: '',
      city: '',
      district: '',
      address: '',
      isDefault: false,
    },
  });

  const watchIsDefault = watch('isDefault');

  // Load address data when editing
  useEffect(() => {
    if (address) {
      reset({
        title: address.title,
        fullName: address.fullName,
        phone: address.phone,
        city: address.city,
        district: address.district,
        address: address.address,
        isDefault: address.isDefault,
      });
    } else {
      reset({
        title: '',
        fullName: '',
        phone: '',
        city: '',
        district: '',
        address: '',
        isDefault: false,
      });
    }
  }, [address, reset]);

  const onSubmit = async (data: AddressFormData) => {
    try {
      if (isEditMode && address?._id) {
        // Update existing address
        await api.addresses.update(address._id, data);
        toast.success('Adres güncellendi', {
          icon: <CheckCircle2 className="h-5 w-5" />,
        });
      } else {
        // Create new address
        await api.addresses.create(data);
        toast.success('Adres eklendi', {
          icon: <CheckCircle2 className="h-5 w-5" />,
        });
      }

      onSave();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Address save error:', error);
      toast.error(error.message || 'Adres kaydedilemedi', {
        icon: <XCircle className="h-5 w-5" />,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Adres bilgilerinizi güncelleyin' : 'Yeni adres bilgilerinizi girin'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Adres Başlığı *</Label>
            <Input
              id="title"
              placeholder="Örn: Ev, İş, Yazlık"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Ad Soyad *</Label>
            <Input
              id="fullName"
              placeholder="Ad Soyad"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="05XXXXXXXXX"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* City & District */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Şehir *</Label>
              <Input
                id="city"
                placeholder="İstanbul"
                {...register('city')}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">İlçe *</Label>
              <Input
                id="district"
                placeholder="Kadıköy"
                {...register('district')}
              />
              {errors.district && (
                <p className="text-sm text-destructive">{errors.district.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Adres *</Label>
            <Input
              id="address"
              placeholder="Mahalle, Sokak, No, Daire"
              {...register('address')}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          {/* Is Default */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={watchIsDefault}
              onCheckedChange={(checked) => setValue('isDefault', checked as boolean)}
            />
            <Label htmlFor="isDefault" className="text-sm cursor-pointer">
              Varsayılan adres olarak ayarla
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Kaydediliyor...' : isEditMode ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
