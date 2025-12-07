'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
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
import { Package, Eye, ShoppingBag, MapPin, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
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

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any; icon: any; color: string }> = {
      pending: { 
        label: 'Beklemede', 
        variant: 'secondary', 
        icon: Clock,
        color: 'text-gray-600 dark:text-gray-400'
      },
      hazırlanıyor: { 
        label: 'Hazırlanıyor', 
        variant: 'default', 
        icon: Loader2,
        color: 'text-blue-600 dark:text-blue-400'
      },
      kargolandı: { 
        label: 'Kargoda', 
        variant: 'default', 
        icon: Package,
        color: 'text-purple-600 dark:text-purple-400'
      },
      teslim_edildi: { 
        label: 'Teslim Edildi', 
        variant: 'default' as any, 
        icon: CheckCircle2,
        color: 'text-green-600 dark:text-green-400'
      },
      iptal: { 
        label: 'İptal', 
        variant: 'destructive', 
        icon: XCircle,
        color: 'text-red-600 dark:text-red-400'
      },
    };

    return statusMap[status] || { 
      label: status, 
      variant: 'secondary', 
      icon: Clock,
      color: 'text-gray-600 dark:text-gray-400'
    };
  };

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Siparişlerim</h1>
          <p className="text-muted-foreground mt-1">
            Geçmiş siparişlerinizi görüntüleyin ve takip edin
          </p>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Henüz siparişiniz yok</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Alışverişe başlayın ve siparişlerinizi buradan takip edin
            </p>
            <Button size="lg" asChild>
              <a href="/">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Alışverişe Başla
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Siparişlerim</h1>
        <p className="text-muted-foreground mt-1">
          Toplam {orders.length} sipariş bulundu
        </p>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <Card 
              key={order._id} 
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  {/* Order Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold">#{order.orderNumber}</p>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Amount and Action */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Toplam Tutar</p>
                      <p className="text-2xl font-bold text-primary">
                        {order.totalAmount.toLocaleString('tr-TR')} ₺
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Items Summary */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{order.items.length} ürün</span>
                  </div>
                  
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
                        <DialogTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Sipariş Detayı - #{order.orderNumber}
                        </DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-6">
                          {/* Status */}
                          <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm font-medium mb-2">Sipariş Durumu</p>
                            <div className="flex items-center gap-3">
                              <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                              {getStatusBadge(selectedOrder.status)}
                            </div>
                          </div>

                          {/* Items */}
                          <div>
                            <p className="text-sm font-medium mb-3 flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              Ürünler
                            </p>
                            <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                              {selectedOrder.items.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between items-start text-sm">
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      {item.product?.name || 'Ürün'}
                                    </p>
                                    {item.variant && (
                                      <p className="text-xs text-muted-foreground">
                                        {item.variant.name}
                                      </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                      Adet: {item.quantity}
                                    </p>
                                  </div>
                                  <span className="font-medium">
                                    {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Address */}
                          {selectedOrder.shippingAddress && (
                            <div>
                              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Teslimat Adresi
                              </p>
                              <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-1">
                                <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                                <p className="text-muted-foreground">{selectedOrder.shippingAddress.address}</p>
                                <p className="text-muted-foreground">
                                  {selectedOrder.shippingAddress.city}
                                  {selectedOrder.shippingAddress.postalCode && 
                                    `, ${selectedOrder.shippingAddress.postalCode}`
                                  }
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Total */}
                          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold">Toplam Tutar</span>
                              <span className="text-2xl font-bold text-primary">
                                {selectedOrder.totalAmount.toLocaleString('tr-TR')} ₺
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
