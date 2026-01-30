import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import * as productService from "@/api/productService";
import Navbar from "@/components/Navbar";
import PromoBar from "@/components/PromoBar";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";

import { useSearchParams } from "react-router-dom";

const Index = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cartItems, addToCart, updateQuantity, removeItem, cartItemCount } = useCart();
    const [searchParams] = useSearchParams();

    const search = searchParams.get("search") || "";
    const categoryQuery = searchParams.get("category") || "";

    const { data: products, isLoading } = useQuery({
        queryKey: ["products", search, categoryQuery],
        queryFn: () => productService.getProducts(search, categoryQuery),
    });

    const handleAddToCart = (product: any) => {
        // Map backend product to cart product structure
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

    const handleRemoveItem = (id: number) => {
        removeItem(id);
        toast.success("Item removed from bag");
    };

    return (
        <div className="min-h-screen bg-background">
            <PromoBar />
            <Navbar cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />
            <main>
                <HeroSection />
                <ProductGrid
                    onAddToCart={handleAddToCart}
                    products={products?.products || []}
                    isLoading={isLoading}
                />
                <CategorySection />
            </main>
            <Footer />
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={handleRemoveItem}
            />
        </div>
    );
};

export default Index;
