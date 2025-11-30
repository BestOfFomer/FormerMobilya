'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { CartSheet } from './CartSheet';
import type { Category } from '@/types';

interface NavigationProps {
  categories: Category[];
}

export function Navigation({ categories }: NavigationProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isCartSheetOpen = useCartStore((state) => state.isCartSheetOpen);
  const openCartSheet = useCartStore((state) => state.openCartSheet);
  const closeCartSheet = useCartStore((state) => state.closeCartSheet);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-shadow ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/former_logo.png"
              alt="Former Mobilya"
              width={120}
              height={0}
              style={{ width: 'auto', height: 'auto' }}
              className="h-9"
              priority
            />
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Sheet - Desktop */}
            <Sheet open={isCartSheetOpen} onOpenChange={(open) => open ? openCartSheet() : closeCartSheet()}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sepetim</SheetTitle>
                </SheetHeader>
                <CartSheet />
              </SheetContent>
            </Sheet>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">Siparişlerim</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile">Hesabım</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/login">Giriş Yap</Link>
              </Button>
            )}

            {/* Mobile Cart Sheet */}
            <Sheet open={isCartSheetOpen} onOpenChange={(open) => open ? openCartSheet() : closeCartSheet()}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sepetim</SheetTitle>
                </SheetHeader>
                <CartSheet />
              </SheetContent>
            </Sheet>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col gap-4">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Ürün ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </form>

                  {/* Mobile Categories */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Kategoriler</h3>
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/categories/${category.slug}`}
                        className="block py-2 text-sm hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Corporate Links */}
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="font-semibold">Kurumsal</h3>
                    <Link
                      href="/about"
                      className="block py-2 text-sm hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Hakkımızda
                    </Link>
                    <Link
                      href="/stores"
                      className="block py-2 text-sm hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mağazalarımız
                    </Link>
                    <Link
                      href="/contact"
                      className="block py-2 text-sm hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      İletişim
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Category Navigation - Desktop */}
        <nav className="hidden border-t md:block">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-6">
              {categories.slice(0, 5).map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {category.name}
                </Link>
              ))}
              {categories.length > 5 && (
                <Link
                  href="/categories"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Kategoriler →
                </Link>
              )}
            </div>
            
            {/* Corporate Links */}
            <div className="flex items-center space-x-6">
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Kurumsal
              </Link>
              <Link
                href="/stores"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Mağazalar
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                İletişim
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
