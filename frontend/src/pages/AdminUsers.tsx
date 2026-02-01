import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Users,
    Search,
    Trash2,
    Shield,
    User as UserIcon,
    ShieldAlert,
    MoreHorizontal,
    Mail
} from "lucide-react";
import { toast } from "sonner";
import { getAllUsers, deleteUser, updateUser } from "@/api/adminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";

const AdminUsers = () => {
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: getAllUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
            toast.success("User removed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to remove user");
        }
    });

    const toggleAdminMutation = useMutation({
        mutationFn: ({ id, isAdmin }: { id: string; isAdmin: boolean }) =>
            updateUser(id, { isAdmin }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
            toast.success("User role updated");
        }
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground">
                    Manage your customer base and administrative permissions.
                </p>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-background pb-0">
                    <div className="flex items-center gap-4 py-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search users..." className="pl-10" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Loading users...
                                    </TableCell>
                                </TableRow>
                            ) : (users || []).length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                (users || []).map((user: any) => (
                                    <TableRow key={user._id} className="group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {user.isAdmin ? (
                                                <div className="flex items-center gap-1.5 text-accent">
                                                    <ShieldAlert className="h-4 w-4" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Shield className="h-4 w-4" />
                                                    <span className="text-xs font-medium uppercase tracking-wider">Customer</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>User Options</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => toggleAdminMutation.mutate({
                                                        id: user._id,
                                                        isAdmin: !user.isAdmin
                                                    })}>
                                                        <Shield className="mr-2 h-4 w-4" />
                                                        {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-500"
                                                        onClick={() => deleteMutation.mutate(user._id)}
                                                        disabled={user.isAdmin} // Prevent safety delete of admins for now
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
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

export default AdminUsers;
