import React, { useEffect } from 'react';
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
  useEffect(() => {
    console.log('ImageModal rendered with:', {
      isOpen,
      selectedImageIndex,
      totalImages: images.length
    });
  }, [isOpen, selectedImageIndex, images.length]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] max-h-[90vh] p-0 bg-black/95"
        onContextMenu={handleContextMenu}
      >
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
              {images.map((image, index) => (
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
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;