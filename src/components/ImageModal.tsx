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
import { Heart } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Image = Database['public']['Tables']['images']['Row'] & {
  likes_count?: number;
};

interface ImageModalProps {
  images: Image[];
  selectedImageIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onLike: (imageId: string) => void;
}

const ImageModal = ({ images, selectedImageIndex, isOpen, onClose, onLike }: ImageModalProps) => {
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
        className="max-w-[95vw] h-[90vh] p-6 bg-background"
        onContextMenu={handleContextMenu}
      >
        <Carousel 
          className="w-full h-full"
          opts={{
            startIndex: selectedImageIndex,
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="h-full">
            {images.map((image) => (
              <CarouselItem key={image.id} className="h-full flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="max-h-[75vh] w-auto object-contain"
                    loading="lazy"
                    onDragStart={handleDragStart}
                    style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/50 px-3 py-2 rounded-full">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike(image.id);
                      }}
                      className="text-white hover:text-red-500 transition-colors"
                    >
                      <Heart size={20} />
                    </button>
                    <span className="text-white">{image.likes_count || 0}</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;