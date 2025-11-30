'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80"
          alt="Modern furniture showcase"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto h-full px-4">
        <div className="flex h-full items-center">
          {/* Text Content - Positioned Right (Asymmetric) */}
          <div className="ml-auto max-w-2xl space-y-6 text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Yeni Sezon Koleksiyonu
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              Evinizi
              <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}
                Dönüştürün
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-gray-200 md:text-xl">
              Modern tasarım ve konforun buluştuğu mobilyalarla yaşam alanlarınızı yenileyin.
              Kaliteli, şık ve uygun fiyatlı mobilya çözümleri.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button size="lg" asChild className="group">
                <Link href="/products">
                  Ürünleri İncele
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/10 backdrop-blur-sm hover:bg-white/20">
                <Link href="/categories/oturma-odasi">
                  Kategoriler
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-end gap-8 pt-8 text-white">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-gray-300">Farklı Ürün</div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-gray-300">Mutlu Müşteri</div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <div className="text-3xl font-bold">2 Yıl</div>
                <div className="text-sm text-gray-300">Garanti</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs">Aşağı Kaydır</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
