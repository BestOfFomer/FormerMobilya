'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { Loader2, Save, Check, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, accessToken } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [defaultMessage, setDefaultMessage] = useState('Merhaba, Former Mobilya ile ilgili bilgi almak istiyorum.');

  // Social Media States
  const [facebookEnabled, setFacebookEnabled] = useState(false);
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramEnabled, setInstagramEnabled] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterEnabled, setTwitterEnabled] = useState(false);
  const [twitterUrl, setTwitterUrl] = useState('');

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
      }, accessToken);

      setSaved(true);
      toast.success('Ayarlar kaydedildi.');

      // Reset saved state after 2 seconds
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
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground">
          Site ayarlarını ve entegrasyonları yönetin
        </p>
      </div>

      {/* WhatsApp Settings */}
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
          {/* Enable/Disable Switch */}
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

          {/* Phone Number */}
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

          {/* Default Message */}
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
            <p className="text-sm text-muted-foreground">
              Kullanıcılar butona tıkladığında bu mesaj otomatik olarak yazılacak
            </p>
          </div>

          {/* Preview */}
          {whatsappEnabled && phoneNumber && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <Label className="text-sm font-medium">Önizleme</Label>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0012.05 0Z"/>
                  </svg>
                </span>
                <span className="text-muted-foreground">
                  Kullanıcılar bu butona tıklayarak size ulaşabilecek
                </span>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving || saved || (!whatsappEnabled && !phoneNumber)}
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
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Settings */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Sosyal Medya</CardTitle>
          <CardDescription>
            Sosyal medya hesaplarınızı sitenizde gösterin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Facebook */}
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
                placeholder="https://facebook.com/facebook-sayfaniz"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                disabled={!facebookEnabled}
              />
            </div>

            {/* Instagram */}
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
                placeholder="https://instagram.com/instagram-profiliniz"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                disabled={!instagramEnabled}
              />
            </div>

            {/* X (Twitter) */}
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
                placeholder="https://x.com/twiter-profiliniz"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                disabled={!twitterEnabled}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              onClick={handleSave}
              disabled={isSaving || saved}
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
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for future settings */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <SettingsIcon className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Daha Fazla Ayar Eklenecek</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            İlerleyen süreçte buraya yeni ayarlar ve entegrasyonlar eklenecek
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
