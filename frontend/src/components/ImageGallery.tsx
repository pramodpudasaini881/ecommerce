import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, resolveImageUrl } from "@/lib/utils";

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const handlePrev = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary group">
                <img
                    src={resolveImageUrl(images[selectedIndex])}
                    alt={`${productName} - Image ${selectedIndex + 1}`}
                    className={cn(
                        "w-full h-full object-cover transition-transform duration-500",
                        isZoomed && "scale-150 cursor-zoom-out"
                    )}
                    onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Zoom indicator */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm hover:bg-card"
                    onClick={() => setIsZoomed(!isZoomed)}
                >
                    <ZoomIn className="h-5 w-5" />
                </Button>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handlePrev}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleNext}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                    {selectedIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={cn(
                            "flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all",
                            selectedIndex === index
                                ? "border-accent ring-2 ring-accent/20"
                                : "border-transparent hover:border-muted-foreground/30"
                        )}
                    >
                        <img
                            src={resolveImageUrl(image)}
                            alt={`${productName} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
