import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export const handleImageLike = async (imageId: string) => {
  try {
    const { error } = await supabase
      .from('likes')
      .insert({ image_id: imageId });

    if (error) {
      console.error('Error liking image:', error);
      toast.error('Failed to like image');
      return false;
    }

    toast.success('Image liked!');
    return true;
  } catch (error) {
    console.error('Error in handleLike:', error);
    toast.error('Failed to like image');
    return false;
  }
};