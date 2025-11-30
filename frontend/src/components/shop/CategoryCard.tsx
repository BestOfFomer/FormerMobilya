import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Handle image URL - check if it's already absolute
  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder-category.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url; // Already absolute URL
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`; // Relative URL
  };

  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
        <CardContent className="p-0 relative h-full">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={getImageUrl(category.image)}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              unoptimized
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-xl font-bold mb-1">{category.name}</h3>
              {category.description && (
                <p className="text-sm opacity-90 line-clamp-2 mb-3">
                  {category.description}
                </p>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="group-hover:bg-white group-hover:text-black transition-colors"
              >
                Ürünleri Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
