import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Award, Users, Calendar, Star, TrendingUp, Package, Home, Heart, ThumbsUp, Zap, Target, Badge } from 'lucide-react';
import { api } from '@/lib/api-client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const iconMap: Record<string, any> = {
  calendar: Calendar,
  users: Users,
  checkCircle: CheckCircle,
  award: Award,
  star: Star,
  trendingUp: TrendingUp,
  package: Package,
  home: Home,
  heart: Heart,
  thumbsUp: ThumbsUp,
  zap: Zap,
  target: Target,
  badge: Badge,
};

export default async function AboutPage() {
  let settings: any = null;

  try {
    const data = await api.settings.get() as any;
    // Fix: API returns full settings object, about data is in pageContents.about
    settings = data.pageContents?.about;
  } catch (error) {
    console.error('Failed to load about page settings:', error);
  }

  // If settings not loaded, show minimal page
  if (!settings) {
    return (
      <div className="min-h-screen">
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
              <p className="text-xl text-muted-foreground">
                Fomer Mobilya hakkında bilgiler yükleniyor...
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* About Section */}
      {settings.about?.enabled && (
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">{settings.about.title}</h1>
              <p className="text-xl text-muted-foreground whitespace-pre-line">
                {settings.about.content}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Mission & Vision */}
        {(settings.mission?.enabled || settings.vision?.enabled) && (
          <section className="grid gap-8 md:grid-cols-2">
            {settings.mission?.enabled && (
              <Card className="py-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    Misyonumuz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {settings.mission.content}
                  </p>
                </CardContent>
              </Card>
            )}

            {settings.vision?.enabled && (
              <Card className="py-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    Vizyonumuz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {settings.vision.content}
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {/* Stats */}
        {settings.stats?.enabled && settings.stats.items?.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Rakamlarla Fomer Mobilya</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {settings.stats.items.map((stat: any, index: number) => {
                const IconComponent = iconMap[stat.icon] || CheckCircle;
                return (
                  <Card key={index}>
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <IconComponent className="h-12 w-12 text-primary mb-4" />
                      <div className="text-4xl font-bold mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Values */}
        {settings.values?.enabled && settings.values.items?.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Değerlerimiz</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {settings.values.items.map((value: any, index: number) => (
                <Card key={index} className="py-6">
                  <CardHeader>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{value.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center bg-muted/50 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Sizleri Mağazalarımızda Görmekten Mutluluk Duyarız</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Ürünlerimizi yakından görmek ve uzman ekibimizden destek almak için
            mağazalarımızı ziyaret edebilirsiniz.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/stores">Mağazalarımız</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">İletişime Geçin</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}