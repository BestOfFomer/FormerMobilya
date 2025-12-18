'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';
import { Eye, ShoppingCart, ExternalLink, ChevronLeft, ChevronRight, Box } from 'lucide-react';
import type { Product } from '@/types';

interface ProductQuickViewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Extract iframe src from Sketchfab embed HTML
  const extractSketchfabSrc = (embedHtml: string): string | null => {
    const match = embedHtml.match(/src="([^"]+)"/i);
    return match ? match[1] : null;
  };

  const sketchfabSrc = product.sketchfabEmbed ? extractSketchfabSrc(product.sketchfabEmbed) : null;
  
  // Calculate total slides
  const has3D = !!product.model3D;
  const hasSketchfab = !!sketchfabSrc;
  const totalSlides = (product.images?.length || 0) + (has3D ? 1 : 0) + (hasSketchfab ? 1 : 0);

  // Calculate display price and discount
  const displayPrice = (product.discountedPrice || product.basePrice) as number;
  const discount = product.discountedPrice 
    ? Math.round(((product.basePrice - product.discountedPrice) / product.basePrice) * 100)
    : 0;

  // Handle image URL
  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      product: product,
      quantity: quantity,
      price: displayPrice,
    });
    onOpenChange(false);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => 
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => 
      prev === totalSlides - 1 ? 0 : prev + 1
    );
  };

  // Determine what to display
  const isModel3DSlide = has3D && selectedImage === (product.images?.length || 0);
  const isSketchfabSlide = hasSketchfab && selectedImage === (product.images?.length || 0) + (has3D ? 1 : 0);
  const hasMultipleSlides = totalSlides > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">Ürün Hızlı Görünüm</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 min-w-0">
          {/* Image Gallery - Top */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted group">
              {isSketchfabSlide ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <iframe
                    src={sketchfabSrc!}
                    title="Sketchfab 3D Model"
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    allowFullScreen
                  />
                </div>
              ) : isModel3DSlide ? (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-gray-700">
                  <div className="text-white text-center">
                    <Box className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">3D Model Available</p>
                    <p className="text-xs text-gray-400 mt-2">View on product page</p>
                  </div>
                </div>
              ) : (
                <Image
                  src={getImageUrl(product.images?.[selectedImage])}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                  unoptimized
                />
              )}
              
              {/* Navigation Chevrons */}
              {hasMultipleSlides && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                    aria-label="Önceki görsel"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                    aria-label="Sonraki görsel"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              
              {/* Badges */}
              <div className="absolute left-2 top-2 flex flex-wrap gap-2">
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

            {/* Thumbnail Images */}
            {hasMultipleSlides && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-w-full">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </button>
                ))}
                {has3D && (
                  <button
                    onClick={() => setSelectedImage(product.images?.length || 0)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all flex items-center justify-center bg-muted ${
                      isModel3DSlide
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Box className="w-8 h-8 text-primary" />
                  </button>
                )}
                {hasSketchfab && (
                  <button
                    onClick={() => setSelectedImage((product.images?.length || 0) + (has3D ? 1 : 0))}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 ${
                      isSketchfabSlide
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.77l7 3.5v7.46l-7-3.5V9.77zm16 7.46l-7 3.5v-7.46l7-3.5v7.46z"/>
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Info - Bottom */}
          <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Category */}
                {typeof product.category === 'object' && (
                  <p className="text-sm text-muted-foreground">
                    {product.category.name}
                  </p>
                )}

                {/* Product Name */}
                <h2 className="text-2xl font-bold">{product.name}</h2>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(displayPrice)}
                  </span>
                  {discount > 0 && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.basePrice)}
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground line-clamp-3">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Materials */}
                {product.materials && product.materials.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Malzemeler</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map((material, index) => (
                        <Badge key={index} variant="outline">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                {product.active && (
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold">Adet:</label>
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 hover:bg-muted transition-colors"
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <span className="px-4 py-1 min-w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {!product.active ? (
                    <Button size="lg" className="w-full" disabled>
                      Stokta Yok
                    </Button>
                  ) : product.variants && product.variants.length > 0 ? (
                    <Link href={`/products/${product.slug}`} onClick={() => onOpenChange(false)}>
                      <Button size="lg" className="w-full">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Varyant Seçin
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Sepete Ekle
                    </Button>
                  )}

                  <Link href={`/products/${product.slug}`} onClick={() => onOpenChange(false)}>
                    <Button variant="outline" size="lg" className="w-full">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Detayları Gör
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
