'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight, Grid3x3 } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  const categoryCount = Math.min(categories.length, 4);

  // Helper to get full image URL
  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder-category.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return `${apiUrl}${url}`;
  };

  const renderCategoryCard = (category: Category, isLarge: boolean = false, className: string = '') => (
    <Link
      key={category._id}
      href={`/categories/${category.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-muted transition-all hover:shadow-xl',
        className
      )}
    >
      {/* Image */}
      {category.image && (
        <img
          src={getImageUrl(category.image)}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all group-hover:from-black/90" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 overflow-hidden">
        <h3 className={cn(
          'font-bold text-white transition-all duration-800 ease-out',
          isLarge ? 'text-3xl md:text-4xl' : 'text-xl',
          'translate-y-2 group-hover:translate-y-0'
        )}>
          {category.name}
        </h3>
        
        {category.description && (
          <div className={cn(
            'transition-all duration-500 ease-out',
            'opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-20'
          )}>
            <p className={cn(
              'mt-2 text-gray-200',
              isLarge ? 'text-base line-clamp-2' : 'text-sm line-clamp-1'
            )}>
              {category.description}
            </p>
          </div>
        )}

        <div className={cn(
          'mt-3 flex items-center gap-2 text-white transition-all duration-500 ease-out',
          'opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-10'
        )}>
          <span className={cn(isLarge ? 'text-sm' : 'text-xs')}>Keşfet</span>
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );

  const renderViewAllButton = (className: string = '') => (
    <Link
      href="/categories"
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-muted transition-all hover:shadow-xl',
        className
      )}
    >
      <img
        src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"
        alt="Tüm Kategoriler"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 transition-all group-hover:from-black/95" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all group-hover:bg-white/30 group-hover:scale-110">
          <Grid3x3 className="h-7 w-7 text-white" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-white">
            Tüm Kategoriler
          </h3>
          <p className="mt-1 text-sm text-gray-300">
            Daha fazla keşfedin
          </p>
        </div>

        <div className="flex items-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="text-xs">Görüntüle</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );

  return (
    <section className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Kategoriler</h2>
        <p className="mt-2 text-muted-foreground">
          İhtiyacınıza uygun mobilya kategorisini keşfedin
        </p>
      </div>

      {/* Layout: 1 Category */}
      {categoryCount === 1 && (
        <div className="grid grid-cols-12 gap-4">
          {renderCategoryCard(categories[0], true, 'col-span-12 md:col-span-8 h-[25rem]')}
          {renderViewAllButton('col-span-12 md:col-span-4 h-48 md:h-[25rem]')}
        </div>
      )}

      {/* Layout: 2 Categories */}
      {categoryCount === 2 && (
        <div className="grid grid-cols-4 gap-4 md:grid-rows-2">
          {renderCategoryCard(categories[0], true, 'col-span-4 row-span-2 h-[25rem] md:col-span-2')}
          {renderCategoryCard(categories[1], false, 'col-span-4 h-48 md:col-span-2 md:h-auto')}
          {renderViewAllButton('col-span-4 h-48 md:col-span-2 md:h-auto')}
        </div>
      )}

      {/* Layout: 3 Categories */}
      {categoryCount === 3 && (
        <div className="grid grid-cols-4 gap-4 md:grid-rows-2">
          {renderCategoryCard(categories[0], true, 'col-span-4 row-span-2 h-[25rem] md:col-span-2')}
          {renderCategoryCard(categories[1], false, 'col-span-4 h-48 md:col-span-2 md:h-auto')}
          {renderCategoryCard(categories[2], false, 'col-span-2 h-48 md:col-span-1 md:h-auto')}
          {renderViewAllButton('col-span-2 h-48 md:col-span-1 md:h-auto')}
        </div>
      )}

      {/* Layout: 4+ Categories (existing design) */}
      {categoryCount >= 4 && (
        <div className="grid grid-cols-4 gap-4 md:grid-rows-2">
          {renderCategoryCard(categories[0], true, 'col-span-4 row-span-2 h-[25rem] md:col-span-2')}
          {categories.slice(1, 4).map((category) => 
            renderCategoryCard(category, false, 'col-span-2 h-48 md:col-span-1 md:h-auto')
          )}
          {renderViewAllButton('col-span-2 h-48 md:col-span-1 md:h-auto')}
        </div>
      )}
    </section>
  );
}
