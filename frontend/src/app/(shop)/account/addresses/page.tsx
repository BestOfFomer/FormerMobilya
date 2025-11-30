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
      <Card className="py-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Kayıtlı Adreslerim</CardTitle>
            <Button onClick={handleAddNewAddress}>Yeni Adres Ekle</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Henüz kayıtlı adresiniz yok</h2>
              <p className="text-muted-foreground mb-6 text-center">
                Hızlı teslimat için adresinizi kaydedin
              </p>
              <Button onClick={handleAddNewAddress}>İlk Adresimi Ekle</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <Card key={address._id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{address.title}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Varsayılan
                        </span>
                      )}
                    </div>
                    <div className="text-sm space-y-1 text-muted-foreground mb-4">
                      <p className="font-medium text-foreground">{address.fullName}</p>
                      <p>{address.phone}</p>
                      <p>{address.address}</p>
                      <p>{address.district}, {address.city}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditAddress(address)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Button>
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleSetDefault(address._id!)}
                        >
                          <StarOff className="h-4 w-4 mr-1" />
                          Varsayılan Yap
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(address._id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="py-6">
        <CardHeader>
          <CardTitle>Adres Bilgisi</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Kayıtlı adresleriniz checkout sırasında otomatik olarak seçilebilir.
            Varsayılan adresiniz ilk olarak gösterilir.
          </p>
        </CardContent>
      </Card>

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
