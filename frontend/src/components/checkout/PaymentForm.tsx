import { useState } from "react";
import { CreditCard, Lock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentFormProps {
    onSubmit: () => void;
    onBack: () => void;
    isProcessing: boolean;
}

const PaymentForm = ({ onSubmit, onBack, isProcessing }: PaymentFormProps) => {
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardName, setCardName] = useState("");

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(" ") : value;
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        if (v.length >= 2) {
            return v.substring(0, 2) + "/" + v.substring(2, 4);
        }
        return v;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-secondary/50 rounded-lg p-4 flex items-center gap-3">
                <Lock className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">
                    Your payment information is encrypted and secure
                </p>
            </div>

            <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
            >
                <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "card"
                            ? "border-primary bg-secondary/30"
                            : "border-border hover:border-muted-foreground"
                        }`}
                >
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                            <CreditCard className="h-5 w-5" />
                            Credit / Debit Card
                        </Label>
                    </div>
                </div>

                <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "paypal"
                            ? "border-primary bg-secondary/30"
                            : "border-border hover:border-muted-foreground"
                        }`}
                >
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                            <Wallet className="h-5 w-5" />
                            PayPal
                        </Label>
                    </div>
                </div>
            </RadioGroup>

            {paymentMethod === "card" && (
                <div className="space-y-4 pt-2">
                    <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="mt-1.5"
                        />
                    </div>

                    <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative mt-1.5">
                            <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                maxLength={19}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png"
                                    alt="Visa"
                                    className="h-5 w-auto opacity-50"
                                />
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png"
                                    alt="Mastercard"
                                    className="h-5 w-auto opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                                id="expiry"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                maxLength={5}
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                                id="cvv"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                maxLength={4}
                                className="mt-1.5"
                            />
                        </div>
                    </div>
                </div>
            )}

            {paymentMethod === "paypal" && (
                <div className="bg-secondary/30 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground">
                        You will be redirected to PayPal to complete your purchase securely.
                    </p>
                </div>
            )}

            <div className="flex gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 h-12"
                    disabled={isProcessing}
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    className="flex-1 btn-gold h-12 uppercase tracking-widest"
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "Place Order"}
                </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
                This is a demo checkout. No real payment will be processed.
            </p>
        </form>
    );
};

export default PaymentForm;
