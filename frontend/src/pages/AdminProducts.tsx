import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Package,
    Plus,
    Search,
    Edit2,
    Trash2,
    MoreHorizontal,
    ExternalLink,
    AlertCircle,
    Upload,
    Image as ImageIcon,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import * as productService from "@/api/productService";
import { getAllCategories } from "@/api/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, resolveImageUrl } from "@/lib/utils";

const AdminProducts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        description: "",
        image: "",
        category: "",
        countInStock: 0,
        salePrice: 0,
        brand: "Generic",
    });

    const queryClient = useQueryClient();

    const { data: productsData, isLoading } = useQuery({
        queryKey: ["adminProducts", searchTerm],
        queryFn: () => productService.getProducts(searchTerm),
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            setUploading(true);
            try {
                const res = await productService.uploadImage(formData);
                setFormData((prev) => ({ ...prev, image: res.image }));
                toast.success("Image uploaded successfully");
            } catch (error) {
                toast.error("Failed to upload image");
            } finally {
                setUploading(false);
            }
        }
    };

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
            toast.success("Product deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete product");
        }
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => productService.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
            toast.success("Product created successfully");
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create product");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            productService.updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
            toast.success("Product updated successfully");
            setIsDialogOpen(false);
            setEditingProduct(null);
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update product");
        }
    });

    const resetForm = () => {
        setFormData({
            name: "",
            price: 0,
            description: "",
            image: "",
            category: "",
            countInStock: 0,
            salePrice: 0,
            brand: "Generic",
        });
    };

    const handleEditClick = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: typeof product.category === 'string' ? product.category : product.category?._id,
            countInStock: product.countInStock,
            salePrice: product.salePrice || 0,
            brand: product.brand || "Generic",
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            updateMutation.mutate({ id: editingProduct._id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const products = productsData?.products || [];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold mb-8">Ecommerce App Products</h1>
                    <p className="text-muted-foreground">
                        Manage your product catalog, inventory, and pricing.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingProduct(null);
                        resetForm();
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="btn-gold gap-2 shadow-sm hover:shadow-md transition-all">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                            <DialogDescription>
                                Fill in the details for your product here.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            {/* Improved Image Upload Section */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Product Image</label>
                                <div className="flex items-start gap-4">
                                    <div className="h-24 w-24 rounded-lg border-2 border-dashed border-input flex items-center justify-center bg-secondary/20 overflow-hidden relative group">
                                        {formData.image ? (
                                            <img
                                                src={resolveImageUrl(formData.image)}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex gap-2">
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={uploadFileHandler}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById("image-upload")?.click()}
                                                disabled={uploading}
                                                className="w-full"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload Image
                                            </Button>
                                        </div>
                                        <Input
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="Or enter image URL"
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Product name"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Price ($)</label>
                                        <Input
                                            required
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Sale Price ($)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={formData.salePrice}
                                            onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) })}
                                            placeholder="0.00 (Optional)"
                                            className="border-dashed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tell customers about this product..."
                                    className="h-24 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(val) => setFormData({ ...formData, category: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(categories || []).map((cat: any) => (
                                                <SelectItem key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Stock Quantity</label>
                                    <Input
                                        required
                                        type="number"
                                        value={formData.countInStock}
                                        onChange={(e) => setFormData({ ...formData, countInStock: parseInt(e.target.value) })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="submit" className="btn-gold w-full" disabled={createMutation.isPending || updateMutation.isPending || uploading}>
                                    {editingProduct ? "Update Product" : "Create Product"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-background pb-0">
                    <div className="flex items-center gap-4 py-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-10 h-10 bg-secondary/20 border-transparent focus:border-input focus:bg-background transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border/50">
                                <TableHead className="w-[100px]">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            <span>Loading products...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Package className="h-8 w-8 opacity-50" />
                                            <span>No products found. Add your first product!</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product: any) => (
                                    <TableRow key={product._id} className="group hover:bg-secondary/30 transition-colors">
                                        <TableCell>
                                            <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden border border-border/50">
                                                <img
                                                    src={resolveImageUrl(product.image)}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>
                                            <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground/80">
                                                {product.category?.name || "Uncategorized"}
                                            </span>
                                        </TableCell>
                                        <TableCell>${product.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <span className={product.countInStock < 10 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                                                {product.countInStock}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleEditClick(product)}>
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-500 focus:text-red-600" onClick={() => deleteMutation.mutate(product._id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminProducts;
