import React from "react";
import { LayoutGrid } from "@/components/LayoutGrid";
import { useImages } from "@/hooks/useImages";

const Nature = () => {
  const { data: images, isLoading, error } = useImages("nature");

  if (error) {
    console.error('Nature page error:', error);
    return (
      <div className="text-center py-8 text-foreground">
        Error loading images. Please try refreshing the page.
      </div>
    );
  }

  if (isLoading || !images) {
    return <div className="text-center py-8 text-foreground">Loading...</div>;
  }

  const cards = images.map((image, index) => ({
    id: index + 1,
    content: (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-white text-2xl">{image.title}</p>
        <p className="text-white/80">{image.alt}</p>
      </div>
    ),
    className: "h-[400px] md:h-[700px] relative",
    thumbnail: image.url
  }));

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-4xl font-bold text-center pt-8 pb-4 text-foreground">Nature Portfolio</h1>
      <LayoutGrid cards={cards} />
    </div>
  );
};

export default Nature;