'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

interface Store {
  name: string;
  address: string;
  phone: string;
  email: string;
  workdays: string;
  workhours: string;
  mapEmbed: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.settings.get() as any;
        if (response.pageContents?.stores?.items) {
          setStores(response.pageContents.stores.items);
        }
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Mağazalarımız</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Ürünlerimizi yakından görmek ve uzman ekibimizden destek almak için
            mağazalarımızı ziyaret edebilirsiniz.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Info Banner */}
        <Card className="mb-12 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-2">Mağaza Ziyaretiniz İçin</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Tüm ürünlerimizi yerinde inceleyebilir, dokunup hissedebilirsiniz</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Uzman danışmanlarımızdan ücretsiz iç mekan tasarım önerileri alabilirsiniz</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Özel indirim ve kampanyalarımızdan haberdar olabilirsiniz</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Stores Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i} className="py-6">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stores.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <p className="text-muted-foreground">Henüz mağaza bilgisi eklenmemiş.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {stores.map((store, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow py-6">
                <CardHeader>
                  <CardTitle>{store.name || `Mağaza ${index + 1}`}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {store.address && (
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground whitespace-pre-line">
                          {store.address}
                        </div>
                      </div>
                    </div>
                  )}

                  {store.phone && (
                    <div className="flex gap-3">
                      <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <a 
                          href={`tel:${store.phone.replace(/\s/g, '')}`}
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {store.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {store.email && (
                    <div className="flex gap-3">
                      <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <a 
                          href={`mailto:${store.email}`}
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {store.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {(store.workdays || store.workhours) && (
                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {store.workdays && (
                            <>
                              {store.workdays}
                              {store.workhours && ': '}
                            </>
                          )}
                          {store.workhours && store.workhours}
                        </div>
                      </div>
                    </div>
                  )}

                  {store.mapEmbed && (
                    <div className="mt-4 rounded-lg overflow-hidden">
                      <div 
                        className="w-full"
                        dangerouslySetInnerHTML={{ __html: store.mapEmbed }}
                      />
                    </div>
                  )}

                  <div className="pt-4 flex gap-2">
                    {store.address && (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a 
                          href={`https://www.google.com/maps/search/${encodeURIComponent(store.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Haritada Gör
                        </a>
                      </Button>
                    )}
                    {store.phone && (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={`tel:${store.phone.replace(/\s/g, '')}`}>
                          Ara
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA */}
        <section className="mt-12 text-center bg-muted/50 rounded-lg p-12">
          <h2 className="text-2xl font-bold mb-4">Online Alışveriş Yapın</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Mağazamıza gelemiyorsanız, online alışveriş yaparak ürünlerinizi evinize
            teslim ettirebilirsiniz.
          </p>
          <Button size="lg" asChild>
            <Link href="/">Alışverişe Başlayın</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
