import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Database } from '@/integrations/supabase/types';

type Image = Database['public']['Tables']['images']['Row'];

interface ImageModalProps {
  images: Image[];
  selectedImageIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ images, selectedImageIndex, isOpen, onClose }: ImageModalProps) => {
  // Prevent right click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Prevent drag
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[90vw] max-h-[90vh] p-0 bg-black"
        onContextMenu={handleContextMenu}
      >
        <Carousel 
          className="w-full select-none" 
          opts={{
            startIndex: selectedImageIndex
          }}
        >
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id}>
                <div className="flex items-center justify-center p-6">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="max-h-[80vh] object-contain pointer-events-none"
                    loading="lazy"
                    onDragStart={handleDragStart}
                    style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;