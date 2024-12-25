import React, { useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart } from 'lucide-react';
import type { Image } from '@/components/Gallery/types';

interface ImageModalProps {
  images: Image[];
  selectedImageIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onLike: (imageId: string) => void;
}

const ImageModal = ({ images, selectedImageIndex, isOpen, onClose, onLike }: ImageModalProps) => {
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Only render the component when it's actually open
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] max-h-[90vh] p-0 bg-background/95 border-none"
        onContextMenu={handleContextMenu}
      >
        <DialogTitle className="sr-only">Image Gallery</DialogTitle>
        <DialogDescription className="sr-only">
          Browse through the gallery images using left and right arrows
        </DialogDescription>
        <div className="relative w-full h-full flex items-center justify-center">
          <Carousel 
            className="w-full max-w-[90vw]"
            opts={{
              startIndex: selectedImageIndex,
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="flex items-center justify-center p-4">
                    <div className="relative">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="max-h-[80vh] w-auto object-contain"
                        loading="lazy"
                        onDragStart={handleDragStart}
                        style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
                      />
                      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-background/50 dark:bg-foreground/10 px-3 py-2 rounded-full">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLike(image.id);
                          }}
                          className="text-foreground hover:text-red-500 transition-colors"
                          aria-label="Like image"
                        >
                          <Heart size={20} />
                        </button>
                        <span className="text-foreground">{image.likes_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 dark:bg-foreground/10 border-none hover:bg-background/70 dark:hover:bg-foreground/20" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 dark:bg-foreground/10 border-none hover:bg-background/70 dark:hover:bg-foreground/20" />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;