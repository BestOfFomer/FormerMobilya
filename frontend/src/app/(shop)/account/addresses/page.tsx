'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function AddressesPage() {
  // TODO: Fetch addresses from API when user address management is implemented
  const addresses: any[] = [];

  return (
    <div className="space-y-6">
      <Card className="py-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Kayıtlı Adreslerim</CardTitle>
            <Button disabled>Yeni Adres Ekle</Button>
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
              <Button disabled>İlk Adresimi Ekle</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <Card key={address.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{address.title}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Varsayılan
                        </span>
                      )}
                    </div>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>{address.fullName}</p>
                      <p>{address.address}</p>
                      <p>{address.city}, {address.postalCode}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        Düzenle
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Sil
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
    </div>
  );
}
