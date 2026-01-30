import { cn } from "@/lib/utils";

interface SizeSelectorProps {
    sizes: string[];
    selectedSize: string | null;
    onSelectSize: (size: string) => void;
    outOfStock?: string[];
}

const SizeSelector = ({
    sizes,
    selectedSize,
    onSelectSize,
    outOfStock = [],
}: SizeSelectorProps) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Select Size</span>
                <button className="text-xs text-muted-foreground hover:text-accent transition-colors underline">
                    Size Guide
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                    const isOutOfStock = outOfStock.includes(size);
                    const isSelected = selectedSize === size;

                    return (
                        <button
                            key={size}
                            onClick={() => !isOutOfStock && onSelectSize(size)}
                            disabled={isOutOfStock}
                            className={cn(
                                "min-w-[3rem] px-4 py-2.5 text-sm font-medium rounded-lg border transition-all",
                                isSelected
                                    ? "border-accent bg-accent text-accent-foreground"
                                    : "border-border bg-card hover:border-accent",
                                isOutOfStock &&
                                "opacity-40 cursor-not-allowed line-through hover:border-border"
                            )}
                        >
                            {size}
                        </button>
                    );
                })}
            </div>
            {selectedSize && (
                <p className="text-xs text-muted-foreground">
                    Selected: <span className="font-medium text-foreground">{selectedSize}</span>
                </p>
            )}
        </div>
    );
};

export default SizeSelector;
