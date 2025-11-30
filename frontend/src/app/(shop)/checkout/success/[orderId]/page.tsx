'use client';

import { use, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

interface SuccessPageProps {
  params: Promise<{ orderId: string }>;
}

export default function CheckoutSuccessPage({ params }: SuccessPageProps) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.orders.getAll({ orderNumber: resolvedParams.orderId }) as any;
        if (response.orders && response.orders.length > 0) {
          setOrder(response.orders[0]);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [resolvedParams.orderId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Sipariş bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Success Message */}
          <div className="text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Siparişiniz Alındı!</h1>
            <p className="text-muted-foreground">
              Siparişiniz başarıyla oluşturuldu. Sipariş detaylarını e-posta adresinize gönderdik.
            </p>
          </div>

          {/* Order Number */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Sipariş Numaranız</p>
                <p className="text-2xl font-bold text-primary">{resolvedParams.orderId}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          {order && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-lg">Sipariş Özeti</h2>
                
                <div className="space-y-2">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.product?.name || 'Ürün'} 
                        {item.variant && ` - ${item.variant.name}`}
                        {' '}x {item.quantity}
                      </span>
                      <span>{(item.price * item.quantity).toLocaleString('tr-TR')} ₺</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span>{order.totalAmount?.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kargo</span>
                    <span>
                      {order.shippingCost === 0 ? 'Ücretsiz' : `${order.shippingCost} ₺`}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Toplam</span>
                  <span>{(order.totalAmount + (order.shippingCost || 0)).toLocaleString('tr-TR')} ₺</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">Sıradaki Adımlar</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Sipariş Alındı</p>
                    <p className="text-sm text-muted-foreground">
                      Siparişiniz sistemimize kaydedildi
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Hazırlanıyor</p>
                    <p className="text-sm text-muted-foreground">
                      Siparişiniz hazırlanmaya başlanacak
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Kargoda</p>
                    <p className="text-sm text-muted-foreground">
                      Ürünleriniz kargoya verilecek
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Teslim Edildi</p>
                    <p className="text-sm text-muted-foreground">
                      Tahmini teslimat: 7-14 iş günü
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/account/orders">Siparişlerime Git</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">Alışverişe Devam Et</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
