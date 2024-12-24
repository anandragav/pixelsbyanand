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
        className="max-w-[90vw] max-h-[90vh] p-0 bg-black"
        onContextMenu={handleContextMenu}
      >
        <Carousel 
          className="w-full select-none" 
          defaultIndex={selectedImageIndex}
        >
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id}>
                <div className="flex items-center justify-center p-6 relative">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="max-h-[80vh] object-contain pointer-events-none"
                    loading="lazy"
                    onDragStart={handleDragStart}
                    style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
                  />
                  <div className="absolute bottom-8 right-8 flex items-center gap-1 bg-black/50 px-3 py-2 rounded-full">
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
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;