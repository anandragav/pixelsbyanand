import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [imageData, setImageData] = useState({
    title: '',
    category: '',
    alt: '',
    aspectRatio: ''
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      if (!imageData.title || !imageData.category || !imageData.alt || !imageData.aspectRatio) {
        toast({
          title: "Missing fields",
          description: "Please fill in all fields before uploading",
          variant: "destructive"
        });
        return;
      }

      // Upload image to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${imageData.category}/${crypto.randomUUID()}.${fileExt}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (storageError) throw storageError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('images')
        .insert({
          title: imageData.title,
          category: imageData.category,
          url: publicUrl,
          alt: imageData.alt,
          aspect_ratio: imageData.aspectRatio
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      // Reset form
      setImageData({
        title: '',
        category: '',
        alt: '',
        aspectRatio: ''
      });
      event.target.value = '';

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="max-w-md space-y-4">
        <Input
          placeholder="Image title"
          value={imageData.title}
          onChange={(e) => setImageData(prev => ({ ...prev, title: e.target.value }))}
        />
        
        <Select
          value={imageData.category}
          onValueChange={(value) => setImageData(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nature">Nature</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Alt text"
          value={imageData.alt}
          onChange={(e) => setImageData(prev => ({ ...prev, alt: e.target.value }))}
        />

        <Select
          value={imageData.aspectRatio}
          onValueChange={(value) => setImageData(prev => ({ ...prev, aspectRatio: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="portrait">Portrait</SelectItem>
            <SelectItem value="landscape">Landscape</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>
      </div>
    </div>
  );
};

export default Admin;