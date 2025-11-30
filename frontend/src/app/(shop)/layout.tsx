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
  const categoriesResponse = (await api.categories.getAll()) as any;
  const categories = categoriesResponse.categories || [];

  return (
    <div suppressHydrationWarning>
      <Navigation categories={categories} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
