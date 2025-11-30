'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import type { ProductVariant } from '@/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  basePrice: number;
}

export function VariantSelector({
  variants,
  selectedIndex,
  onSelect,
  basePrice,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Varyantlar</h3>
        {selectedIndex !== null && variants[selectedIndex] && (
          <span className="text-sm text-muted-foreground">
            Seçili: {variants[selectedIndex].name}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {variants.map((variant, index) => {
          const isSelected = selectedIndex === index;
          const isOutOfStock = variant.stock === 0;
          const price = basePrice + (variant.priceModifier || 0);

          return (
            <button
              key={index}
              onClick={() => !isOutOfStock && onSelect(index)}
              disabled={isOutOfStock}
              className={cn(
                'relative p-4 rounded-lg border-2 transition-all text-left',
                'hover:shadow-md disabled:cursor-not-allowed',
                isSelected && !isOutOfStock &&
                  'border-primary bg-primary/5 shadow-md',
                !isSelected && !isOutOfStock &&
                  'border-border hover:border-primary/50',
                isOutOfStock &&
                  'border-muted bg-muted/50 opacity-60'
              )}
            >
              {/* Selection Indicator */}
              {isSelected && !isOutOfStock && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}

              {/* Variant Name */}
              <div className="font-semibold mb-2">
                {variant.name}
              </div>

              {/* Options */}
              {variant.options && variant.options.length > 0 && (
                <div className="text-sm text-muted-foreground mb-2">
                  {variant.options.map((opt) => opt.values.join(', ')).join(' • ')}
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-2">
                {isOutOfStock ? (
                  <Badge variant="destructive" className="text-xs">
                    Tükendi
                  </Badge>
                ) : variant.stock < 5 ? (
                  <Badge variant="secondary" className="text-xs">
                    Son {variant.stock} adet
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Stokta var
                  </Badge>
                )}
              </div>

              {/* Price Modifier */}
              {variant.priceModifier && variant.priceModifier !== 0 && (
                <div className="text-sm font-medium text-primary">
                  {variant.priceModifier > 0 ? '+' : ''}
                  {variant.priceModifier.toLocaleString('tr-TR')} ₺
                </div>
              )}

              {/* Total Price for this variant */}
              <div className="text-xs text-muted-foreground mt-1">
                Toplam: {price.toLocaleString('tr-TR')} ₺
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
