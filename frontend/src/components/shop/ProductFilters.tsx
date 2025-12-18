'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

export interface FilterState {
  priceRange: [number, number];
  materials: string[];
  categories: string[];
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  availableMaterials?: string[];
  categories?: Array<{ _id: string; name: string }>;
}

export function ProductFilters({ onFilterChange, availableMaterials = [], categories = [] }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    applyFilters({ priceRange: newRange, materials: selectedMaterials, categories: selectedCategories, inStockOnly });
  };

  const handleMaterialToggle = (material: string) => {
    const newMaterials = selectedMaterials.includes(material)
      ? selectedMaterials.filter((m) => m !== material)
      : [...selectedMaterials, material];
    setSelectedMaterials(newMaterials);
    applyFilters({ priceRange: priceRange, materials: newMaterials, categories: selectedCategories, inStockOnly });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newCategories);
    applyFilters({ priceRange, materials: selectedMaterials, categories: newCategories, inStockOnly });
  };

  const handleStockToggle = (checked: boolean) => {
    setInStockOnly(checked);
    applyFilters({ priceRange: priceRange, materials: selectedMaterials, categories: selectedCategories, inStockOnly: checked });
  };

  const applyFilters = (filters: FilterState) => {
    onFilterChange(filters);
  };

  const clearFilters = () => {
    const defaultRange: [number, number] = [0, 50000];
    setPriceRange(defaultRange);
    setSelectedMaterials([]);
    setSelectedCategories([]);
    setInStockOnly(false);
    onFilterChange({ priceRange: defaultRange, materials: [], categories: [], inStockOnly: false });
  };

  const hasActiveFilters = selectedMaterials.length > 0 || selectedCategories.length > 0 || inStockOnly || priceRange[0] > 0 || priceRange[1] < 50000;

  return (
    <Card className="sticky top-20 py-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Filtreler</CardTitle>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Temizle
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label>Fiyat Aralığı</Label>
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            min={0}
            max={50000}
            step={100}
            minStepsBetweenThumbs={1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₺{priceRange[0].toLocaleString('tr-TR')}</span>
            <span>₺{priceRange[1].toLocaleString('tr-TR')}</span>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="space-y-3">
            <Label>Kategoriler</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={selectedCategories.includes(category._id)}
                    onCheckedChange={() => handleCategoryToggle(category._id)}
                  />
                  <Label
                    htmlFor={`category-${category._id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stock Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={inStockOnly}
            onCheckedChange={handleStockToggle}
          />
          <Label
            htmlFor="inStock"
            className="text-sm font-normal cursor-pointer"
          >
            Sadece stokta olanlar
          </Label>
        </div>

        {/* Materials */}
        {availableMaterials.length > 0 && (
          <div className="space-y-3">
            <Label>Malzemeler</Label>
            <div className="space-y-2">
              {availableMaterials.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${material}`}
                    checked={selectedMaterials.includes(material)}
                    onCheckedChange={() => handleMaterialToggle(material)}
                  />
                  <Label
                    htmlFor={`material-${material}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {material}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
