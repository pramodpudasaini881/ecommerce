import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
    _id: string;
    id?: string | number; // For compatibility
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: any;
    isNew?: boolean;
    isSale?: boolean;
}

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const productId = product._id || product.id;
    const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;

    return (
        <div className="group product-card bg-card rounded-xl overflow-hidden">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <Link to={`/product/${productId}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover product-image-zoom"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                        <span className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium uppercase tracking-wider rounded">
                            New
                        </span>
                    )}
                    {product.isSale && (
                        <span className="bg-accent text-accent-foreground px-3 py-1 text-xs font-medium uppercase tracking-wider rounded">
                            Sale
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                >
                    <Heart
                        className={`h-5 w-5 transition-colors ${isWishlisted ? "fill-accent text-accent" : ""
                            }`}
                    />
                </Button>

                {/* Quick Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                        <Button
                            className="flex-1 btn-gold h-10 text-xs uppercase tracking-widest"
                            onClick={() => onAddToCart(product)}
                        >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                        </Button>
                        <Link to={`/product/${productId}`}>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 bg-card/90 hover:bg-card"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <Link to={`/product/${productId}`} className="block p-4 space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    {categoryName || "Product"}
                </p>
                <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-semibold text-foreground">
                        ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
