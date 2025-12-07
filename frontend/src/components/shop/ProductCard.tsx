'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductQuickView } from '@/components/product/ProductQuickView';
import { Eye } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);

  // Calculate display price and discount
  const displayPrice = (product.discountedPrice || product.basePrice) as number;
  const discount = product.discountedPrice 
    ? Math.round(((product.basePrice - product.discountedPrice) / product.basePrice) * 100)
    : 0;

  // Handle image URL - check if it's already absolute
  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url; // Already absolute URL (e.g., Unsplash)
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`; // Relative URL from backend
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Link href={`/products/${product.slug}`} className="group">
        <Card className="overflow-hidden transition-all hover:shadow-lg">
          <CardContent className="p-0">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={getImageUrl(product.images?.[0])}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                unoptimized
              />
              
              {/* Badges */}
              <div className="absolute left-2 top-2 flex flex-col gap-2">
                {!product.active && (
                  <Badge variant="secondary">Stokta Yok</Badge>
                )}
                {discount > 0 && (
                  <Badge variant="destructive">%{discount} İndirim</Badge>
                )}
                {product.featured && (
                  <Badge className="bg-yellow-500">Öne Çıkan</Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              
              {/* Category */}
              {product.category && typeof product.category === 'object' && product.category.name && (
                <p className="text-xs text-muted-foreground">
                  {product.category.name}
                </p>
              )}

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {formatPrice(displayPrice)}
                </span>
                  {discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.basePrice)}
                    </span>
                  )}
              </div>

              {/* Quick View Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickView(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Hızlı İncele
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Quick View Modal */}
      <ProductQuickView
        product={product}
        open={showQuickView}
        onOpenChange={setShowQuickView}
      />
    </>
  );
}
