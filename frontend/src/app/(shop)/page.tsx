import { api } from '@/lib/api-client';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Category, Product } from '@/types';
import { CategoryGrid } from '@/components/shop/CategoryGrid';
import { TrustBadges } from '@/components/shop/TrustBadges';
import { NewsletterBanner } from '@/components/shop/NewsletterBanner';

// Force dynamic rendering to fetch fresh data on each request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  let categories: Category[] = [];
  let featuredProducts: Product[] = [];
  let newProducts: Product[] = [];

  try {
    const categoriesResponse = await api.categories.getAll() as any;
    categories = categoriesResponse.categories || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  try {
    // Fetch settings to get featured product IDs
    const settingsResponse = await api.settings.get() as any;
    const featuredProductIds = settingsResponse.featuredProducts || [];

    if (featuredProductIds.length > 0) {
      // Fetch all products and filter by featured IDs
      const allProductsResponse = await api.products.getAll() as any;
      const allProducts = allProductsResponse.products || [];
      
      // Filter and maintain the order from settings
      featuredProducts = featuredProductIds
        .map((id: string) => allProducts.find((p: Product) => p._id === id))
        .filter(Boolean); // Remove any undefined products
    }

    // Fetch new arrivals
    const newProductsResponse = await api.products.getAll({
      sort: '-createdAt',
      limit: '8',
    }) as any;
    newProducts = newProductsResponse.products || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Featured Categories - Top of Page */}
      {categories.length > 0 && (
        <div className="pt-8">
          <CategoryGrid categories={categories} />
        </div>
      )}

      {/* Trust Badges - After Categories */}
      <TrustBadges />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Öne Çıkan Ürünler</h2>
            <p className="mt-2 text-muted-foreground">
              En popüler ve beğenilen mobilyalarımız
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Banner */}
      <NewsletterBanner />

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Yeni Ürünler</h2>
            <p className="mt-2 text-muted-foreground">
              En son eklenen mobilyalarımıza göz atın
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Tüm Ürünleri Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
