'use client';

import { Truck, RotateCcw, Shield } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: 'Ücretsiz Kargo',
      description: '5.000₺ ve üzeri',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: RotateCcw,
      title: '14 Gün İade',
      description: 'Koşulsuz iade hakkı',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Shield,
      title: '2 Yıl Garanti',
      description: 'Tüm ürünlerde',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group flex items-center gap-4 transition-transform hover:scale-105"
            >
              {/* Icon */}
              <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full ${badge.bgColor} transition-all group-hover:scale-110`}>
                <badge.icon className={`h-8 w-8 ${badge.color}`} />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-lg font-bold">{badge.title}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
