'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { Loader2, Save, Check, Plug, Shield, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { PageContentsSettings } from '@/components/admin/PageContentsSettings';
import { FeaturedProductsSettings } from '@/components/admin/FeaturedProductsSettings';

export default function SettingsPage() {
  const { user, accessToken } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // WhatsApp states
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [defaultMessage, setDefaultMessage] = useState('Merhaba, Former Mobilya ile ilgili bilgi almak istiyorum.');

  // Social Media states
  const [facebookEnabled, setFacebookEnabled] = useState(false);
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramEnabled, setInstagramEnabled] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterEnabled, setTwitterEnabled] = useState(false);
  const [twitterUrl, setTwitterUrl] = useState('');

  // Page Contents states
  const [pageContents, setPageContents] = useState<any>({
    about: {
      about: { enabled: true, title: '', content: '' },
      mission: { enabled: true, content: '' },
      vision: { enabled: true, content: '' },
      stats: { enabled: true, items: [] },
      values: { enabled: true, items: [] },
    },
    contact: {
      phone: { value: '' },
      email: { value: '' },
      address: { value: '' },
      workdays: { value: '' },
      workhours: { value: '' },
      mapEmbed: { value: '' },
    },
    stores: {
      items: [],
    },
  });

  // Trust Badges states
  const [trustBadges, setTrustBadges] = useState<any>({
    items: [],
  });

  // Featured Products state
  const [featuredProducts, setFeaturedProducts] = useState<string[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.settings.get() as any;
      
      if (response.whatsapp) {
        setWhatsappEnabled(response.whatsapp.enabled || false);
        setPhoneNumber(response.whatsapp.phoneNumber || '');
        setDefaultMessage(response.whatsapp.defaultMessage || 'Merhaba, Former Mobilya ile ilgili bilgi almak istiyorum.');
      }

      if (response.social) {
        setFacebookEnabled(!!response.social.facebook);
        setFacebookUrl(response.social.facebook || '');
        setInstagramEnabled(!!response.social.instagram);
        setInstagramUrl(response.social.instagram || '');
        setTwitterEnabled(!!response.social.twitter);
        setTwitterUrl(response.social.twitter || '');
      }

      if (response.pageContents) {
        // Ensure stores.items exists
        const pageContentsData = {
          ...response.pageContents,
          stores: {
            items: response.pageContents.stores?.items || [],
          },
        };
        setPageContents(pageContentsData);
      } else if (response.aboutPage) {
        // Backward compatibility
        setPageContents({
          about: response.aboutPage,
          contact: {
            phone: { value: '' },
            email: { value: '' },
            address: { value: '' },
            workdays: { value: '' },
            workhours: { value: '' },
            mapEmbed: { value: '' },
          },
          stores: {
            items: [],
          },
        });
      }

      if (response.trustBadges) {
        setTrustBadges(response.trustBadges);
      }

      if (response.featuredProducts) {
        setFeaturedProducts(response.featuredProducts);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Ayarlar yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!accessToken) {
      toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      return;
    }

    setIsSaving(true);
    setSaved(false);

    try {
      await api.settings.update({
        whatsapp: {
          enabled: whatsappEnabled,
          phoneNumber: phoneNumber.trim(),
          defaultMessage: defaultMessage.trim(),
        },
        social: {
          facebook: facebookEnabled ? facebookUrl.trim() : '',
          instagram: instagramEnabled ? instagramUrl.trim() : '',
          twitter: twitterEnabled ? twitterUrl.trim() : '',
        },
        pageContents: pageContents,
        trustBadges: trustBadges,
        featuredProducts: featuredProducts,
      }, accessToken);

      setSaved(true);
      toast.success('Ayarlar kaydedildi.');

      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Ayarlar kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground">
          Site ayarlarını ve entegrasyonları yönetin
        </p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger value="integrations" className="flex items-center gap-2 py-3">
            <Plug className="h-4 w-4" />
            <span className="hidden sm:inline">Entegrasyonlar</span>
            <span className="sm:hidden">Entegrasyon</span>
          </TabsTrigger>
          <TabsTrigger value="trustBadges" className="flex items-center gap-2 py-3">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Güven Rozetleri</span>
            <span className="sm:hidden">Rozetler</span>
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2 py-3">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="hidden sm:inline">Öne Çıkan Ürünler</span>
            <span className="sm:hidden">Öne Çıkan</span>
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2 py-3">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Sayfa İçerikleri</span>
            <span className="sm:hidden">İçerikler</span>
          </TabsTrigger>
        </TabsList>

        {/* Integrations Tab (WhatsApp + Social Media) */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="py-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366]/10">
                  <svg className="h-6 w-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <CardTitle>WhatsApp Entegrasyonu</CardTitle>
                  <CardDescription>
                    Müşterilerin WhatsApp ile iletişime geçmesi için ayarları yapılandırın
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsapp-enabled" className="text-base">
                    WhatsApp Desteğini Etkinleştir
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    WhatsApp butonu sitede görüntülensin mi?
                  </div>
                </div>
                <Switch
                  id="whatsapp-enabled"
                  checked={whatsappEnabled}
                  onCheckedChange={setWhatsappEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  WhatsApp Telefon Numarası <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="905XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!whatsappEnabled}
                />
                <p className="text-sm text-muted-foreground">
                  Numaranız Türkiye için 90 kodu ile boşluksuz şekilde yazılmalıdır. (ör: 905555555555)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Varsayılan Mesaj</Label>
                <Textarea
                  id="message"
                  rows={3}
                  placeholder="Merhaba, Former Mobilya ile ilgili bilgi almak istiyorum."
                  value={defaultMessage}
                  onChange={(e) => setDefaultMessage(e.target.value)}
                  disabled={!whatsappEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Card */}
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Sosyal Medya</CardTitle>
              <CardDescription>
                Sosyal medya hesaplarınızı sitenizde gösterin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="facebook-enabled" className="text-base font-semibold">
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </div>
                    </Label>
                    <Switch
                      id="facebook-enabled"
                      checked={facebookEnabled}
                      onCheckedChange={setFacebookEnabled}
                    />
                  </div>
                  <Input
                    placeholder="https://facebook.com/sayfaniz"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    disabled={!facebookEnabled}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="instagram-enabled" className="text-base font-semibold">
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Instagram
                      </div>
                    </Label>
                    <Switch
                      id="instagram-enabled"
                      checked={instagramEnabled}
                      onCheckedChange={setInstagramEnabled}
                    />
                  </div>
                  <Input
                    placeholder="https://instagram.com/profiliniz"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    disabled={!instagramEnabled}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twitter-enabled" className="text-base font-semibold">
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        X (Twitter)
                      </div>
                    </Label>
                    <Switch
                      id="twitter-enabled"
                      checked={twitterEnabled}
                      onCheckedChange={setTwitterEnabled}
                    />
                  </div>
                  <Input
                    placeholder="https://x.com/profiliniz"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    disabled={!twitterEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trust Badges Tab */}
        <TabsContent value="trustBadges" className="space-y-6">
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Güven Rozetleri</CardTitle>
              <CardDescription>
                Ana sayfada gösterilen güven rozetlerini düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trustBadges.items?.map((badge: any, index: number) => (
                <div key={index} className="space-y-4 border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Rozet #{index + 1}</Label>
                    {trustBadges.items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = trustBadges.items.filter((_: any, i: number) => i !== index);
                          setTrustBadges({ items: newItems });
                        }}
                      >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Sil
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`badge-icon-${index}`}>İkon</Label>
                      <Select
                        value={badge.icon}
                        onValueChange={(value) => {
                          const newItems = [...trustBadges.items];
                          newItems[index] = { ...newItems[index], icon: value };
                          setTrustBadges({ items: newItems });
                        }}
                      >
                        <SelectTrigger id={`badge-icon-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="truck">🚚 Kamyon</SelectItem>
                          <SelectItem value="rotateCcw">🔄 Döngü</SelectItem>
                          <SelectItem value="shield">🛡️ Kalkan</SelectItem>
                          <SelectItem value="checkCircle">✅ Onay</SelectItem>
                          <SelectItem value="star">⭐ Yıldız</SelectItem>
                          <SelectItem value="heart">❤️ Kalp</SelectItem>
                          <SelectItem value="thumbsUp">👍 Beğeni</SelectItem>
                          <SelectItem value="clock">🕐 Saat</SelectItem>
                          <SelectItem value="package">📦 Paket</SelectItem>
                          <SelectItem value="award">🏆 Ödül</SelectItem>
                          <SelectItem value="badgeCheck">✓ Rozet Onay</SelectItem>
                          <SelectItem value="phone">📞 Telefon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`badge-title-${index}`}>Başlık</Label>
                      <Input
                        id={`badge-title-${index}`}
                        placeholder="Örn: Fabrika Çıkış Onaylı"
                        value={badge.title}
                        onChange={(e) => {
                          const newItems = [...trustBadges.items];
                          newItems[index] = { ...newItems[index], title: e.target.value };
                          setTrustBadges({ items: newItems });
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`badge-description-${index}`}>Açıklama</Label>
                      <Textarea
                        id={`badge-description-${index}`}
                        rows={2}
                        placeholder="Rozet açıklaması..."
                        value={badge.description}
                        onChange={(e) => {
                          const newItems = [...trustBadges.items];
                          newItems[index] = { ...newItems[index], description: e.target.value };
                          setTrustBadges({ items: newItems });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setTrustBadges({
                    items: [...trustBadges.items, { title: '', description: '', icon: 'truck' }],
                  });
                }}
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Rozet Ekle
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Featured Products Tab */}
        <TabsContent value="featured" className="space-y-6">
          <FeaturedProductsSettings
            selectedIds={featuredProducts}
            onChange={setFeaturedProducts}
          />
        </TabsContent>

        {/* Page Contents Tab */}
        <TabsContent value="pages" className="space-y-6">
          <PageContentsSettings
            settings={pageContents}
            onChange={setPageContents}
          />
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end sticky bottom-4">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border shadow-lg">
          <Button
            onClick={handleSave}
            disabled={isSaving || saved}
            size="lg"
            className="min-w-32"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Kaydedildi
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Tüm Ayarları Kaydet
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
