import { api } from '@/lib/api-client';
import { Navigation } from '@/components/shop/Navigation';
import { Footer } from '@/components/shop/Footer';
import { WhatsAppButton } from '@/components/shop/WhatsAppButton';
import type { Category } from '@/types';

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories = [];
  try {
    const categoriesResponse = (await api.categories.getAll()) as any;
    categories = categoriesResponse.categories || [];
  } catch (error) {
    console.error('Failed to fetch categories in layout:', error);
    // Continue with empty categories to prevent build failure
  }

  return (
    <div suppressHydrationWarning>
      <Navigation categories={categories} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
