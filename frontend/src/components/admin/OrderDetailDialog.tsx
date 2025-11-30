'use client';

import type { Order } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  if (!order) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sipariş Detayı</DialogTitle>
          <DialogDescription>
            Sipariş No: <strong>{order.orderNumber}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status & Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sipariş Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarih:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ödeme Yöntemi:</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ödeme Durumu:</span>
                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                    {order.paymentStatus === 'paid' ? 'Ödendi' : 
                     order.paymentStatus === 'pending' ? 'Beklemede' :
                     order.paymentStatus === 'failed' ? 'Başarısız' : 'İade Edildi'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sipariş Durumu:</span>
                  <Badge>
                    {order.orderStatus === 'pending' ? 'Beklemede' :
                     order.orderStatus === 'hazırlanıyor' ? 'Hazırlanıyor' :
                     order.orderStatus === 'kargolandı' ? 'Kargolandı' :
                     order.orderStatus === 'teslim_edildi' ? 'Teslim Edildi' : 'İptal'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Müşteri Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground block">Ad Soyad:</span>
                  <span className="font-medium">
                    {typeof order.user === 'object' ? order.user.name : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">E-posta:</span>
                  <span className="font-medium">
                    {typeof order.user === 'object' ? order.user.email : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Teslimat Adresi</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
              <p className="text-muted-foreground">{order.shippingAddress.address}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.district}, {order.shippingAddress.city}
              </p>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sipariş Ürünleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-start gap-4">
                      {item.productImage && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${item.productImage}`}
                          alt={item.productName}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{item.productName}</h4>
                        {item.variantName && (
                          <p className="text-sm text-muted-foreground">
                            Varyant: {item.variantName}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Adet: {item.quantity} × {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.totalPrice)}
                      </div>
                    </div>
                    {index < order.items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ara Toplam:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kargo:</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Toplam:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.orderNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sipariş Notu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.orderNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
