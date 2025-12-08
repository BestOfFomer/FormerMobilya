'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Trash2, Edit, Star, StarOff } from 'lucide-react';
import { Address } from '@/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';
import { AddressDialog } from '@/components/account/AddressDialog';
import { useAuthStore } from '@/lib/auth-store';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Force dynamic rendering - this page requires authentication and API access
export const dynamic = 'force-dynamic';

export default function AddressesPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account/addresses');
    }
  }, [isAuthenticated, router]);

  const fetchAddresses = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.addresses.getAll() as any;
      setAddresses(response.addresses || []);
    } catch (error: any) {
      console.error('Fetch addresses error:', error);
      if (error.status === 401) {
        router.push('/login?redirect=/account/addresses');
      } else {
        toast.error('Adresler yüklenemedi', {
          icon: <XCircle className="h-5 w-5" />,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return; // Don't fetch if not logged in
    }
    fetchAddresses();
  }, [isAuthenticated]);

  // Don't render page content if not authenticated
  if (!isAuthenticated) {
    return null; // Redirect will happen via the other useEffect
  }

  const handleAddNewAddress = () => {
    setSelectedAddress(undefined);
    setDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setDialogOpen(true);
  };

  const handleDeleteClick = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;

    try {
      await api.addresses.delete(addressToDelete);
      toast.success('Adres silindi', {
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
      fetchAddresses();
    } catch (error: any) {
      console.error('Delete address error:', error);
      toast.error('Adres silinemedi', {
        icon: <XCircle className="h-5 w-5" />,
      });
    } finally {
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await api.addresses.setDefault(addressId);
      toast.success('Varsayılan adres güncellendi', {
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
      fetchAddresses();
    } catch (error: any) {
      console.error('Set default address error:', error);
      toast.error('Varsayılan adres ayarlanamadı', {
        icon: <XCircle className="h-5 w-5" />,
      });
    }
  };

  const handleDialogSave = () => {
    fetchAddresses();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="py-6">
          <CardContent>
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adreslerim</h1>
          <p className="text-muted-foreground mt-1">
            Teslimat adreslerinizi yönetin. Varsayılan adresiniz siparişlerde otomatik seçilir.
          </p>
        </div>
        <Button onClick={handleAddNewAddress} size="lg" className="md:w-auto w-full">
          <MapPin className="h-4 w-4 mr-2" />
          Yeni Adres Ekle
        </Button>
      </div>

      {/* Info Alert */}
      {addresses.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Adres Yönetimi
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Kayıtlı adresleriniz checkout sırasında kullanılabilir. Varsayılan adresiniz otomatik olarak seçilir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Address List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Adresler yükleniyor...</p>
          </div>
        </div>
      ) : addresses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Henüz kayıtlı adresiniz yok</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Hızlı teslimat deneyimi için adresinizi kaydedin. Siparişlerinizde zaman kazanın.
            </p>
            <Button onClick={handleAddNewAddress} size="lg">
              <MapPin className="h-4 w-4 mr-2" />
              İlk Adresimi Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <Card 
              key={address._id} 
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-md",
                address.isDefault && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <CardContent className="p-6">
                {/* Default Badge */}
                {address.isDefault && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Varsayılan
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="mb-4 pt-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {address.title}
                  </h3>
                </div>

                {/* Address Details */}
                <div className="space-y-2 text-sm mb-6">
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-muted-foreground">{address.phone}</p>
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground leading-relaxed">{address.address}</p>
                    <p className="text-muted-foreground mt-1">
                      {address.district}, {address.city}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditAddress(address)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Düzenle
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSetDefault(address._id!)}
                    >
                      <Star className="h-3.5 w-3.5 mr-1.5" />
                      Varsayılan Yap
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDeleteClick(address._id!)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Address Dialog */}
      <AddressDialog
        address={selectedAddress}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleDialogSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adresi silmek istediğinizden emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Adres kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
