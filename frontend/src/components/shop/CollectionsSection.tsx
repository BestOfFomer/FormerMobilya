import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

const collections: Collection[] = [
  {
    id: '1',
    name: 'Modern Salon',
    description: 'Çağdaş tasarım ve minimal estetiğin buluştuğu modern salon mobilyaları',
    image: '/collections/modern-salon.jpg',
    slug: 'modern-salon',
  },
  {
    id: '2',
    name: 'Minimal Yatak Odası',
    description: 'Sadelik ve fonksiyonelliğin harmanlandığı yatak odası takımları',
    image: '/collections/minimal-bedroom.jpg',
    slug: 'minimal-yatak-odasi',
  },
  {
    id: '3',
    name: 'Klasik Yemek Odası',
    description: 'Zamansız zarafet ve şıklığın ön planda olduğu yemek odası setleri',
    image: '/collections/classic-dining.jpg',
    slug: 'klasik-yemek-odasi',
  },
];

export function CollectionsSection() {
  return (
    <section className="container mx-auto px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">Oda Konseptleri</h2>
        <p className="mt-2 text-muted-foreground">
          Evinize ilham verecek özenle hazırlanmış koleksiyonlar
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/collections/${collection.slug}`}>
            <Card className="group overflow-hidden transition-all hover:shadow-xl">
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
                  
                  {/* Placeholder gradient for now */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-white/90 mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="w-fit group-hover:bg-white group-hover:text-black transition-colors pointer-events-none"
                    >
                      Ürünleri Gör
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
