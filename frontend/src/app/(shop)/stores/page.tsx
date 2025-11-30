import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock } from 'lucide-react';
import Link from 'next/link';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
}

const stores: Store[] = [
  {
    id: '1',
    name: 'İstanbul Anadolu Mağazası',
    address: 'Ataşehir Mahallesi, Mobilya Caddesi No:45',
    city: 'İstanbul (Anadolu)',
    phone: '+90 216 555 11 22',
    hours: 'Pzt-Cmt: 09:00-19:00, Pazar: 10:00-18:00',
  },
  {
    id: '2',
    name: 'İstanbul Avrupa Mağazası',
    address: 'Beşiktaş Mahallesi, Ev Tekstili Sokak No:78',
    city: 'İstanbul (Avrupa)',
    phone: '+90 212 555 33 44',
    hours: 'Pzt-Cmt: 09:00-19:00, Pazar: 10:00-18:00',
  },
  {
    id: '3',
    name: 'Ankara Kızılay Mağazası',
    address: 'Kızılay Meydanı, İç Dekorasyon Cd. No:12',
    city: 'Ankara',
    phone: '+90 312 555 55 66',
    hours: 'Pzt-Cmt: 09:00-19:00, Pazar: 10:00-18:00',
  },
  {
    id: '4',
    name: 'İzmir Alsancak Mağazası',
    address: 'Alsancak Mahallesi, Mobilya Plaza No:34',
    city: 'İzmir',
    phone: '+90 232 555 77 88',
    hours: 'Pzt-Cmt: 09:00-19:00, Pazar: 10:00-18:00',
  },
];

export const metadata = {
  title: 'Mağazalarımız - FormerMobilya',
  description: 'FormerMobilya mağazalarımızı keşfedin. Yakınınızdaki showroom\'u bulun.',
};

export default function StoresPage() {
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
        <div className="grid gap-6 md:grid-cols-2">
          {stores.map((store) => (
            <Card key={store.id} className="hover:shadow-lg transition-shadow py-6">
              <CardHeader>
                <CardTitle>{store.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{store.city}</div>
                    <div className="text-sm text-muted-foreground">{store.address}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <a 
                      href={`tel:${store.phone}`}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {store.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">{store.hours}</div>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a 
                      href={`https://www.google.com/maps/search/${encodeURIComponent(store.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Haritada Gör
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={`tel:${store.phone}`}>
                      Ara
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
