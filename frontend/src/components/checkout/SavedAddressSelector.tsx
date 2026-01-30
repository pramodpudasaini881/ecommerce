import { MapPin, Plus, Check } from "lucide-react";
import { Address } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SavedAddressSelectorProps {
    addresses: Address[];
    selectedAddressId: string | null;
    onSelectAddress: (address: Address) => void;
    onUseNewAddress: () => void;
    useNewAddress: boolean;
}

const SavedAddressSelector = ({
    addresses,
    selectedAddressId,
    onSelectAddress,
    onUseNewAddress,
    useNewAddress,
}: SavedAddressSelectorProps) => {
    if (addresses.length === 0) return null;

    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Select a saved address
            </h3>
            <div className="grid gap-3">
                {addresses.map((address) => (
                    <button
                        key={address.id}
                        type="button"
                        onClick={() => onSelectAddress(address)}
                        className={cn(
                            "relative flex items-start gap-3 p-4 rounded-lg border text-left transition-all",
                            selectedAddressId === address.id && !useNewAddress
                                ? "border-accent bg-accent/5 ring-1 ring-accent"
                                : "border-border hover:border-muted-foreground/50"
                        )}
                    >
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">
                                {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {address.address}
                                {address.apartment && `, ${address.apartment}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.zipCode}
                            </p>
                            {address.isDefault && (
                                <span className="inline-block mt-1 text-xs bg-secondary px-2 py-0.5 rounded">
                                    Default
                                </span>
                            )}
                        </div>
                        {selectedAddressId === address.id && !useNewAddress && (
                            <Check className="h-5 w-5 text-accent shrink-0" />
                        )}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={onUseNewAddress}
                    className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border transition-all",
                        useNewAddress
                            ? "border-accent bg-accent/5 ring-1 ring-accent"
                            : "border-dashed border-border hover:border-muted-foreground/50"
                    )}
                >
                    <Plus className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Use a new address</span>
                    {useNewAddress && <Check className="h-5 w-5 text-accent ml-auto" />}
                </button>
            </div>
        </div>
    );
};

export default SavedAddressSelector;
