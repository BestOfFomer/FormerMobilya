'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface AboutPageSettingsProps {
  settings: any;
  onChange: (settings: any) => void;
}

export function AboutPageSettings({ settings, onChange }: AboutPageSettingsProps) {
  const updateSection = (section: string, field: string, value: any) => {
    onChange({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  const updateArrayItem = (section: string, index: number, field: string, value: any) => {
    const newItems = [...settings[section].items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    updateSection(section, 'items', newItems);
  };

  const addArrayItem = (section: string, defaultItem: any) => {
    const newItems = [...settings[section].items, defaultItem];
    updateSection(section, 'items', newItems);
  };

  const removeArrayItem = (section: string, index: number) => {
    const newItems = settings[section].items.filter((_: any, i: number) => i !== index);
    updateSection(section, 'items', newItems);
  };

  return (
    <div className="space-y-6">
      {/* Hakkımızda Section */}
      <Card className="py-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Hakkımızda Bölümü</CardTitle>
            <Switch
              checked={settings.about?.enabled ?? true}
              onCheckedChange={(checked) => updateSection('about', 'enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about-title">Başlık</Label>
            <Input
              id="about-title"
              value={settings.about?.title || ''}
              onChange={(e) => updateSection('about', 'title', e.target.value)}
              disabled={!settings.about?.enabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="about-content">İçerik</Label>
            <Textarea
              id="about-content"
              rows={8}
              value={settings.about?.content || ''}
              onChange={(e) => updateSection('about', 'content', e.target.value)}
              disabled={!settings.about?.enabled}
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
              checked={settings.mission?.enabled ?? true}
              onCheckedChange={(checked) => updateSection('mission', 'enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="mission-content">İçerik</Label>
            <Textarea
              id="mission-content"
              rows={4}
              value={settings.mission?.content || ''}
              onChange={(e) => updateSection('mission', 'content', e.target.value)}
              disabled={!settings.mission?.enabled}
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
              checked={settings.vision?.enabled ?? true}
              onCheckedChange={(checked) => updateSection('vision', 'enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="vision-content">İçerik</Label>
            <Textarea
              id="vision-content"
              rows={4}
              value={settings.vision?.content || ''}
              onChange={(e) => updateSection('vision', 'content', e.target.value)}
              disabled={!settings.vision?.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card className="py-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rakamlarla Fomer Mobilya</CardTitle>
            <Switch
              checked={settings.stats?.enabled ?? true}
              onCheckedChange={(checked) => updateSection('stats', 'enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.stats?.items?.map((stat: any, index: number) => (
            <div key={index} className="grid gap-4 grid-cols-12 items-end border-b pb-4 last:border-0">
              <div className="col-span-3 space-y-2">
                <Label htmlFor={`stat-icon-${index}`}>İkon</Label>
                <Select
                  value={stat.icon}
                  onValueChange={(value) => updateArrayItem('stats', index, 'icon', value)}
                  disabled={!settings.stats?.enabled}
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
                  onChange={(e) => updateArrayItem('stats', index, 'value', e.target.value)}
                  disabled={!settings.stats?.enabled}
                />
              </div>
              <div className="col-span-4 space-y-2">
                <Label htmlFor={`stat-label-${index}`}>Etiket</Label>
                <Input
                  id={`stat-label-${index}`}
                  placeholder="Örn: Yıllık Tecrübe"
                  value={stat.label}
                  onChange={(e) => updateArrayItem('stats', index, 'label', e.target.value)}
                  disabled={!settings.stats?.enabled}
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('stats', index)}
                  disabled={!settings.stats?.enabled || settings.stats.items.length <= 1}
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
            onClick={() => addArrayItem('stats', { icon: 'calendar', value: '', label: '' })}
            disabled={!settings.stats?.enabled}
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
              checked={settings.values?.enabled ?? true}
              onCheckedChange={(checked) => updateSection('values', 'enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.values?.items?.map((value: any, index: number) => (
            <div key={index} className="space-y-4 border-b pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <Label htmlFor={`value-title-${index}`}>Değer #{index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem('values', index)}
                  disabled={!settings.values?.enabled || settings.values.items.length <= 1}
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
                  onChange={(e) => updateArrayItem('values', index, 'title', e.target.value)}
                  disabled={!settings.values?.enabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`value-content-${index}`}>İçerik</Label>
                <Textarea
                  id={`value-content-${index}`}
                  rows={3}
                  placeholder="Değerin açıklaması..."
                  value={value.content}
                  onChange={(e) => updateArrayItem('values', index, 'content', e.target.value)}
                  disabled={!settings.values?.enabled}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('values', { title: '', content: '' })}
            disabled={!settings.values?.enabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Değer Ekle
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
