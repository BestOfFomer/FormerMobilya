'use client';

import { Suspense, use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import type { Product, Category } from '@/types';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function CategoryPageContent({ params }: CategoryPageProps) {
  // Unwrap params Promise (Next.js 15+)
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    materials: [],
    inStockOnly: false,
  });

  const productsPerPage = 12;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Get unique materials from products
  const availableMaterials = Array.from(
    new Set(products.flatMap((p) => p.materials || []))
  );

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [resolvedParams.slug, currentPage, sortBy, filters]);

  const fetchCategoryAndProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch category
      const categoryResponse = await api.categories.getAll() as any;
      const foundCategory = categoryResponse.categories?.find(
        (c: Category) => c.slug === resolvedParams.slug
      );
      setCategory(foundCategory || null);

      if (!foundCategory) return;

      // Build query params
      const queryParams: Record<string, string> = {
        category: foundCategory._id,
        page: currentPage.toString(),
        limit: productsPerPage.toString(),
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

      // Fetch products
      const productsResponse = await api.products.getAll(queryParams) as any;
      let filteredProducts = productsResponse.products || [];

      // Client-side material filtering
      if (filters.materials.length > 0) {
        filteredProducts = filteredProducts.filter((p: Product) =>
          p.materials?.some((m) => filters.materials.includes(m))
        );
      }

      setProducts(filteredProducts);
      setTotalProducts(productsResponse.total || filteredProducts.length);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value === 'default' ? '' : value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (!category && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Kategori bulunamadı</h1>
        <Button className="mt-4" asChild>
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-foreground">
              Kategoriler
            </Link>
            <span>/</span>
            <span className="text-foreground">{category?.name}</span>
          </nav>
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
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold">{category?.name}</h1>
                {category?.description && (
                  <p className="mt-2 text-muted-foreground">{category.description}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  {totalProducts} ürün bulundu
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="mr-2 h-4 w-4" />
                      Filtreler
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filtreler</SheetTitle>
                    </SheetHeader>
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
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-lg text-muted-foreground">
                  Bu kategoride ürün bulunamadı
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
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
      <CategoryPageContent params={params} />
    </Suspense>
  );
}
