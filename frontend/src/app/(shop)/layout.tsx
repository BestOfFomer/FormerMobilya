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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

  try {
    const categoriesResponse = (await api.categories.getAll({ 
      signal: controller.signal 
    })) as any;
    categories = categoriesResponse.categories || [];
  } catch (error) {
    console.error('Failed to fetch categories in layout (using default):', error);
    // Continue with empty categories
  } finally {
    clearTimeout(timeoutId);
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
