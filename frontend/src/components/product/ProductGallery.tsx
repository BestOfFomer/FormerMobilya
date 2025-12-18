'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Model3DViewer } from './Model3DViewer';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  model3D?: string;
  sketchfabEmbed?: string;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
}

export function ProductGallery({ images, productName, model3D, sketchfabEmbed, dimensions }: ProductGalleryProps) {
  // Extract iframe src from Sketchfab embed HTML
  const extractSketchfabSrc = (embedHtml: string): string | null => {
    const match = embedHtml.match(/src="([^"]+)"/i);
    return match ? match[1] : null;
  };

  const sketchfabSrc = sketchfabEmbed ? extractSketchfabSrc(sketchfabEmbed) : null;
  
  // Calculate total slides: images + optional 3D model + optional Sketchfab
  const has3D = !!model3D;
  const hasSketchfab = !!sketchfabSrc;
  const totalSlides = images.length + (has3D ? 1 : 0) + (hasSketchfab ? 1 : 0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleImageChange = (newIndex: number) => {
    if (newIndex === selectedIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIndex(newIndex);
      setIsTransitioning(false);
    }, 100);
  };

  const handlePrevious = () => {
    const newIndex = selectedIndex === 0 ? totalSlides - 1 : selectedIndex - 1;
    handleImageChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedIndex === totalSlides - 1 ? 0 : selectedIndex + 1;
    handleImageChange(newIndex);
  };

  // Determine what to display
  const isModel3DSlide = has3D && selectedIndex === images.length;
  const isSketchfabSlide = hasSketchfab && selectedIndex === images.length + (has3D ? 1 : 0);
  const currentImage = !isModel3DSlide && !isSketchfabSlide ? (images[selectedIndex] || '/placeholder.jpg') : '';

  return (
    <div className="space-y-4">
      {/* Main Image with Carousel Navigation */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
        <div
          key={selectedIndex}
          className={cn(
            "relative w-full h-full transition-opacity duration-300",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}
        >
          {isSketchfabSlide ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <iframe
                src={sketchfabSrc!}
                title="Sketchfab 3D Model"
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />
            </div>
          ) : isModel3DSlide ? (
            <Model3DViewer
              modelUrl={model3D!}
              productName={productName}
              dimensions={dimensions}
            />
          ) : (
            <Image
              src={currentImage}
              alt={`${productName} - Görsel ${selectedIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="object-cover"
              priority={selectedIndex === 0}
              loading={selectedIndex === 0 ? "eager" : "lazy"}
              unoptimized
            />
          )}
        </div>

        {/* Navigation Arrows - Visible on hover */}
        {totalSlides > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100 transition-all shadow-xl bg-white/90 hover:bg-white hover:scale-110"
              onClick={handlePrevious}
              aria-label="Önceki görsel"
            >
              <ChevronLeft className="h-5 w-5 text-black" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100 transition-all shadow-xl bg-white/90 hover:bg-white hover:scale-110"
              onClick={handleNext}
              aria-label="Sonraki görsel"
            >
              <ChevronRight className="h-5 w-5 text-black" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
            {selectedIndex + 1} / {totalSlides}
          </div>
        )}
      </div>

      {/* Minimal Thumbnail Strip */}
      {totalSlides > 1 && (
        <div className="flex gap-3 justify-center overflow-x-auto py-2 px-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageChange(index)}
              className={cn(
                'relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-300',
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary/30 scale-110 shadow-lg'
                  : 'border-border hover:border-primary/50 opacity-70 hover:opacity-100 hover:scale-105'
              )}
              aria-label={`Görsel ${index + 1}'e git`}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
          {model3D && (
            <button
              onClick={() => handleImageChange(images.length)}
              className={cn(
                'relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-muted',
                selectedIndex === images.length
                  ? 'border-primary ring-2 ring-primary/30 scale-110 shadow-lg'
                  : 'border-border hover:border-primary/50 opacity-70 hover:opacity-100 hover:scale-105'
              )}
              aria-label="3D Modele git"
            >
              <Box className="w-8 h-8 text-primary" />
            </button>
          )}
          {hasSketchfab && (
            <button
              onClick={() => handleImageChange(images.length + (has3D ? 1 : 0))}
              className={cn(
                'relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-300 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600',
                selectedIndex === images.length + (has3D ? 1 : 0)
                  ? 'border-primary ring-2 ring-primary/30 scale-110 shadow-lg'
                  : 'border-border hover:border-primary/50 opacity-70 hover:opacity-100 hover:scale-105'
              )}
              aria-label="Sketchfab'a git"
            >
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.77l7 3.5v7.46l-7-3.5V9.77zm16 7.46l-7 3.5v-7.46l7-3.5v7.46z"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
