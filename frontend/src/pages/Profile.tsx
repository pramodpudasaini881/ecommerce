import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, Package, LogOut, Plus, Trash2, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/api/orderService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Profile = () => {
    const { user, isAuthenticated, logout, updateProfile, addAddress, removeAddress, setDefaultAddress } = useAuth();
    const { toast } = useToast();
    const { data: orders, isLoading: isLoadingOrders } = useQuery({
        queryKey: ["myOrders"],
        queryFn: getMyOrders,
        enabled: isAuthenticated
    });
    const [name, setName] = useState(user?.name || "");
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        isDefault: false,
    });

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleUpdateProfile = () => {
        updateProfile({ name });
        toast({ title: "Profile updated", description: "Your profile has been saved." });
    };

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        addAddress(newAddress);
        setNewAddress({
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "United States",
            isDefault: false,
        });
        setShowAddressForm(false);
        toast({ title: "Address added", description: "Your new address has been saved." });
    };

    const handleLogout = () => {
        logout();
        toast({ title: "Logged out", description: "You have been signed out." });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-display font-bold">My Account</h1>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>

                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="addresses" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Addresses
                            </TabsTrigger>
                            <TabsTrigger value="orders" className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Orders
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-6">
                            <div className="bg-card border rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="profileName">Full Name</Label>
                                        <Input
                                            id="profileName"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-1.5 max-w-md"
                                        />
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <p className="text-muted-foreground mt-1.5">{user?.email}</p>
                                    </div>
                                    <Button onClick={handleUpdateProfile} className="btn-gold">
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="addresses" className="space-y-6">
                            <div className="bg-card border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Saved Addresses</h2>
                                    <Button onClick={() => setShowAddressForm(!showAddressForm)} variant="outline">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Address
                                    </Button>
                                </div>

                                {showAddressForm && (
                                    <form onSubmit={handleAddAddress} className="border rounded-lg p-4 mb-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={newAddress.firstName}
                                                    onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                                                    required
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={newAddress.lastName}
                                                    onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                                                    required
                                                    className="mt-1.5"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="addressLine">Address</Label>
                                            <Input
                                                id="addressLine"
                                                value={newAddress.address}
                                                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                                required
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    required
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="state">State</Label>
                                                <Input
                                                    id="state"
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    required
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="zipCode">ZIP Code</Label>
                                                <Input
                                                    id="zipCode"
                                                    value={newAddress.zipCode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                                    required
                                                    className="mt-1.5"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit" className="btn-gold">Save Address</Button>
                                            <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {user?.addresses.length === 0 ? (
                                    <p className="text-muted-foreground">No saved addresses yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {user?.addresses.map((address) => (
                                            <div key={address.id} className="border rounded-lg p-4 flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">
                                                        {address.firstName} {address.lastName}
                                                        {address.isDefault && (
                                                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                                Default
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {address.address}<br />
                                                        {address.city}, {address.state} {address.zipCode}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {!address.isDefault && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setDefaultAddress(address.id)}
                                                        >
                                                            <Star className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeAddress(address.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="orders" className="space-y-6">
                            <div className="bg-card border rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">Order History</h2>
                                {isLoadingOrders ? (
                                    <p className="text-muted-foreground">Loading orders...</p>
                                ) : orders?.length === 0 ? (
                                    <p className="text-muted-foreground">No orders yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders?.map((order: any) => (
                                            <div key={order._id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-medium">Order #{order._id}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className={`text-sm px-2 py-1 rounded ${order.isDelivered
                                                        ? "bg-green-500/10 text-green-500"
                                                        : order.isPaid
                                                            ? "bg-blue-500/10 text-blue-500"
                                                            : "bg-yellow-500/10 text-yellow-500"
                                                        }`}>
                                                        {order.isDelivered ? "Delivered" : order.isPaid ? "Paid" : "Processing"}
                                                    </span>
                                                </div>
                                                <p className="text-lg font-semibold">${order.totalPrice.toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
