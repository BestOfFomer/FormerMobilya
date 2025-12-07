'use client';

import { useEffect, useState } from 'react';
import { Truck, RotateCcw, Shield, CheckCircle, Star, Heart, ThumbsUp, Clock, Package, Award, BadgeCheck, Phone } from 'lucide-react';
import { api } from '@/lib/api-client';

const iconMap: Record<string, any> = {
  truck: Truck,
  rotateCcw: RotateCcw,
  shield: Shield,
  checkCircle: CheckCircle,
  star: Star,
  heart: Heart,
  thumbsUp: ThumbsUp,
  clock: Clock,
  package: Package,
  award: Award,
  badgeCheck: BadgeCheck,
  phone: Phone,
};

export function TrustBadges() {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await api.settings.get() as any;
        if (response.trustBadges?.items) {
          setBadges(response.trustBadges.items);
        }
      } catch (error) {
        console.error('Failed to load trust badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (loading || badges.length === 0) {
    return null;
  }

  const getIconColors = (icon: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      truck: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
      rotateCcw: { bg: 'bg-green-500/10', text: 'text-green-500' },
      shield: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
      checkCircle: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
      star: { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
      heart: { bg: 'bg-red-500/10', text: 'text-red-500' },
      thumbsUp: { bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
      clock: { bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
      package: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
      award: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
      badgeCheck: { bg: 'bg-teal-500/10', text: 'text-teal-500' },
      phone: { bg: 'bg-pink-500/10', text: 'text-pink-500' },
    };
    return colorMap[icon] || { bg: 'bg-blue-500/10', text: 'text-blue-500' };
  };

  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {badges.map((badge, index) => {
            const IconComponent = iconMap[badge.icon] || Truck;
            const colors = getIconColors(badge.icon);
            return (
              <div
                key={index}
                className="group flex items-center gap-4 transition-transform hover:scale-105"
              >
                {/* Icon */}
                <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full ${colors.bg} transition-all group-hover:scale-110`}>
                  <IconComponent className={`h-8 w-8 ${colors.text}`} />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-lg font-bold">{badge.title}</h3>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
