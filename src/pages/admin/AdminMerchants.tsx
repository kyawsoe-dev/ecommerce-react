import React, { useEffect, useState, useCallback } from "react";
import { productService } from "../../services/apiService"; // or merchantService if separate
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
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  roles: Role[];
}

interface Merchant {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  taxId: string;
  address: string;
  phone: string;
  status: string;
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  _count: {
    products: number;
  };
}

const AdminMerchants: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [newMerchant, setNewMerchant] = useState<any>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMerchants = useCallback(async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });
      const res = await productService.api.get(
        `/merchants?${query.toString()}`
      );
      setMerchants(res.data.data.data);
      setMeta(res.data.data.meta);
    } catch (error) {
      console.error("Fetch merchants failed:", error);
    }
  }, [page, limit, searchTerm]);

  const fetchUsers = async () => {
    try {
      const res = await productService.api.get("/users");
      const usersArray = Array.isArray(res.data?.data?.data)
        ? res.data.data.data
        : [];
      setUsers(usersArray);
    } catch (err) {
      console.error("Fetch users failed:", err);
      setUsers([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure to delete this merchant?")) {
      try {
        await productService.api.delete(`/merchants/${id}`);
        fetchMerchants();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Merchants Management
        </h1>
        <Button
          variant="outline"
          onClick={() => {
            setIsCreateDialogOpen(true);
            fetchUsers();
            setNewMerchant({});
          }}
        >
          <Plus className="w-4 h-4 mr-1" /> Create Merchant
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <div className="mb-4 flex flex-wrap gap-2 items-end">
          <Input
            className="flex-1 min-w-[350px]"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="h-[42px]"
            onClick={() => {
              setPage(1);
              fetchMerchants();
            }}
          >
            Search
          </Button>
        </div>

        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">No.</th>
              <th className="py-2 px-4 text-left">Business</th>
              <th className="py-2 px-4 text-left">Tax ID</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Owner Email</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Products</th>
              <th className="py-2 px-4 text-left">Created At</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map((m, index) => (
              <tr key={m.id} className="border-b">
                <td className="py-2 px-4">{(page - 1) * limit + index + 1}</td>
                <td className="py-2 px-4 flex items-center gap-2">
                  <span className="font-semibold">{m.businessName}</span>
                  <span className="text-gray-500 text-sm">
                    ({m.businessType})
                  </span>
                </td>
                <td className="py-2 px-4">{m.taxId}</td>
                <td className="py-2 px-4">{m.address}</td>
                <td className="py-2 px-4">{m.user.email}</td>
                <td className="py-2 px-4">{m.phone}</td>
                <td className="py-2 px-4">{m.status}</td>
                <td className="py-2 px-4">{m._count.products}</td>
                <td className="py-2 px-4">
                  {new Date(m.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedMerchant(m);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(m.id)}
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
        totalItems={meta.total || 0}
        setPage={setPage}
        setLimit={setLimit}
      />

      {/* Edit Merchant Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Merchant</DialogTitle>
          </DialogHeader>

          {selectedMerchant && (
            <div className="space-y-4">
              <Input
                value={selectedMerchant.businessName}
                onChange={(e) =>
                  setSelectedMerchant({
                    ...selectedMerchant,
                    businessName: e.target.value,
                  })
                }
                placeholder="Business Name"
              />
              <Input
                value={selectedMerchant.businessType}
                onChange={(e) =>
                  setSelectedMerchant({
                    ...selectedMerchant,
                    businessType: e.target.value,
                  })
                }
                placeholder="Business Type"
              />
              <Input
                value={selectedMerchant.phone}
                onChange={(e) =>
                  setSelectedMerchant({
                    ...selectedMerchant,
                    phone: e.target.value,
                  })
                }
                placeholder="Phone"
              />

              <Input
                value={selectedMerchant.taxId}
                onChange={(e) =>
                  setSelectedMerchant({
                    ...selectedMerchant,
                    taxId: e.target.value,
                  })
                }
                placeholder="Tax ID"
              />
              <Input
                value={selectedMerchant.address}
                onChange={(e) =>
                  setSelectedMerchant({
                    ...selectedMerchant,
                    address: e.target.value,
                  })
                }
                placeholder="Address"
              />

              <select
                value={selectedMerchant.status}
                onChange={(e) =>
                  setSelectedMerchant({
                    ...selectedMerchant,
                    status: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          )}

          <DialogFooter>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedMerchant) return;
                  try {
                    await productService.api.put(
                      `/merchants/${selectedMerchant.id}`,
                      {
                        businessName: selectedMerchant.businessName,
                        businessType: selectedMerchant.businessType,
                        phone: selectedMerchant.phone,
                        status: selectedMerchant.status,
                      }
                    );
                    setIsDialogOpen(false);
                    fetchMerchants();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Merchant Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Merchant</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <select
              value={newMerchant.userId || ""}
              onChange={(e) =>
                setNewMerchant({ ...newMerchant, userId: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select User</option>
              {Array.isArray(users) &&
                users
                  .filter((u) =>
                    u.roles.some((r: any) => r.role.name === "MERCHANT")
                  )
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.email} ({u.firstName} {u.lastName})
                    </option>
                  ))}
            </select>

            <Input
              placeholder="Business Name"
              value={newMerchant.businessName || ""}
              onChange={(e) =>
                setNewMerchant({ ...newMerchant, businessName: e.target.value })
              }
            />

            <Input
              placeholder="Business Type"
              value={newMerchant.businessType || ""}
              onChange={(e) =>
                setNewMerchant({ ...newMerchant, businessType: e.target.value })
              }
            />

            <Input
              placeholder="Phone"
              value={newMerchant.phone || ""}
              onChange={(e) =>
                setNewMerchant({ ...newMerchant, phone: e.target.value })
              }
            />

            <Input
              placeholder="Tax ID"
              value={newMerchant.taxId || ""}
              onChange={(e) =>
                setNewMerchant({ ...newMerchant, taxId: e.target.value })
              }
            />

            <Input
              placeholder="Address"
              value={newMerchant.address || ""}
              onChange={(e) =>
                setNewMerchant({ ...newMerchant, address: e.target.value })
              }
            />

            <select
              value={newMerchant.status || "PENDING"}
              onChange={(e) =>
                setNewMerchant({ ...newMerchant, status: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <DialogFooter>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!newMerchant.userId || !newMerchant.businessName) return;
                  try {
                    await productService.api.post("/merchants", newMerchant);
                    setIsCreateDialogOpen(false);
                    fetchMerchants();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Create
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMerchants;
