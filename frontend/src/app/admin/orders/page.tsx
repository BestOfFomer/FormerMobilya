'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api-client';
import type { Order } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import { OrderDetailDialog } from '@/components/admin/OrderDetailDialog';

const orderStatusOptions = [
  { value: 'pending', label: 'Beklemede', variant: 'secondary' as const },
  { value: 'hazırlanıyor', label: 'Hazırlanıyor', variant: 'default' as const },
  { value: 'kargolandı', label: 'Kargolandı', variant: 'default' as const },
  { value: 'teslim_edildi', label: 'Teslim Edildi', variant: 'default' as const },
  { value: 'iptal', label: 'İptal', variant: 'destructive' as const },
];

const paymentStatusOptions = [
  { value: 'pending', label: 'Beklemede', variant: 'secondary' as const },
  { value: 'paid', label: 'Ödendi', variant: 'default' as const },
  { value: 'failed', label: 'Başarısız', variant: 'destructive' as const },
  { value: 'refunded', label: 'İade Edildi', variant: 'secondary' as const },
];

export default function OrdersPage() {
  const { accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const fetchOrders = async () => {
    if (!accessToken) return;

    try {
      setIsLoading(true);
      const response = await api.orders.getAll(accessToken) as any;
      setOrders(response.orders || []);
    } catch (error: any) {
      toast.error('Siparişler yüklenemedi: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [accessToken]);

  const handleStatusChange = async (
    orderId: string,
    type: 'order' | 'payment',
    value: string
  ) => {
    if (!accessToken) return;

    try {
      const updateData = type === 'order' 
        ? { orderStatus: value }
        : { paymentStatus: value };

      await api.orders.updateStatus(orderId, updateData, accessToken);
      toast.success('Durum güncellendi');
      fetchOrders();
    } catch (error: any) {
      toast.error('Güncelleme başarısız: ' + error.message);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const getStatusBadge = (status: string, type: 'order' | 'payment') => {
    const options = type === 'order' ? orderStatusOptions : paymentStatusOptions;
    const option = options.find(opt => opt.value === status);
    return (
      <Badge variant={option?.variant || 'secondary'}>
        {option?.label || status}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Siparişler</h1>
          <p className="text-muted-foreground mt-2">
            Müşteri siparişlerini yönetin
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>Ödeme Durumu</TableHead>
              <TableHead>Sipariş Durumu</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Henüz sipariş bulunmuyor
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    {typeof order.user === 'object' ? order.user.name : 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.paymentStatus}
                      onValueChange={(value) => handleStatusChange(order._id, 'payment', value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.orderStatus}
                      onValueChange={(value) => handleStatusChange(order._id, 'order', value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
}
