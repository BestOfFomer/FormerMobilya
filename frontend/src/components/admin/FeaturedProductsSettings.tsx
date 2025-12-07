'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface FeaturedProductsSettingsProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function FeaturedProductsSettings({ selectedIds, onChange }: FeaturedProductsSettingsProps) {
  const { accessToken } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectKey, setSelectKey] = useState(0); // Key to reset Select

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!accessToken) return;
        const response = await api.products.getAll() as any;
        setProducts(response.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Ürünler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [accessToken]);

  const handleAddProduct = (productId: string) => {
    if (selectedIds.length >= 4) {
      toast.error('En fazla 4 ürün seçebilirsiniz');
      return;
    }
    if (!selectedIds.includes(productId)) {
      onChange([...selectedIds, productId]);
      setSelectKey(prev => prev + 1); // Reset Select
      toast.success('Ürün eklendi');
    }
  };

  const handleRemoveProduct = (productId: string) => {
    onChange(selectedIds.filter(id => id !== productId));
    toast.success('Ürün kaldırıldı');
  };

  const getProduct = (id: string) => {
    return products.find(p => p._id === id);
  };

  const availableProducts = products.filter(p => !selectedIds.includes(p._id));

  return (
    <Card className="py-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Öne Çıkan Ürünler</CardTitle>
            <CardDescription className="mt-1.5">
              Ana sayfada öne çıkacak ürünleri seçin (maksimum 4)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
              {selectedIds.length}
            </div>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">4</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Product Section - Always on top */}
        {selectedIds.length < 4 && (
          <div className="space-y-3">
            <Label htmlFor="add-product" className="text-base font-semibold">
              Yeni Ürün Ekle
            </Label>
            {loading ? (
              <div className="flex items-center gap-2 p-4 border rounded-lg bg-muted/30">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <p className="text-sm text-muted-foreground">Ürünler yükleniyor...</p>
              </div>
            ) : availableProducts.length === 0 ? (
              <div className="p-4 border rounded-lg bg-muted/30 text-center">
                <p className="text-sm text-muted-foreground">
                  {products.length === 0 
                    ? 'Henüz ürün eklenmemiş' 
                    : 'Tüm ürünler zaten seçildi'}
                </p>
              </div>
            ) : (
              <Select key={selectKey} onValueChange={handleAddProduct}>
                <SelectTrigger id="add-product" className="h-12">
                  <SelectValue placeholder="Ürün seçmek için tıklayın..." />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {product.basePrice?.toLocaleString('tr-TR')} ₺
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Selected Products Grid */}
        {selectedIds.length > 0 ? (
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Seçili Ürünler
            </Label>
            <div className="grid gap-3 md:grid-cols-2">
              {selectedIds.map((id, index) => {
                const product = getProduct(id);
                if (!product) return null;
                
                return (
                  <div
                    key={id}
                    className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-md transition-all"
                  >
                    {/* Product Card */}
                    <div className="flex gap-3 p-3">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm">
                          {index + 1}
                        </div>
                      </div>

                      {/* Product Image */}
                      {product.images?.[0] && (
                        <div className="flex-shrink-0">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {product.basePrice?.toLocaleString('tr-TR')} ₺
                        </p>
                      </div>

                      {/* Remove Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveProduct(id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <svg className="mx-auto h-12 w-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="font-medium">Henüz öne çıkan ürün seçilmedi</p>
            <p className="text-sm mt-1">Yukarıdan ürün ekleyerek başlayın</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
