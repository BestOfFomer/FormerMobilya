'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, X } from 'lucide-react';

export function CartSheet() {
  const { items, removeItem, getTotal, closeCartSheet } = useCartStore();

  const total = getTotal();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Handle image URL - check if it's already absolute
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
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Sepetiniz boş</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-4">Sepetim ({itemCount} Ürün)</h2>
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId || 'default'}`}
            className="flex gap-3 relative"
          >
            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6"
              onClick={() => removeItem(item.productId, item.variantId)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Image */}
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border">
              {item.product?.images?.[0] && (
                <Image
                  src={getImageUrl(item.product.images[0])}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.product?.slug}`}
                className="text-sm font-medium hover:text-primary line-clamp-2"
              >
                {item.product?.name}
              </Link>
              {item.variant?.name && (
                <p className="text-xs text-muted-foreground mt-1">
                  {item.variant.name}
                </p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Adet: {item.quantity}
                </span>
                <span className="text-sm font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t p-6 mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Ara Toplam</span>
          <span className="text-lg font-bold">{formatPrice(total)}</span>
        </div>

        <Separator />

        <div className="space-y-2">
          <Button size="lg" className="w-full" asChild>
            <Link href="/cart" onClick={closeCartSheet}>Sepete Git</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link href="/checkout" onClick={closeCartSheet}>Ödemeye Geç</Link>
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Kargo ve vergiler ödeme sayfasında hesaplanır
        </p>
      </div>
    </div>
  );
}
