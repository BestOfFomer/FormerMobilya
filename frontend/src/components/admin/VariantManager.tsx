'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit2, Image as ImageIcon } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VariantOption {
  name: string;
  values: string[];
}

interface Variant {
  name: string;
  options: VariantOption[];
  stock: number;
  priceOverride?: number;
  images?: string[];
}

interface VariantManagerProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
  disabled?: boolean;
}

export function VariantManager({ variants, onChange, disabled }: VariantManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentVariant, setCurrentVariant] = useState<Variant>({
    name: '',
    options: [],
    stock: 0,
    priceOverride: undefined,
    images: [],
  });
  const [optionName, setOptionName] = useState('');
  const [optionValues, setOptionValues] = useState('');

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      setCurrentVariant(variants[index]);
    } else {
      setEditingIndex(null);
      setCurrentVariant({
        name: '',
        options: [],
        stock: 0,
        priceOverride: undefined,
        images: [],
      });
    }
    setDialogOpen(true);
  };

  const handleAddOption = () => {
    if (!optionName.trim() || !optionValues.trim()) return;

    const values = optionValues.split(',').map(v => v.trim()).filter(Boolean);
    if (values.length === 0) return;

    setCurrentVariant({
      ...currentVariant,
      options: [
        ...currentVariant.options,
        { name: optionName.trim(), values },
      ],
    });
    setOptionName('');
    setOptionValues('');
  };

  const handleRemoveOption = (index: number) => {
    setCurrentVariant({
      ...currentVariant,
      options: currentVariant.options.filter((_, i) => i !== index),
    });
  };

  const handleSaveVariant = () => {
    if (!currentVariant.name.trim() || currentVariant.stock < 0) return;

    const newVariants = [...variants];
    if (editingIndex !== null) {
      newVariants[editingIndex] = currentVariant;
    } else {
      newVariants.push(currentVariant);
    }
    onChange(newVariants);
    setDialogOpen(false);
  };

  const handleDeleteVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Ürün Varyantları</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleOpenDialog()}
          disabled={disabled}
        >
          <Plus className="w-4 h-4 mr-2" />
          Varyant Ekle
        </Button>
      </div>

      {variants.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <p className="text-sm">Henüz varyant eklenmedi</p>
            <p className="text-xs mt-1">Farklı renk, boyut veya özellikler ekleyin</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <Card key={index}>
              <CardContent className="py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{variant.name}</h4>
                      <Badge variant="outline">Stok: {variant.stock}</Badge>
                      {variant.priceOverride && (
                        <Badge variant="secondary">
                          +₺{variant.priceOverride.toFixed(2)}
                        </Badge>
                      )}
                      {variant.images && variant.images.length > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {variant.images.length} görsel
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option, optIndex) => (
                        <div key={optIndex} className="text-sm">
                          <span className="font-medium text-muted-foreground">
                            {option.name}:
                          </span>{' '}
                          {option.values.join(', ')}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(index)}
                      disabled={disabled}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteVariant(index)}
                      disabled={disabled}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Variant Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? 'Varyant Düzenle' : 'Yeni Varyant'}
            </DialogTitle>
            <DialogDescription>
              Ürün varyantı oluşturun (örn: Renk, Boyut)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="variant-name">Varyant Adı *</Label>
              <Input
                id="variant-name"
                value={currentVariant.name}
                onChange={(e) =>
                  setCurrentVariant({ ...currentVariant, name: e.target.value })
                }
                placeholder="Örn: Gri Köşe Koltuk, Büyük Boy"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Seçenekler</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    value={optionName}
                    onChange={(e) => setOptionName(e.target.value)}
                    placeholder="Seçenek adı (Renk, Boyut)"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={optionValues}
                    onChange={(e) => setOptionValues(e.target.value)}
                    placeholder="Değerler (Gri, Beyaz, Mavi)"
                  />
                  <Button type="button" onClick={handleAddOption} size="sm">
                    Ekle
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Değerleri virgül ile ayırın
              </p>

              {currentVariant.options.length > 0 && (
                <div className="space-y-2 pt-2">
                  {currentVariant.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{option.name}:</span>{' '}
                        <span className="text-sm text-muted-foreground">
                          {option.values.join(', ')}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Varyanta Özel Görseller</Label>
              <p className="text-xs text-muted-foreground">
                Bu varyant seçildiğinde gösterilecek görseller (opsiyonel)
              </p>
              <ImageUpload
                images={currentVariant.images || []}
                onChange={(images) =>
                  setCurrentVariant({ ...currentVariant, images })
                }
              />
              <p className="text-xs text-muted-foreground">
                Görseller seçili değilse, ürünün ana görselleri gösterilir
              </p>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="variant-stock">Stok *</Label>
                <Input
                  id="variant-stock"
                  type="number"
                  min="0"
                  value={currentVariant.stock}
                  onChange={(e) =>
                    setCurrentVariant({
                      ...currentVariant,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="variant-price">Fiyat Farkı (₺)</Label>
                <Input
                  id="variant-price"
                  type="number"
                  step="0.01"
                  value={currentVariant.priceOverride || ''}
                  onChange={(e) =>
                    setCurrentVariant({
                      ...currentVariant,
                      priceOverride: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Ana fiyata eklenecek miktar (opsiyonel)
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              İptal
            </Button>
            <Button type="button" onClick={handleSaveVariant}>
              {editingIndex !== null ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
