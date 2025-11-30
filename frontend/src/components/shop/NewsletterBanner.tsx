'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import Image from 'next/image';

export function NewsletterBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-purple-600 py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Left: Text Content */}
          <div className="text-white">
            <h2 className="text-3xl font-bold md:text-4xl">
              Fırsatları Kaçırmayın!
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Yeni ürünler, özel indirimler ve kampanyalardan ilk siz haberdar olun.
              İlk alışverişinizde <span className="font-bold">%10 indirim</span> kazanın!
            </p>

            {/* Newsletter Form */}
            <div className="mt-8 flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="h-12 border-0 bg-white pl-10 text-black placeholder:text-gray-400"
                />
              </div>
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Abone Ol
              </Button>
            </div>

            <p className="mt-4 text-sm text-white/70">
              🔒 E-posta adresiniz güvende. Spam göndermiyoruz.
            </p>
          </div>

          {/* Right: Illustration/Image */}
          <div className="relative hidden lg:block">
            <div className="relative h-64 w-full">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80"
                alt="Newsletter"
                fill
                className="rounded-lg object-cover shadow-2xl"
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
