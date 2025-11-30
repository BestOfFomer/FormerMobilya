'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  const subtotal = getTotal();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = subtotal > 5000 ? 0 : 50; // Free shipping over 5000 TL
  const total = subtotal + shippingCost;

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
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sepetiniz Boş</h2>
            <p className="text-muted-foreground mb-6">
              Sepetinize henüz ürün eklemediniz
            </p>
            <Button asChild>
              <Link href="/">Alışverişe Başla</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Sepetim ({itemCount} Ürün)</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={`${item.productId}-${item.variantId || 'default'}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded border">
                      {item.product?.images?.[0] && (
                        <Image
                          src={getImageUrl(item.product.images[0])}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="rounded object-cover"
                          unoptimized
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product?.slug}`}
                        className="font-semibold hover:text-primary line-clamp-2"
                      >
                        {item.product?.name}
                      </Link>
                      {item.variant?.name && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Varyant: {item.variant.name}
                        </p>
                      )}
                      <p className="text-sm font-medium mt-2">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId, item.variantId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-2 border rounded">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.variantId)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.variantId)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="font-bold">{formatPrice(item.totalPrice)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" asChild>
              <Link href="/">Alışverişe Devam Et</Link>
            </Button>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Sipariş Özeti</h2>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kargo</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Ücretsiz' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {subtotal < 5000 && (
                    <p className="text-xs text-muted-foreground">
                      5.000 TL ve üzeri alışverişlerde kargo ücretsiz
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Toplam</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">Ödemeye Geç</Link>
                </Button>

                <div className="rounded-lg bg-muted p-4 text-sm">
                  <h3 className="font-semibold mb-2">Güvenli Alışveriş</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ Güvenli ödeme</li>
                    <li>✓ Ücretsiz teslimat & montaj</li>
                    <li>✓ 14 gün iade garantisi</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
