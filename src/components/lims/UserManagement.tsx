
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Plus, User } from 'lucide-react';
import type { User as UserType, Role } from '@/lib/types';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface UserManagementProps {
    users: (UserType & {password?: string})[];
    setUsers: React.Dispatch<React.SetStateAction<(UserType & {password?: string})[]>>;
}

const initialUserState = {
    id: 0,
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    role: 'Viewer' as Role,
    avatar: '',
};

export default function UserManagement({ users, setUsers }: UserManagementProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<(typeof initialUserState) | null>(null);

    const handleAddNew = () => {
        setCurrentUser({ ...initialUserState, id: Math.max(...users.map(u => u.id), 0) + 1 });
        setIsModalOpen(true);
    };
    
    const handleEdit = (user: UserType) => {
        setCurrentUser(user as any); // Adapt to the form state
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!currentUser) return;
        const isEditing = users.some(u => u.id === currentUser.id);

        if (isEditing) {
            setUsers(users.map(u => u.id === currentUser.id ? (currentUser as UserType) : u));
        } else {
            const newUser = { ...currentUser, avatar: currentUser.name.split(' ').map(n=>n[0]).join('') };
            setUsers([...users, newUser]);
        }
        setIsModalOpen(false);
        setCurrentUser(null);
    };
    
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-headline text-foreground">User Management</h2>
          <p className="text-muted-foreground">Add, edit, and manage user roles and permissions.</p>
        </div>
        <Button onClick={handleAddNew}>
            <Plus className="mr-2" /> Add User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                  <TableCell><Badge className="bg-green-100 text-green-800">Active</Badge></TableCell>
                  <TableCell>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Deactivate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentUser?.id && users.some(u=>u.id===currentUser.id) ? 'Edit User' : 'Add New User'}</DialogTitle></DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input value={currentUser.name} onChange={e => setCurrentUser({...currentUser, name: e.target.value})} /></div>
                <div><Label>Username</Label><Input value={currentUser.username} onChange={e => setCurrentUser({...currentUser, username: e.target.value})} /></div>
              </div>
              <div><Label>Email</Label><Input type="email" value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value as string})} /></div>
              <div><Label>Password</Label><Input type="password" placeholder="Set or update password" onChange={e => setCurrentUser({...currentUser, password: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Department</Label><Input value={currentUser.department} onChange={e => setCurrentUser({...currentUser, department: e.target.value as string})} /></div>
                <div>
                  <Label>Role</Label>
                  <Select value={currentUser.role} onValueChange={role => setCurrentUser({...currentUser, role: role as Role})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="QC Manager">QC Manager</SelectItem>
                      <SelectItem value="QC Director">QC Director</SelectItem>
                      <SelectItem value="Analyst">Analyst</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
