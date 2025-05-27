'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: string[];
  altText: string;
  productNameHint?: string;
}

export function ProductImageGallery({ images, altText, productNameHint }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    const placeholderHint = productNameHint ? productNameHint.split(" ")[0].toLowerCase() + " placeholder" : "product placeholder";
    return (
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <Image
            src="https://placehold.co/600x600.png"
            alt="No image available"
            width={600}
            height={600}
            className="aspect-square object-cover w-full rounded-lg"
            data-ai-hint={placeholderHint}
          />
        </CardContent>
      </Card>
    );
  }

  const currentImage = images[currentIndex];
  const imageHint = currentImage.includes('placehold.co') && productNameHint ? productNameHint.split(" ")[0].toLowerCase() + " detail" : undefined;


  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden shadow-lg relative">
        <CardContent className="p-0">
          <Image
            src={currentImage}
            alt={`${altText} - Image ${currentIndex + 1}`}
            width={600}
            height={600}
            className="aspect-square object-cover w-full rounded-t-lg transition-opacity duration-300 ease-in-out"
            priority={currentIndex === 0} // Prioritize loading the first image
            data-ai-hint={imageHint}
          />
        </CardContent>
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </Card>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((img, index) => {
            const thumbHint = img.includes('placehold.co') && productNameHint ? productNameHint.split(" ")[0].toLowerCase() + " thumbnail" : undefined;
            return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all',
                currentIndex === index ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img}
                alt={`${altText} - Thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="aspect-square object-cover w-full"
                data-ai-hint={thumbHint}
              />
            </button>
          )})}
        </div>
      )}
    </div>
  );
}
