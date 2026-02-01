import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Heart, Share2, Truck, RotateCcw, Shield, Minus, Plus } from "lucide-react";
import { getProductById, createProductReview } from "@/api/productService";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import PromoBar from "@/components/PromoBar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import ImageGallery from "@/components/ImageGallery";
import SizeSelector from "@/components/SizeSelector";
import ReviewsSection from "@/components/ReviewsSection";
import RelatedProducts from "@/components/RelatedProducts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";


const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart, cartItems, updateQuantity, removeItem, cartItemCount } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id as string),
        enabled: !!id,
    });

    const queryClient = useQueryClient();
    const reviewMutation = useMutation({
        mutationFn: (review: { rating: number; comment: string }) =>
            createProductReview(id as string, review),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product", id] });
            toast.success("Review submitted successfully!");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to submit review");
        }
    });

    const handleAddToCart = (item: any) => {
        // If it's the main product on the page, check for size
        if (item._id === product?._id && product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast.error("Please select a size");
            return;
        }

        const cartProduct = {
            id: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category?.name || "Product",
            quantity: quantity,
        };

        addToCart(cartProduct);
        toast.success(`${item.name} added to bag`);
        setIsCartOpen(true);
    };

    const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
        updateQuantity(itemId, newQuantity);
    };

    const handleRemoveItem = (itemId: string) => {
        removeItem(itemId);
        toast.success("Item removed from bag");
    };

    if (isLoading) return <div className="text-center py-20">Loading product...</div>;
    if (error || !product) return <div className="text-center py-20">Product not found.</div>;

    const mockProduct = product;
    const mockReviews = product.reviews || [];
    const relatedProducts: any[] = []; // In a real app, you'd fetch this

    return (
        <div className="min-h-screen bg-background">
            <PromoBar />
            <Navbar cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-8">
                    <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                        Home
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">{mockProduct.category?.name || "Product"}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-foreground">{mockProduct.name}</span>
                </div>

                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Shop
                </Link>

                {/* Product Section */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Gallery */}
                    <ImageGallery images={mockProduct.images || [mockProduct.image]} productName={mockProduct.name} />

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                                {mockProduct.category?.name || "Product"}
                            </p>
                            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                                {mockProduct.name}
                            </h1>
                            <div className="flex items-baseline gap-3">
                                <span className="font-display text-2xl font-semibold">
                                    ${mockProduct.price?.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                            {mockProduct.description}
                        </p>

                        <Separator />

                        {/* Size Selector */}
                        {mockProduct.sizes && mockProduct.sizes.length > 0 && (
                            <SizeSelector
                                sizes={mockProduct.sizes}
                                selectedSize={selectedSize}
                                onSelectSize={setSelectedSize}
                                outOfStock={[]}
                            />
                        )}

                        {/* Quantity */}
                        <div className="space-y-3">
                            <span className="text-sm font-medium">Quantity</span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border rounded-lg">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                className="flex-1 btn-gold h-14 text-sm uppercase tracking-widest"
                                onClick={() => handleAddToCart(mockProduct)}
                            >
                                Add to Bag
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-14 w-14"
                                onClick={() => {
                                    setIsWishlisted(!isWishlisted);
                                    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
                                }}
                            >
                                <Heart
                                    className={`h-5 w-5 transition-colors ${isWishlisted ? "fill-accent text-accent" : ""
                                        }`}
                                />
                            </Button>
                            <Button variant="outline" size="icon" className="h-14 w-14">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-3 gap-4 py-6">
                            <div className="text-center space-y-2">
                                <div className="w-10 h-10 mx-auto rounded-full bg-secondary flex items-center justify-center">
                                    <Truck className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground">Free Shipping</p>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="w-10 h-10 mx-auto rounded-full bg-secondary flex items-center justify-center">
                                    <RotateCcw className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground">30-Day Returns</p>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="w-10 h-10 mx-auto rounded-full bg-secondary flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground">2-Year Warranty</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Accordion Details */}
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="details">
                                <AccordionTrigger className="text-sm font-medium">
                                    Product Details
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-sm text-muted-foreground leading-relaxed">
                                        {mockProduct.description}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="shipping">
                                <AccordionTrigger className="text-sm font-medium">
                                    Shipping & Returns
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        <p>Free standard shipping on all orders over $200.</p>
                                        <p>
                                            Express shipping available for an additional $25. Delivery
                                            within 2-3 business days.
                                        </p>
                                        <p>
                                            Returns accepted within 30 days of purchase. Items must be
                                            unworn with original tags attached.
                                        </p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>

                <Separator className="my-16" />

                {/* Reviews Section */}
                <ReviewsSection
                    reviews={mockReviews as any}
                    averageRating={mockProduct.rating}
                    totalReviews={mockProduct.numReviews}
                    onAddReview={(rating: number, comment: string) => reviewMutation.mutate({ rating, comment })}
                    isSubmitting={reviewMutation.isPending}
                />

                <Separator className="my-16" />

                {/* Related Products */}
                <RelatedProducts products={relatedProducts} onAddToCart={handleAddToCart} />
            </main>

            <Footer />
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
            />
        </div>
    );
};

export default ProductDetail;
