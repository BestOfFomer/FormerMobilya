'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import type { Category, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shop/ProductCard';
import { useRef } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  const fetchCategoriesAndProducts = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await api.categories.getAll() as any;
      const cats = categoriesResponse.categories || [];
      setCategories(cats);

      // Fetch products for each category
      const productsMap: Record<string, Product[]> = {};
      
      for (const cat of cats) {
        const productsResponse = await api.products.getAll({
          category: cat._id,
          limit: '8',
        }) as any;
        productsMap[cat._id] = productsResponse.products || [];
      }
      
      setCategoryProducts(productsMap);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -left-20 bottom-20 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Tüm Koleksiyonlar
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Kategorilerimizi Keşfedin
            </h1>
            <p className="mt-4 text-lg text-gray-200 md:text-xl">
              Her kategoride özenle seçilmiş, kaliteli mobilyalar. Evinizin her köşesi için mükemmel çözümler.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap items-center gap-8 text-white">
              <div>
                <div className="text-3xl font-bold">{categories.length}</div>
                <div className="text-sm text-gray-300">Kategori</div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <div className="text-3xl font-bold">
                  {Object.values(categoryProducts).reduce((sum, products) => sum + products.length, 0)}+
                </div>
                <div className="text-sm text-gray-300">Ürün</div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <div className="text-3xl font-bold">%100</div>
                <div className="text-sm text-gray-300">Kalite Garantisi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Sections with Horizontal Scroll */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Henüz kategori yok.</p>
          </div>
        ) : (
          categories.map((category) => (
            <CategoryRow
              key={category._id}
              category={category}
              products={categoryProducts[category._id] || []}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Category Row Component with Horizontal Scroll
function CategoryRow({ category, products }: { category: Category; products: Product[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="space-y-4">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Category Image */}
          {category.image && (
            <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          
          {/* Category Info */}
          <div>
            <h2 className="text-2xl font-bold">{category.name}</h2>
            {category.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* View All Button */}
        <Button asChild variant="outline" className="hidden sm:flex">
          <Link href={`/categories/${category.slug}`}>
            Tümünü Gör
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Products Horizontal Scroll */}
      <div className="relative group">
        {/* Scroll Buttons - Desktop Only */}
        {products.length > 3 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
          style={{ scrollbarWidth: 'thin' }}
        >
          {products.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">Bu kategoride henüz ürün yok.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-64">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile View All Button */}
      <Button asChild variant="outline" className="w-full sm:hidden">
        <Link href={`/categories/${category.slug}`}>
          Tümünü Gör
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}
