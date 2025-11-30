'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api-client';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Model3DUpload } from '@/components/admin/Model3DUpload';
import { VariantManager } from '@/components/admin/VariantManager';
import { toast } from 'sonner';
import { ArrowLeft, Tag, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  slug: z.string().min(2, 'Slug en az 2 karakter olmalı'),
  sku: z.string().min(2, 'SKU en az 2 karakter olmalı'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalı'),
  category: z.string().min(1, 'Kategori seçimi zorunlu'),
  basePrice: z.number().min(0, 'Fiyat 0 veya daha fazla olmalı'),
  discountedPrice: z.number().min(0).optional(),
  images: z.array(z.string()).min(1, 'En az 1 görsel ekleyin'),
  model3D: z.string().optional(),
  dimensions: z.object({
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    depth: z.number().min(0).optional(),
  }).optional(),
  materials: z.array(z.string()).optional(),
  variants: z.array(z.object({
    name: z.string(),
    options: z.array(z.object({
      name: z.string(),
      values: z.array(z.string()),
    })),
    stock: z.number().min(0),
    priceOverride: z.number().optional(),
  })).optional(),
  active: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [materialsInput, setMaterialsInput] = useState('');
  const [hasDiscount, setHasDiscount] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      active: true,
      materials: [],
      images: [],
      variants: [],
      dimensions: {},
    },
  });

  const watchName = watch('name');
  const watchMaterials = watch('materials') || [];
  const watchImages = watch('images') || [];
  const watchModel3D = watch('model3D');
  const watchVariants = watch('variants') || [];
  const watchActive = watch('active');

  // Field name translations for error display
  const fieldNames: Record<string, string> = {
    name: 'Ürün İsmi',
    slug: 'Slug',
    sku: 'SKU',
    description: 'Açıklama',
    category: 'Kategori',
    basePrice: 'Normal Fiyat',
    discountedPrice: 'İndirimli Fiyat',
    images: 'Görseller',
    dimensions: 'Ölçüler',
    materials: 'Malzemeler',
    variants: 'Varyantlar',
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.categories.getAll() as any;
        setCategories(response.categories || []);
      } catch (error) {
        toast.error('Kategoriler yüklenemedi', {
          icon: <XCircle className="h-5 w-5" />,
        });
      }
    };
    fetchCategories();
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  }, [watchName, setValue]);

  // Clear discounted price when discount is disabled
  useEffect(() => {
    if (!hasDiscount) {
      setValue('discountedPrice', undefined);
    }
  }, [hasDiscount, setValue]);

  const handleAddMaterial = () => {
    if (materialsInput.trim()) {
      setValue('materials', [...watchMaterials, materialsInput.trim()]);
      setMaterialsInput('');
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setValue('materials', watchMaterials.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Validation errors:', errors);
    
    if (!accessToken) {
      toast.error('Oturum bulunamadı', {
        icon: <XCircle className="h-5 w-5" />,
      });
      return;
    }

    // Remove undefined discountedPrice to avoid validation errors
    const cleanedData = { ...data };
    if (cleanedData.discountedPrice === undefined || cleanedData.discountedPrice === null) {
      delete cleanedData.discountedPrice;
    }

    setIsLoading(true);

    try {
      await api.products.create(cleanedData, accessToken);
      toast.success('Ürün başarıyla oluşturuldu', {
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Product creation error:', error);
      toast.error(error.message || 'Ürün oluşturulamadı', {
        icon: <XCircle className="h-5 w-5" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Yeni Ürün</h1>
            <p className="text-muted-foreground mt-1">
              Kataloga yeni bir ürün ekleyin
            </p>
          </div>
        </div>
        
        {/* Active Toggle */}
        <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg">
          <div className="text-sm">
            <p className="font-medium">Aktif</p>
            <p className="text-muted-foreground text-xs">Sitede görünür</p>
          </div>
          <Switch
            checked={watchActive}
            onCheckedChange={(value) => setValue('active', value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Temel Bilgiler */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Temel Bilgiler</CardTitle>
            <CardDescription>Ürünün temel bilgilerini girin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Ürün İsmi *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Modern Köşe Koltuk"
                  disabled={isLoading}
                  className="h-11"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  {...register('sku')}
                  placeholder="PRD-001"
                  disabled={isLoading}
                  className="h-11"
                />
                {errors.sku && (
                  <p className="text-sm text-destructive">{errors.sku.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="modern-kose-koltuk"
                disabled={isLoading}
                className="h-11"
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                URL'de kullanılacak benzersiz tanımlayıcı (otomatik oluşturulur)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Ürün açıklamasını girin..."
                rows={5}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fiyatlandırma */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Fiyatlandırma</CardTitle>
            <CardDescription>Ürün fiyatlarını belirleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Normal Fiyat (₺) *</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                {...register('basePrice', { valueAsNumber: true })}
                placeholder="15000"
                disabled={isLoading}
                className="h-11"
              />
              {errors.basePrice && (
                <p className="text-sm text-destructive">{errors.basePrice.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  İndirimli Fiyat
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ürüne indirim uygula
                </p>
              </div>
              <Switch
                checked={hasDiscount}
                onCheckedChange={setHasDiscount}
                disabled={isLoading}
              />
            </div>

            {hasDiscount && (
              <div className="space-y-2 animate-in fade-in-50 slide-in-from-top-2">
                <Label htmlFor="discountedPrice">İndirimli Fiyat (₺) *</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  step="0.01"
                  {...register('discountedPrice', { valueAsNumber: true })}
                  placeholder="12000"
                  disabled={isLoading}
                  className="h-11"
                />
                {errors.discountedPrice && (
                  <p className="text-sm text-destructive">{errors.discountedPrice.message}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ölçüler */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Ölçüler</CardTitle>
            <CardDescription>Ürün ölçülerini cm cinsinden girin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="width">Genişlik (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  {...register('dimensions.width', { valueAsNumber: true })}
                  placeholder="250"
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Yükseklik (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  {...register('dimensions.height', { valueAsNumber: true })}
                  placeholder="85"
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="depth">Derinlik (cm)</Label>
                <Input
                  id="depth"
                  type="number"
                  {...register('dimensions.depth', { valueAsNumber: true })}
                  placeholder="180"
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Malzemeler */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Malzemeler</CardTitle>
            <CardDescription>Ürününde kullanılan malzemeleri ekleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={materialsInput}
                onChange={(e) => setMaterialsInput(e.target.value)}
                placeholder="Malzeme ekle (Kumaş, Ahşap...)"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())}
                disabled={isLoading}
                className="h-11"
              />
              <Button
                type="button"
                onClick={handleAddMaterial}
                disabled={isLoading}
                size="default"
              >
                Ekle
              </Button>
            </div>
            {watchMaterials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchMaterials.map((material, index) => (
                  <div
                    key={index}
                    className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                  >
                    {material}
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(index)}
                      className="hover:text-destructive transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Varyantlar */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Ürün Varyantları</CardTitle>
            <CardDescription>Ürünün farklı varyantlarını tanımlayın (renk, boyut vb.)</CardDescription>
          </CardHeader>
          <CardContent>
            <VariantManager
              variants={watchVariants}
              onChange={(variants) => setValue('variants', variants)}
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        {/* Görseller */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Ürün Görselleri</CardTitle>
            <CardDescription>Ürün görsellerini yükleyin (en az 1 görsel gerekli)</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              images={watchImages}
              onChange={(images) => setValue('images', images)}
              disabled={isLoading}
            />
            {errors.images && (
              <p className="text-sm text-destructive mt-2">{errors.images.message}</p>
            )}
          </CardContent>
        </Card>

        {/* 3D Model */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>3D Model (Opsiyonel)</CardTitle>
            <CardDescription>Ürün için 3D model yükleyin (GLB veya GLTF formatında)</CardDescription>
          </CardHeader>
          <CardContent>
            <Model3DUpload
              modelPath={watchModel3D}
              onChange={(modelPath) => setValue('model3D', modelPath)}
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Validation Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-semibold text-destructive mb-2">Lütfen aşağıdaki hataları düzeltin:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                  {Object.entries(errors).map(([field, error]: [string, any]) => (
                    <li key={field}>
                      <strong>{fieldNames[field] || field}</strong>: {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            İptal
          </Button>
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? 'Oluşturuluyor...' : 'Ürünü Oluştur'}
          </Button>
        </div>
      </form>
    </div>
  );
}
