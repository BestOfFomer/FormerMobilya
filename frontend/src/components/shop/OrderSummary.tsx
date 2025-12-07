import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart-store';

export function OrderSummary() {
  const { items, getTotal } = useCartStore();
  
  const subtotal = getTotal();
  
  // Calculate shipping cost from all products
  const shipping = subtotal >= 5000 
    ? 0 
    : items.reduce((total, item) => {
        const productShipping = item.product?.shippingCost || 50;
        return total + productShipping;
      }, 0);
  
  const grandTotal = subtotal + shipping;

  // Handle image URL - check if it's already absolute
  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sipariş Özeti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-16 w-16 rounded bg-muted overflow-hidden">
                {item.product.images?.[0] && (
                  <Image
                src={getImageUrl(item.product?.images?.[0])}
                alt={item.product?.name || 'Product'}
                width={60}
height={60}
                className="rounded object-cover"
                unoptimized
              />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                {item.variant && (
                  <p className="text-xs text-muted-foreground">
                    {item.variant.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Adet: {item.quantity}</p>
              </div>
              <div className="text-sm font-medium">
                {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ara Toplam</span>
            <span>{subtotal.toLocaleString('tr-TR')} ₺</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kargo</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600">Ücretsiz</span>
              ) : (
                `${shipping.toLocaleString('tr-TR')} ₺`
              )}
            </span>
          </div>
          {shipping === 0 && (
            <p className="text-xs text-green-600">
              ✓ 5.000 ₺ ve üzeri siparişlerde kargo ücretsiz!
            </p>
          )}
        </div>

        <Separator />

        {/* Grand Total */}
        <div className="flex justify-between text-base font-bold">
          <span>Toplam</span>
          <span>{grandTotal.toLocaleString('tr-TR')} ₺</span>
        </div>
      </CardContent>
    </Card>
  );
}
