'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus, ShoppingCart, Heart, Share2, Package } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { ProductGallery } from '@/components/product/ProductGallery';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ProductTabs } from '@/components/product/ProductTabs';
import { ProductCard } from '@/components/shop/ProductCard';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [resolvedParams.slug]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const productsResponse = await api.products.getAll() as any;
      const foundProduct = productsResponse.products?.find(
        (p: Product) => p.slug === resolvedParams.slug
      );
      
      if (!foundProduct) {
        throw new Error('Product not found');
      }

      setProduct(foundProduct);

      // Fetch similar products
      if (typeof foundProduct.category === 'object') {
        const similarResponse = await api.products.getAll({
          category: foundProduct.category._id,
          limit: '4',
        }) as any;
        
        const similar = (similarResponse.products || []).filter(
          (p: Product) => p._id !== foundProduct._id
        );
        setSimilarProducts(similar);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Ürün bulunamadı');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Check if variant selection is required
    if (product.variants && product.variants.length > 0 && selectedVariant === null) {
      toast.error('Lütfen bir varyant seçin');
      return;
    }

    const variant = selectedVariant !== null ? product.variants?.[selectedVariant] : undefined;

    addItem({
      productId: product._id,
      product: product,
      variantId: variant ? `${selectedVariant}` : undefined,
      variant: variant,
      quantity,
      price: product.effectivePrice || product.basePrice,
    });

    toast.success('Ürün sepete eklendi');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const hasDiscount = product.discountedPrice && product.discountedPrice < product.basePrice;
  const displayPrice = hasDiscount && product.discountedPrice ? product.discountedPrice : product.basePrice;
  const images = product.images?.map(getImageUrl) || [getImageUrl()];

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            {typeof product.category === 'object' && (
              <>
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Image Gallery */}
          <div>
            <ProductGallery 
              images={images} 
              productName={product.name}
              model3D={product.model3D}
              dimensions={product.dimensions}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Title & SKU */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>SKU: {product.sku}</span>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant={product.stock && product.stock > 0 ? 'default' : 'destructive'}>
                  {product.stock && product.stock > 0 ? 'Stokta Var' : 'Tükendi'}
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                )}
              </div>
              {hasDiscount && product.discountedPrice && (
                <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-medium">
                  <Package className="w-4 h-4" />
                  %{Math.round((1 - product.discountedPrice / product.basePrice) * 100)} İndirim
                </div>
              )}
            </div>

            <Separator />

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <>
                <VariantSelector
                  variants={product.variants}
                  selectedIndex={selectedVariant}
                  onSelect={setSelectedVariant}
                  basePrice={displayPrice}
                />
                <Separator />
              </>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Adet</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.totalStock || quantity >= product.totalStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {product.totalStock && product.totalStock < 10 && product.totalStock > 0 && (
                  <span className="text-sm text-muted-foreground">
                    Son {product.totalStock} adet
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.active || (product.variants && product.variants.length > 0 && selectedVariant === null)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {!product.active 
                  ? 'Tükendi' 
                  : (product.variants && product.variants.length > 0 && selectedVariant === null)
                    ? 'Varyant Seçin'
                    : 'Sepete Ekle'
                }
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Info */}
            <div className="border rounded-lg p-4 bg-muted/30 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span>Ücretsiz kargo (5.000 ₺ ve üzeri)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span>14 gün içinde ücretsiz iade</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span>2 yıl garanti</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="mt-12">
          <ProductTabs
            description={product.description}
            materials={product.materials}
            dimensions={product.dimensions}
          />
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct._id} product={similarProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
