
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import * as productService from "@/api/productService";
import Navbar from "@/components/Navbar";
import PromoBar from "@/components/PromoBar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { toast } from "sonner";
import { useState } from "react";

const Sale = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { addToCart, cartItems, updateQuantity, removeItem, cartItemCount } = useCart();

    const { data: products, isLoading } = useQuery({
        queryKey: ["products", "sale"],
        queryFn: () => productService.getProducts("", "", true),
    });

    const handleAddToCart = (product: any) => {
        const cartProduct = {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category?.name || "Product",
        };
        addToCart(cartProduct);
        toast.success(`${product.name} added to bag`);
        setIsCartOpen(true);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <PromoBar />
            <Navbar cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />
            <main className="flex-1">
                <div className="bg-secondary/30 py-16 mb-8">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Sale</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Exclusive deals on our premium collection. Limited time offers.
                        </p>
                    </div>
                </div>

                <ProductGrid
                    products={products?.products || []}
                    isLoading={isLoading}
                    onAddToCart={handleAddToCart}
                />
            </main>
            <Footer />
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={(id) => {
                    removeItem(id);
                    toast.success("Item removed");
                }}
            />
        </div>
    );
};

export default Sale;
