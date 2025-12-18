'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Box, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Model3DUploadProps {
  modelPath?: string;
  onChange: (modelPath: string | undefined) => void;
  disabled?: boolean;
}

export function Model3DUpload({ modelPath, onChange, disabled }: Model3DUploadProps) {
  const { accessToken } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;

    // Validate file size (20MB)
    const MAX_SIZE = 20 * 1024 * 1024; // 20MB
    if (file.size > MAX_SIZE) {
      toast.error('Dosya boyutu 20MB\'dan büyük olamaz', {
        icon: <XCircle className="h-5 w-5" />,
      });
      e.target.value = '';
      return;
    }

    // Validate file extension
    const allowedExtensions = ['.glb', '.gltf'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      toast.error('Sadece .glb ve .gltf dosyaları desteklenmektedir', {
        icon: <XCircle className="h-5 w-5" />,
      });
      e.target.value = '';
      return;
    }

    setIsUploading(true);

    try {
      const response = await api.upload.model3d(file, accessToken) as any;
      onChange(response.filePath);
      
      toast.success('3D model yüklendi', {
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
    } catch (error: any) {
      toast.error('Yükleme başarısız: ' + error.message, {
        icon: <XCircle className="h-5 w-5" />,
      });
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    toast.success('3D model kaldırıldı', {
      icon: <CheckCircle2 className="h-5 w-5" />,
    });
  };

  return (
    <div className="space-y-4 relative">
      {/* Loading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">3D model yükleniyor...</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <Label>3D Model (Opsiyonel)</Label>
          <p className="text-xs text-muted-foreground mt-1">
            GLB veya GLTF formatında. Maksimum 20MB.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isUploading}
          onClick={() => document.getElementById('model3d-upload')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Yükleniyor...' : '3D Model Ekle'}
        </Button>
        <input
          id="model3d-upload"
          type="file"
          accept=".glb,.gltf"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
        />
      </div>

      {!modelPath ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Box className="w-12 h-12 mb-4" />
            <p className="text-sm">3D model eklenmedi</p>
            <p className="text-xs mt-1">Ürüne 3D görünüm eklemek için model yükleyin</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <Box className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">3D Model Yüklendi</p>
                  <p className="text-xs text-muted-foreground">{modelPath.split('/').pop()}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
