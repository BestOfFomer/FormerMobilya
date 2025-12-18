'use client';

import { useState, useId } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

export function ImageUpload({ images, onChange, disabled }: ImageUploadProps) {
  const { accessToken } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !accessToken) return;

    setIsUploading(true);

    try {
      // Upload single or multiple images
      if (files.length === 1) {
        const response = await api.upload.image(files[0], accessToken) as any;
        onChange([...images, response.filePath]);
        toast.success('Görsel yüklendi', {
          icon: <CheckCircle2 className="h-5 w-5" />,
        });
      } else {
        const response = await api.upload.images(files, accessToken) as any;
        onChange([...images, ...response.filePaths]);
        toast.success(`${files.length} görsel yüklendi`, {
          icon: <CheckCircle2 className="h-5 w-5" />,
        });
      }
    } catch (error: any) {
      toast.error('Yükleme başarısız: ' + error.message, {
        icon: <XCircle className="h-5 w-5" />,
      });
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  const uniqueId = useId();

  return (
    <div className="space-y-4 relative">
      {/* Loading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Görsel yükleniyor...</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label>Ürün Görselleri</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isUploading}
          onClick={() => document.getElementById(uniqueId)?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Yükleniyor...' : 'Görsel Ekle'}
        </Button>
        <input
          id={uniqueId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
        />
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mb-4" />
            <p className="text-sm">Henüz görsel eklenmedi</p>
            <p className="text-xs mt-1">En az 1 görsel ekleyin</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleReorder(index, index - 1)}
                    disabled={disabled}
                  >
                    ←
                  </Button>
                )}
                {index < images.length - 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleReorder(index, index + 1)}
                    disabled={disabled}
                  >
                    →
                  </Button>
                )}
              </div>

              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Ana Görsel
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        JPG, PNG veya WebP formatında. Maksimum 5MB. İlk görsel ana görsel olarak kullanılacak.
      </p>
    </div>
  );
}
