import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";
import { resolveImageUrl } from "@/lib/utils";

const OrderSummary = () => {
    const { cartItems, subtotal, shipping, total } = useCart();

    return (
        <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                            <img
                                src={resolveImageUrl(item.image)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                {item.category}
                            </p>
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <p className="text-sm font-semibold mt-1">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                        {shipping === 0 ? (
                            <span className="text-accent">Free</span>
                        ) : (
                            `$${shipping.toFixed(2)}`
                        )}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>Calculated at checkout</span>
                </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-display text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default OrderSummary;
