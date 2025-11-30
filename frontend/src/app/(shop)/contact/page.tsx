'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Sorularınız, önerileriniz veya talepleriniz için bizimle iletişime geçin.
            Size yardımcı olmaktan mutluluk duyarız.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Contact Form */}
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Bize Ulaşın</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Adınız Soyadınız</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="05XXXXXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Konu</Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder="Mesajınızın konusu"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mesajınız</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <aside className="space-y-6">
            <Card className="py-6">
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Telefon</div>
                    <a href="tel:+905551234567" className="text-muted-foreground hover:text-foreground">
                      +90 555 123 45 67
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">E-posta</div>
                    <a href="mailto:info@formermobilya.com" className="text-muted-foreground hover:text-foreground">
                      info@formermobilya.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Adres</div>
                    <p className="text-muted-foreground">
                      Örnek Mahallesi, Mobilya Caddesi No:123<br />
                      İstanbul, Türkiye
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Çalışma Saatleri</div>
                    <p className="text-muted-foreground">
                      Pazartesi - Cumartesi: 09:00 - 19:00<br />
                      Pazar: 10:00 - 18:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="py-6">
              <CardHeader>
                <CardTitle>Hızlı Linkler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="/faq" className="block text-sm text-muted-foreground hover:text-foreground">
                  → Sıkça Sorulan Sorular
                </a>
                <a href="/delivery" className="block text-sm text-muted-foreground hover:text-foreground">
                  → Teslimat & Montaj
                </a>
                <a href="/returns" className="block text-sm text-muted-foreground hover:text-foreground">
                  → İade & Garanti
                </a>
                <a href="/stores" className="block text-sm text-muted-foreground hover:text-foreground">
                  → Mağazalarımız
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
