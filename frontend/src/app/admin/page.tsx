'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Product } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AdminChart } from '@/components/admin/AdminChart';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch products
        const productsResponse = await api.products.getAll() as any;
        const products = productsResponse.products || [];
        
        // Fetch categories
        const categoriesResponse = await api.categories.getAll() as any;
        const categories = categoriesResponse.categories || [];

        // Fetch recent products
        const recentResponse = await api.products.getAll({ limit: '5', sort: '-createdAt' }) as any;
        
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          pendingOrders: 0,
          totalRevenue: 0,
        });

        setRecentProducts(recentResponse.products || []);
      } catch (error: any) {
        toast.error('Dashboard verileri yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          FormerMobilya admin paneline hoş geldiniz
        </p>
      </div>

      {/* Analytics Chart - Will show "no data" until we have visitor data */}
      <AdminChart data={[]} />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Ürün
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              Aktif ürünler
            </p>
          </CardContent>
        </Card>

        <Card className="py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Kategori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalCategories}
            </div>
            <p className="text-xs text-muted-foreground">
              Ana ve alt kategoriler
            </p>
          </CardContent>
        </Card>

        <Card className="py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bekleyen Sipariş
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              İşlenmesi gereken
            </p>
          </CardContent>
        </Card>

        <Card className="py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Gelir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tüm zamanlar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Son Eklenen Ürünler</CardTitle>
          <CardDescription>
            En son eklenen 5 ürün
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : recentProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Henüz ürün eklenmemiş
            </p>
          ) : (
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-4">
                  {product.images?.[0] ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof product.category === 'object' ? product.category.name : '-'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(product.effectivePrice || product.basePrice)}
                    </p>
                    <Badge variant={product.active ? 'default' : 'secondary'} className="text-xs">
                      {product.active ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
