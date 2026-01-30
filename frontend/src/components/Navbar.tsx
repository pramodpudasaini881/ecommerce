import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CartSidebar from "./CartSidebar";

const navLinks = [
    { name: "New Arrivals", href: "#new" },
    { name: "Women", href: "#women" },
    { name: "Men", href: "#men" },
    { name: "Accessories", href: "#accessories" },
    { name: "Sale", href: "#sale" },
];

interface NavbarProps {
    cartItemCount?: number;
    onCartClick?: () => void;
}

const Navbar = ({ cartItemCount: propCartCount, onCartClick }: NavbarProps = {}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const { cartItems, cartItemCount: contextCartCount, updateQuantity, removeItem } = useCart();
    const { isAuthenticated } = useAuth();

    const cartItemCount = propCartCount ?? contextCartCount;
    const handleCartClick = onCartClick ?? (() => setCartOpen(true));

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border">
                <nav className="container mx-auto px-4 lg:px-8">
                    <div className="flex h-16 lg:h-20 items-center justify-between">
                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>

                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <span className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-primary">
                                LUXE
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="nav-link text-sm font-medium uppercase tracking-widest"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center gap-2 lg:gap-4">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const search = formData.get("search");
                                    window.location.href = `/?search=${search}`;
                                }}
                                className="hidden lg:flex items-center bg-secondary rounded-full px-3 py-1"
                            >
                                <input
                                    name="search"
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all duration-300"
                                />
                                <Button type="submit" variant="ghost" size="icon" className="h-8 w-8">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                            <Link to={isAuthenticated ? "/profile" : "/login"}>
                                <Button variant="ghost" size="icon" className="hidden lg:flex">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="hidden lg:flex">
                                <Heart className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                                onClick={handleCartClick}
                            >
                                <ShoppingBag className="h-5 w-5" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-medium flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden border-t border-border py-4 animate-fade-in">
                            <div className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                <Link
                                    to={isAuthenticated ? "/profile" : "/login"}
                                    className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {isAuthenticated ? "My Account" : "Sign In"}
                                </Link>
                            </div>
                        </div>
                    )}
                </nav>
            </header>
            <CartSidebar
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                items={cartItems as any}
                onUpdateQuantity={updateQuantity as any}
                onRemoveItem={removeItem as any}
            />
        </>
    );
};

export default Navbar;
