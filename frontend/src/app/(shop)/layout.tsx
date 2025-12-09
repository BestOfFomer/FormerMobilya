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
    // Create a timeout promise that rejects after 2000ms
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('API Request Timeout')), 2000)
    );
    
    // Race the API call against the timeout
    const categoriesResponse = (await Promise.race([
      api.categories.getAll(),
      timeoutPromise
    ])) as any;
    
    categories = categoriesResponse.categories || [];
  } catch (error) {
    console.error('Failed to fetch categories in layout (using default):', error);
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
