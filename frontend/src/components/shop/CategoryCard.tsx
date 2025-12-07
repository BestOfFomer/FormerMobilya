import Link from 'next/link';
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
    // Ensure we use the backend API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const fullUrl = `${apiUrl}${url}`;
    console.log('Category image URL:', fullUrl); // Debug
    return fullUrl;
  };

  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
        <CardContent className="p-0 relative h-full">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={getImageUrl(category.image)}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
