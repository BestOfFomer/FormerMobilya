import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Award, Users, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Hakkımızda - FormerMobilya',
  description: 'FormerMobilya hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
            <p className="text-xl text-muted-foreground">
              FormerMobilya olarak, modern ve kaliteli mobilya çözümleriyle hayalinizdeki mekanları yaratıyoruz.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Mission & Vision */}
        <section className="grid gap-8 md:grid-cols-2">
          <Card className="py-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                Misyonumuz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Müşterilerimize en kaliteli mobilya ürünlerini uygun fiyatlarla sunarak,
                yaşam alanlarını daha konforlu ve estetik hale getirmek. Her bütçeye
                uygun, dayanıklı ve tasarım odaklı ürünlerle hizmet vermek.
              </p>
            </CardContent>
          </Card>

          <Card className="py-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Vizyonumuz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Türkiye'nin en güvenilir ve tercih edilen mobilya markası olmak.
                İnovasyon, kalite ve müşteri memnuniyetini ön planda tutarak,
                sektörde lider konumda olmayı hedefliyoruz.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Rakamlarla FormerMobilya</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Yıllık Tecrübe</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Users className="h-12 w-12 text-primary mb-4" />
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <div className="text-sm text-muted-foreground">Mutlu Müşteri</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <div className="text-4xl font-bold mb-2">1,000+</div>
                <div className="text-sm text-muted-foreground">Ürün Çeşidi</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Award className="h-12 w-12 text-primary mb-4" />
                <div className="text-4xl font-bold mb-2">%98</div>
                <div className="text-sm text-muted-foreground">Memnuniyet Oranı</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Değerlerimiz</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="py-6">
              <CardHeader>
                <CardTitle>Kalite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ürünlerimiz seçilmiş malzemelerden üretilir ve kalite kontrolünden geçer.
                  Uzun ömürlü ve dayanıklı mobilyalar sunuyoruz.
                </p>
              </CardContent>
            </Card>

            <Card className="py-6">
              <CardHeader>
                <CardTitle>Müşteri Odaklılık</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Müşteri memnuniyeti en önemli önceliğimizdir. Satış öncesi ve sonrası
                  profesyonel destek sağlıyoruz.
                </p>
              </CardContent>
            </Card>

            <Card className="py-6">
              <CardHeader>
                <CardTitle>İnovasyon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sürekli yenilenen ürün gamımız ve modern tasarımlarımızla
                  sektörün öncüsü olmayı hedefliyoruz.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

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
