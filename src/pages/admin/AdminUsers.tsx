import React, { useCallback, useEffect, useState } from "react";
import { userService } from "../../services/apiService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Pagination } from "../../components/pagination/Pagination";

interface Role {
  id: string;
  userId: string;
  roleId: string;
  role: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const res = await userService.listWithQuery(query.toString());
      setUsers(res.data.data.data);
      setMeta(res.data.data.meta);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  }, [page, limit, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSave = async () => {
    try {
      if (!selectedUser) return;

      // Pick only allowed fields
      const payload = {
        email: selectedUser.email,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        phone: selectedUser.phone,
        avatar: selectedUser.avatar,
        isActive: selectedUser.isActive,
      };

      if (selectedUser.id) {
        // Update existing user
        await userService.update(selectedUser.id, payload);
      } else {
        // Create new user
        await userService.create(payload);
      }

      setIsDialogOpen(false);
      setSelectedUser(null);
      fetchUsers(); // refresh list
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await userService.remove(id);
        fetchUsers();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <Button
          onClick={() => {
            setSelectedUser({});
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 w-4 h-4" /> Add User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <div className="mb-4 flex gap-2">
          <Input
            className="flex-1 min-w-[300px]"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            onClick={() => {
              setPage(1);
              fetchUsers();
            }}
          >
            Filter
          </Button>
        </div>

        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">No.</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Roles</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Created At</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id} className="border-b">
                <td className="py-2 px-4">{(page - 1) * limit + index + 1}</td>

                <td className="py-2 px-4 flex items-center gap-2">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.firstName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                      {u.firstName?.[0]}
                    </div>
                  )}
                  <span>{u.email}</span>
                </td>

                <td className="py-2 px-4">
                  {u.firstName} {u.lastName}
                </td>

                <td className="py-2 px-4">{u.phone || "-"}</td>

                <td className="py-2 px-4">
                  {u.roles.map((r: Role) => r.role.name).join(", ")}
                </td>

                <td className="py-2 px-4">
                  {u.isActive ? "Active" : "Inactive"}
                </td>

                <td className="py-2 px-4">
                  {new Date(u.createdAt).toLocaleString()}
                </td>

                <td className="py-2 px-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(u);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(u.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        limit={limit}
        totalItems={meta.total}
        setPage={setPage}
        setLimit={setLimit}
      />

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser?.id ? "Edit" : "Add"} User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Email"
              value={selectedUser?.email || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
            {!selectedUser?.id && (
              <Input
                type="password"
                placeholder="Password"
                value={selectedUser?.password || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, password: e.target.value })
                }
              />
            )}
            <Input
              placeholder="First Name"
              value={selectedUser?.firstName || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, firstName: e.target.value })
              }
            />
            <Input
              placeholder="Last Name"
              value={selectedUser?.lastName || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, lastName: e.target.value })
              }
            />
            <Input
              placeholder="Phone"
              value={selectedUser?.phone || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, phone: e.target.value })
              }
            />
            <Input
              placeholder="Avatar URL"
              value={selectedUser?.avatar || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, avatar: e.target.value })
              }
            />

            <select
              className="border rounded px-2 py-1"
              value={selectedUser?.isActive ? "true" : "false"}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  isActive: e.target.value === "true",
                })
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
