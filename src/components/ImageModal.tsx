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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
        <Carousel className="w-full" defaultSlide={selectedImageIndex}>
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id}>
                <div className="flex items-center justify-center p-6">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="max-h-[80vh] object-contain"
                    loading="lazy"
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