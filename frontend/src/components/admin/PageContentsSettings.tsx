'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, FileText, Phone, MapPin } from 'lucide-react';

interface PageContentsSettingsProps {
  settings: any;
  onChange: (settings: any) => void;
}

export function PageContentsSettings({ settings, onChange }: PageContentsSettingsProps) {
  const updateSection = (page: string, section: string, field: string, value: any) => {
    onChange({
      ...settings,
      [page]: {
        ...settings[page],
        [section]: {
          ...settings[page][section],
          [field]: value,
        },
      },
    });
  };

  const updateArrayItem = (page: string, section: string, index: number, field: string, value: any) => {
    const newItems = [...settings[page][section].items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    updateSection(page, section, 'items', newItems);
  };

  const addArrayItem = (page: string, section: string, defaultItem: any) => {
    const newItems = [...(settings[page][section].items || []), defaultItem];
    updateSection(page, section, 'items', newItems);
  };

  const removeArrayItem = (page: string, section: string, index: number) => {
    const newItems = settings[page][section].items.filter((_: any, i: number) => i !== index);
    updateSection(page, section, 'items', newItems);
  };

  // Stores-specific functions
  const updateStoreItem = (index: number, field: string, value: any) => {
    const newItems = [...(settings.stores?.items || [])];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    onChange({
      ...settings,
      stores: {
        items: newItems,
      },
    });
  };

  const addStoreItem = (defaultItem: any) => {
    const newItems = [...(settings.stores?.items || []), defaultItem];
    onChange({
      ...settings,
      stores: {
        items: newItems,
      },
    });
  };

  const removeStoreItem = (index: number) => {
    const newItems = (settings.stores?.items || []).filter((_: any, i: number) => i !== index);
    onChange({
      ...settings,
      stores: {
        items: newItems,
      },
    });
  };

  return (
    <Tabs defaultValue="about" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="about" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Hakkımızda
        </TabsTrigger>
        <TabsTrigger value="contact" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          İletişim
        </TabsTrigger>
        <TabsTrigger value="stores" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Mağazalarımız
        </TabsTrigger>
      </TabsList>

      {/* Hakkımızda Tab */}
      <TabsContent value="about" className="space-y-6">
        {/* Hakkımızda Section */}
        <Card className="py-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hakkımızda Bölümü</CardTitle>
              <Switch
                checked={settings.about?.about?.enabled ?? true}
                onCheckedChange={(checked) => updateSection('about', 'about', 'enabled', checked)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about-title">Başlık</Label>
              <Input
                id="about-title"
                value={settings.about?.about?.title || ''}
                onChange={(e) => updateSection('about', 'about', 'title', e.target.value)}
                disabled={!settings.about?.about?.enabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-content">İçerik</Label>
              <Textarea
                id="about-content"
                rows={8}
                value={settings.about?.about?.content || ''}
                onChange={(e) => updateSection('about', 'about', 'content', e.target.value)}
                disabled={!settings.about?.about?.enabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Misyon Section */}
        <Card className="py-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Misyonumuz</CardTitle>
              <Switch
                checked={settings.about?.mission?.enabled ?? true}
                onCheckedChange={(checked) => updateSection('about', 'mission', 'enabled', checked)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="mission-content">İçerik</Label>
              <Textarea
                id="mission-content"
                rows={4}
                value={settings.about?.mission?.content || ''}
                onChange={(e) => updateSection('about', 'mission', 'content', e.target.value)}
                disabled={!settings.about?.mission?.enabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vizyon Section */}
        <Card className="py-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Vizyonumuz</CardTitle>
              <Switch
                checked={settings.about?.vision?.enabled ?? true}
                onCheckedChange={(checked) => updateSection('about', 'vision', 'enabled', checked)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="vision-content">İçerik</Label>
              <Textarea
                id="vision-content"
                rows={4}
                value={settings.about?.vision?.content || ''}
                onChange={(e) => updateSection('about', 'vision', 'content', e.target.value)}
                disabled={!settings.about?.vision?.enabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card className="py-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Rakamlarla Former Mobilya</CardTitle>
              <Switch
                checked={settings.about?.stats?.enabled ?? true}
                onCheckedChange={(checked) => updateSection('about', 'stats', 'enabled', checked)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.about?.stats?.items?.map((stat: any, index: number) => (
              <div key={index} className="grid gap-4 grid-cols-12 items-end border-b pb-4 last:border-0">
                <div className="col-span-3 space-y-2">
                  <Label htmlFor={`stat-icon-${index}`}>İkon</Label>
                  <Select
                    value={stat.icon}
                    onValueChange={(value) => updateArrayItem('about', 'stats', index, 'icon', value)}
                    disabled={!settings.about?.stats?.enabled}
                  >
                    <SelectTrigger id={`stat-icon-${index}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calendar">📅 Takvim</SelectItem>
                      <SelectItem value="users">👥 Kullanıcılar</SelectItem>
                      <SelectItem value="checkCircle">✅ Onay</SelectItem>
                      <SelectItem value="award">🏆 Ödül</SelectItem>
                      <SelectItem value="star">⭐ Yıldız</SelectItem>
                      <SelectItem value="trendingUp">📈 Yükseliş</SelectItem>
                      <SelectItem value="package">📦 Paket</SelectItem>
                      <SelectItem value="home">🏠 Ev</SelectItem>
                      <SelectItem value="heart">❤️ Kalp</SelectItem>
                      <SelectItem value="thumbsUp">👍 Beğeni</SelectItem>
                      <SelectItem value="zap">⚡ Hız</SelectItem>
                      <SelectItem value="target">🎯 Hedef</SelectItem>
                      <SelectItem value="badge">🎖️ Rozet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4 space-y-2">
                  <Label htmlFor={`stat-value-${index}`}>Değer</Label>
                  <Input
                    id={`stat-value-${index}`}
                    placeholder="Örn: 15+"
                    value={stat.value}
                    onChange={(e) => updateArrayItem('about', 'stats', index, 'value', e.target.value)}
                    disabled={!settings.about?.stats?.enabled}
                  />
                </div>
                <div className="col-span-4 space-y-2">
                  <Label htmlFor={`stat-label-${index}`}>Etiket</Label>
                  <Input
                    id={`stat-label-${index}`}
                    placeholder="Örn: Yıllık Tecrübe"
                    value={stat.label}
                    onChange={(e) => updateArrayItem('about', 'stats', index, 'label', e.target.value)}
                    disabled={!settings.about?.stats?.enabled}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('about', 'stats', index)}
                    disabled={!settings.about?.stats?.enabled || settings.about.stats.items.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('about', 'stats', { icon: 'calendar', value: '', label: '' })}
              disabled={!settings.about?.stats?.enabled}
            >
              <Plus className="h-4 w-4 mr-2" />
              İstatistik Ekle
            </Button>
          </CardContent>
        </Card>

        {/* Values Section */}
        <Card className="py-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Değerlerimiz</CardTitle>
              <Switch
                checked={settings.about?.values?.enabled ?? true}
                onCheckedChange={(checked) => updateSection('about', 'values', 'enabled', checked)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.about?.values?.items?.map((value: any, index: number) => (
              <div key={index} className="space-y-4 border-b pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`value-title-${index}`}>Değer #{index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('about', 'values', index)}
                    disabled={!settings.about?.values?.enabled || settings.about.values.items.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Sil
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`value-title-${index}`}>Başlık</Label>
                  <Input
                    id={`value-title-${index}`}
                    placeholder="Örn: Kalite"
                    value={value.title}
                    onChange={(e) => updateArrayItem('about', 'values', index, 'title', e.target.value)}
                    disabled={!settings.about?.values?.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`value-content-${index}`}>İçerik</Label>
                  <Textarea
                    id={`value-content-${index}`}
                    rows={3}
                    placeholder="Değerin açıklaması..."
                    value={value.content}
                    onChange={(e) => updateArrayItem('about', 'values', index, 'content', e.target.value)}
                    disabled={!settings.about?.values?.enabled}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('about', 'values', { title: '', content: '' })}
              disabled={!settings.about?.values?.enabled}
            >
              <Plus className="h-4 w-4 mr-2" />
              Değer Ekle
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* İletişim Tab */}
      <TabsContent value="contact" className="space-y-6">
        <Card className="py-6">
          <CardHeader>
            <CardTitle>İletişim Bilgileri</CardTitle>
            <CardDescription>
              İletişim sayfasında gösterilecek bilgileri düzenleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Telefon</Label>
                <Input
                  id="contact-phone"
                  placeholder="+90 (XXX) XXX XX XX"
                  value={settings.contact?.phone?.value || ''}
                  onChange={(e) => updateSection('contact', 'phone', 'value', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">E-posta</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="info@example.com"
                  value={settings.contact?.email?.value || ''}
                  onChange={(e) => updateSection('contact', 'email', 'value', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-address">Adres</Label>
              <Textarea
                id="contact-address"
                rows={3}
                placeholder="Şirket adresi..."
                value={settings.contact?.address?.value || ''}
                onChange={(e) => updateSection('contact', 'address', 'value', e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-workdays">Çalışma Günleri</Label>
                <Input
                  id="contact-workdays"
                  placeholder="Pazartesi - Cumartesi"
                  value={settings.contact?.workdays?.value || ''}
                  onChange={(e) => updateSection('contact', 'workdays', 'value', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-workhours">Çalışma Saatleri</Label>
                <Input
                  id="contact-workhours"
                  placeholder="09:00 - 18:00"
                  value={settings.contact?.workhours?.value || ''}
                  onChange={(e) => updateSection('contact', 'workhours', 'value', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-map">Harita Embed Kodu</Label>
              <Textarea
                id="contact-map"
                rows={4}
                placeholder="<iframe src='...' ..."
                value={settings.contact?.mapEmbed?.value || ''}
                onChange={(e) => updateSection('contact', 'mapEmbed', 'value', e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Google Maps'ten aldığınız embed kodunu buraya yapıştırın
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Mağazalarımız Tab */}
      <TabsContent value="stores" className="space-y-6">
        <Card className="py-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mağazalar</CardTitle>
              <CardDescription>
                Şubelerinizi ve mağazalarınızı ekleyin
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.stores?.items?.map((store: any, index: number) => (
              <div key={index} className="space-y-4 border-b pb-6 last:border-0">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Mağaza #{index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStoreItem(index)}
                    disabled={(settings.stores?.items?.length || 0) <= 1}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Sil
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`store-name-${index}`}>Mağaza Adı</Label>
                    <Input
                      id={`store-name-${index}`}
                      placeholder="Örn: İstanbul Şubesi"
                      value={store.name || ''}
                      onChange={(e) => updateStoreItem(index, 'name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`store-address-${index}`}>Adres</Label>
                    <Textarea
                      id={`store-address-${index}`}
                      rows={2}
                      placeholder="Mağaza adresi..."
                      value={store.address || ''}
                      onChange={(e) => updateStoreItem(index, 'address', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`store-phone-${index}`}>Telefon</Label>
                      <Input
                        id={`store-phone-${index}`}
                        placeholder="+90 (XXX) XXX XX XX"
                        value={store.phone || ''}
                        onChange={(e) => updateStoreItem(index, 'phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`store-email-${index}`}>E-posta</Label>
                      <Input
                        id={`store-email-${index}`}
                        type="email"
                        placeholder="magaza@example.com"
                        value={store.email || ''}
                        onChange={(e) => updateStoreItem(index, 'email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`store-workdays-${index}`}>Çalışma Günleri</Label>
                      <Input
                        id={`store-workdays-${index}`}
                        placeholder="Pazartesi - Cumartesi"
                        value={store.workdays || ''}
                        onChange={(e) => updateStoreItem(index, 'workdays', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`store-workhours-${index}`}>Çalışma Saatleri</Label>
                      <Input
                        id={`store-workhours-${index}`}
                        placeholder="09:00 - 18:00"
                        value={store.workhours || ''}
                        onChange={(e) => updateStoreItem(index, 'workhours', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`store-map-${index}`}>Harita Embed Kodu</Label>
                    <Textarea
                      id={`store-map-${index}`}
                      rows={3}
                      placeholder="<iframe src='...' ..."
                      value={store.mapEmbed || ''}
                      onChange={(e) => updateStoreItem(index, 'mapEmbed', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addStoreItem({ 
                name: '', 
                address: '', 
                phone: '', 
                email: '', 
                workdays: '', 
                workhours: '', 
                mapEmbed: '' 
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Mağaza Ekle
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

