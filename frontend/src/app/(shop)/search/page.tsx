'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductFilters, type FilterState } from '@/components/shop/ProductFilters';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import type { Product } from '@/types';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    materials: [],
    inStockOnly: false,
  });

  const availableMaterials = Array.from(
    new Set(products.flatMap((p) => p.materials || []))
  );

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    } else {
      setIsLoading(false);
    }
  }, [query, sortBy, filters]);

  const fetchSearchResults = async () => {
    setIsLoading(true);
    try {
      const queryParams: Record<string, string> = {
        search: query,
      };

      if (sortBy) {
        queryParams.sort = sortBy;
      }

      if (filters.inStockOnly) {
        queryParams.active = 'true';
      }

      if (filters.priceRange[0] > 0) {
        queryParams.minPrice = filters.priceRange[0].toString();
      }

      if (filters.priceRange[1] < 50000) {
        queryParams.maxPrice = filters.priceRange[1].toString();
      }

      const response = await api.products.getAll(queryParams) as any;
      let filteredProducts = response.products || [];

      // Client-side material filtering
      if (filters.materials.length > 0) {
        filteredProducts = filteredProducts.filter((p: Product) =>
          p.materials?.some((m) => filters.materials.includes(m))
        );
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value === 'default' ? '' : value);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Arama yapın</h1>
          <p className="text-muted-foreground">
            Aramak istediğiniz ürünü yukarıdaki arama kutusuna yazın
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">
            "{query}" için arama sonuçları
          </h1>
          <p className="mt-2 text-muted-foreground">
            {products.length} ürün bulundu
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters - Desktop */}
          <aside className="hidden lg:block">
            <ProductFilters
              onFilterChange={handleFilterChange}
              availableMaterials={availableMaterials}
            />
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Filter & Sort Bar */}
            <div className="flex items-center justify-between">
              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtreler
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <ProductFilters
                    onFilterChange={handleFilterChange}
                    availableMaterials={availableMaterials}
                  />
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy || 'default'} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Varsayılan</SelectItem>
                  <SelectItem value="-createdAt">Yeniden Eskiye</SelectItem>
                  <SelectItem value="createdAt">Eskiden Yeniye</SelectItem>
                  <SelectItem value="basePrice">Fiyat: Düşükten Yükseğe</SelectItem>
                  <SelectItem value="-basePrice">Fiyat: Yüksekten Düşüğe</SelectItem>
                  <SelectItem value="name">İsim: A-Z</SelectItem>
                  <SelectItem value="-name">İsim: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center">
                <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">Sonuç bulunamadı</h2>
                <p className="text-muted-foreground mb-6">
                  "{query}" için ürün bulunamadı. Farklı bir arama terimi deneyin.
                </p>
                <Button asChild>
                  <Link href="/">Ana Sayfaya Dön</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
          ))}
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
