
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { resolveImageUrl } from "@/lib/utils";

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    items: any[];
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
}

const CartSidebar = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartSidebarProps) => {
    const { subtotal, shipping, total } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate("/checkout");
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="flex flex-col w-full sm:max-w-lg">
                <SheetHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
                    <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                        <p className="text-xl font-medium text-muted-foreground">Your cart is empty</p>
                        <Button variant="outline" onClick={onClose}>
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-24 h-28 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                                        <img
                                            src={resolveImageUrl(item.image)}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                                                    {item.category}
                                                </p>
                                                <h4 className="font-medium text-foreground mt-1 truncate max-w-[12rem]">
                                                    {item.name}
                                                </h4>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => onRemoveItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border border-border rounded-lg">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                                                    }
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <span className="font-display font-semibold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border pt-4 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>
                                        {shipping === 0 ? (
                                            <span className="text-accent">Free</span>
                                        ) : (
                                            `$${shipping.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                {subtotal < 200 && (
                                    <p className="text-xs text-muted-foreground">
                                        Add ${(200 - subtotal).toFixed(2)} more for free shipping
                                    </p>
                                )}
                            </div>
                            <Separator />
                            <div className="flex justify-between font-display text-lg font-semibold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <Button
                                className="w-full btn-gold h-12 text-sm uppercase tracking-widest"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full text-sm text-muted-foreground"
                                onClick={onClose}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartSidebar;
