'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ArrowRight, Grid3x3 } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  // Take first 4 categories for the bento grid (1 large + 3 small)
  const displayCategories = categories.slice(0, 4);

  return (
    <section className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Kategoriler</h2>
        <p className="mt-2 text-muted-foreground">
          İhtiyacınıza uygun mobilya kategorisini keşfedin
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-4 gap-4 md:grid-rows-2">
        {displayCategories.map((category, index) => {
          // First category is large (2x2)
          const isLarge = index === 0;
          
          return (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className={cn(
                'group relative overflow-hidden rounded-xl border bg-muted transition-all hover:shadow-xl',
                isLarge ? 'col-span-4 row-span-2 h-[25rem] md:col-span-2' : 'col-span-2 h-48 md:col-span-1'
              )}
            >
              {/* Image */}
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all group-hover:from-black/90" />

              {/* Content - relative positioning for stacking */}
              <div className="absolute inset-x-0 bottom-0 p-6 overflow-hidden">
                {/* Title - starts lower (shifted down), moves up on hover */}
                <h3 className={cn(
                  'font-bold text-white transition-all duration-800 ease-out',
                  isLarge ? 'text-3xl md:text-4xl' : 'text-xl',
                  'translate-y-2 group-hover:translate-y-0'
                )}>
                  {category.name}
                </h3>
                
                {/* Description - in same position as title but hidden, appears when title moves up */}
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

                {/* Arrow indicator - also appears in same position */}
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
        })}

        {/* View All Categories Button - 5th Item */}
        <Link
          href="/categories"
          className="group relative col-span-2 h-48 overflow-hidden rounded-xl border bg-muted transition-all hover:shadow-xl md:col-span-1"
        >
          {/* Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"
            alt="Tüm Kategoriler"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Overlay - Slightly darker for emphasis */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 transition-all group-hover:from-black/95" />

          {/* Content */}
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

            {/* Arrow indicator */}
            <div className="flex items-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
              <span className="text-xs">Görüntüle</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
