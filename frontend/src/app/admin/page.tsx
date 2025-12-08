'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Product } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AdminChart } from '@/components/admin/AdminChart';
import { Package, Layers, ShoppingCart, Wallet, TrendingUp, ArrowUpRight } from 'lucide-react';
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
          {getGreeting()}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Products - Emerald/Green */}
        <Card className="relative overflow-hidden border-emerald-200 dark:border-emerald-900/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-[1.02] group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl group-hover:from-emerald-500/20 transition-all" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Toplam Ürün
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              Aktif ürünler
            </p>
          </CardContent>
        </Card>

        {/* Total Categories - Blue */}
        <Card className="relative overflow-hidden border-blue-200 dark:border-blue-900/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:from-blue-500/20 transition-all" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Toplam Kategori
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Layers className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalCategories}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-500" />
              Ana ve alt kategoriler
            </p>
          </CardContent>
        </Card>

        {/* Pending Orders - Purple */}
        <Card className="relative overflow-hidden border-purple-200 dark:border-purple-900/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">
              Bekleyen Sipariş
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-purple-500" />
              İşlenmesi gereken
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue - Amber */}
        <Card className="relative overflow-hidden border-amber-200 dark:border-amber-900/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:scale-[1.02] group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl group-hover:from-amber-500/20 transition-all" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">
              Toplam Gelir
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
              <Wallet className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {formatPrice(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-amber-500" />
              Tüm zamanlar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      <AdminChart data={[]} />

      {/* Recent Products */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Son Eklenen Ürünler</CardTitle>
              <CardDescription className="mt-1">
                En son eklenen 5 ürün
              </CardDescription>
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Henüz ürün eklenmemiş
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-200 group"
                >
                  <div className="relative">
                    {product.images?.[0] ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
 <div className="absolute -top-1 -left-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {typeof product.category === 'object' ? product.category.name : '-'}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="font-bold text-sm">
                      {formatPrice(product.effectivePrice || product.basePrice)}
                    </p>
                    <Badge 
                      variant={product.active ? 'default' : 'secondary'} 
                      className={`text-xs ${
                        product.active 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
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
