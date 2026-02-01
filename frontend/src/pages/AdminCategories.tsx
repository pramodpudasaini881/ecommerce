import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Layers,
    Plus,
    Search,
    Edit2,
    Trash2,
    MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import * as categoryService from "@/api/categoryService";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AdminCategories = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const queryClient = useQueryClient();

    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: categoryService.getAllCategories,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => categoryService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete category");
        }
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => categoryService.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category created successfully");
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create category");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            categoryService.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category updated successfully");
            setIsDialogOpen(false);
            setEditingCategory(null);
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update category");
        }
    });

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
        });
    };

    const handleEditClick = (category: any) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory._id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const filteredCategories = categories?.filter((cat: any) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">
                        Manage product categories for your store.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingCategory(null);
                        resetForm();
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="btn-gold gap-2">
                            <Plus className="h-4 w-4" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                            <DialogDescription>
                                Create or modify a product category.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Category name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe this category..."
                                    className="h-32"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="btn-gold w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                                    {editingCategory ? "Update Category" : "Create Category"}
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
                                placeholder="Search categories..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        Loading categories...
                                    </TableCell>
                                </TableRow>
                            ) : filteredCategories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCategories.map((category: any) => (
                                    <TableRow key={category._id} className="group">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Layers className="h-4 w-4 text-muted-foreground" />
                                                {category.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{category.description || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleEditClick(category)}>
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-500" onClick={() => deleteMutation.mutate(category._id)}>
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

export default AdminCategories;
