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
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imageData, setImageData] = useState({
    title: '',
    category: '',
    alt: '',
    aspectRatio: ''
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

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

      const fileExt = file.name.split('.').pop();
      const fileName = `${imageData.category}/${crypto.randomUUID()}.${fileExt}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (storageError) {
        throw storageError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('images')
        .insert({
          title: imageData.title,
          category: imageData.category,
          url: publicUrl,
          alt: imageData.alt,
          aspect_ratio: imageData.aspectRatio
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      setImageData({
        title: '',
        category: '',
        alt: '',
        aspectRatio: ''
      });
      if (event.target) {
        event.target.value = '';
      }

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <div className="max-w-md space-y-4 bg-white p-6 rounded-lg shadow-sm">
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
              className="hidden"
              id="file-upload"
            />
            <Button 
              type="button" 
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;