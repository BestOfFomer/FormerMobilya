'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface Dimensions {
  width?: number;
  height?: number;
  depth?: number;
  seatHeight?: number;
}

interface ProductTabsProps {
  description?: string;
  materials?: string[];
  dimensions?: Dimensions;
}

export function ProductTabs({ description, materials, dimensions }: ProductTabsProps) {
  return (
    <Tabs defaultValue="features" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="features">Özellikler</TabsTrigger>
        <TabsTrigger value="dimensions">Ölçüler</TabsTrigger>
        <TabsTrigger value="materials">Malzemeler</TabsTrigger>
        <TabsTrigger value="description">Açıklama</TabsTrigger>
      </TabsList>

      <TabsContent value="features" className="mt-6">
        <Card>
          <CardContent className="py-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Ürün Özellikleri</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Yüksek kalite malzemeler kullanılarak üretilmiştir</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Modern ve şık tasarım</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Kolay montaj ve kullanım</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Uzun ömürlü ve dayanıklı yapı</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>2 yıl garanti</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dimensions" className="mt-6">
        <Card>
          <CardContent className="py-6">
            <div>
              <h3 className="font-semibold mb-4">Ürün Ölçüleri</h3>
              {dimensions && (Object.keys(dimensions).length > 0) ? (
                <div className="grid grid-cols-2 gap-4">
                  {dimensions.width && (
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Genişlik</div>
                      <div className="text-2xl font-bold">{dimensions.width} cm</div>
                    </div>
                  )}
                  {dimensions.height && (
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Yükseklik</div>
                      <div className="text-2xl font-bold">{dimensions.height} cm</div>
                    </div>
                  )}
                  {dimensions.depth && (
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Derinlik</div>
                      <div className="text-2xl font-bold">{dimensions.depth} cm</div>
                    </div>
                  )}
                  {dimensions.seatHeight && (
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Oturma Yüksekliği</div>
                      <div className="text-2xl font-bold">{dimensions.seatHeight} cm</div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Ölçü bilgisi mevcut değil.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="materials" className="mt-6">
        <Card>
          <CardContent className="py-6">
            <div>
              <h3 className="font-semibold mb-4">Kullanılan Malzemeler</h3>
              {materials && materials.length > 0 ? (
                <div className="space-y-3">
                  {materials.map((material, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-medium">{material}</span>
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Bakım Önerileri</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Nemli bezle silinebilir</li>
                      <li>• Doğrudan güneş ışığından uzak tutunuz</li>
                      <li>• Kimyasal temizleyiciler kullanmayınız</li>
                      <li>• Düzenli olarak toz alınız</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Malzeme bilgisi mevcut değil.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="description" className="mt-6">
        <Card>
          <CardContent className="py-6">
            <div className="prose prose-sm max-w-none">
              {description ? (
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {description}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Bu üründe modern tasarım ve yüksek kalite malzemeler bir araya gelmiştir.
                  Evinize şıklık ve konfor katacak bu ürün, uzun yıllar boyunca size hizmet edecektir.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
