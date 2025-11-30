'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Package, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Order {
  _id: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress?: any;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.orders.getAll() as any;
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      pending: { label: 'Beklemede', variant: 'secondary' },
      hazırlanıyor: { label: 'Hazırlanıyor', variant: 'default' },
      kargolandı: { label: 'Kargoda', variant: 'default' },
      teslim_edildi: { label: 'Teslim Edildi', variant: 'default' as any },
      iptal: { label: 'İptal', variant: 'destructive' },
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'secondary' };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Henüz siparişiniz yok</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Alışverişe başlayın ve siparişlerinizi buradan takip edin
          </p>
          <Button asChild>
            <a href="/">Alışverişe Başla</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Siparişlerim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-lg">#{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(order.status)}
                    <p className="font-bold">{order.totalAmount.toLocaleString('tr-TR')} ₺</p>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} ürün
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Detayları Gör
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Sipariş Detayı - #{order.orderNumber}</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-4">
                          {/* Status */}
                          <div>
                            <p className="text-sm font-medium mb-1">Sipariş Durumu</p>
                            {getStatusBadge(selectedOrder.status)}
                          </div>

                          <Separator />

                          {/* Items */}
                          <div>
                            <p className="text-sm font-medium mb-3">Ürünler</p>
                            <div className="space-y-2">
                              {selectedOrder.items.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.product?.name || 'Ürün'}
                                    {item.variant && ` - ${item.variant.name}`}
                                    {' '}x {item.quantity}
                                  </span>
                                  <span className="font-medium">
                                    {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          {/* Address */}
                          {selectedOrder.shippingAddress && (
                            <>
                              <div>
                                <p className="text-sm font-medium mb-1">Teslimat Adresi</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedOrder.shippingAddress.fullName}<br />
                                  {selectedOrder.shippingAddress.address}<br />
                                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                                </p>
                              </div>
                              <Separator />
                            </>
                          )}

                          {/* Total */}
                          <div className="flex justify-between font-bold">
                            <span>Toplam</span>
                            <span>{selectedOrder.totalAmount.toLocaleString('tr-TR')} ₺</span>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
