// src/pages/admin/AdminOrders.tsx
import React, { useCallback, useEffect, useState } from "react";
import { orderService } from "../../services/apiService";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Pagination } from "../../components/pagination/Pagination";
import { Trash2 } from "lucide-react";
import { OrderType } from "../../types/order";

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const res = await orderService.getAll(query.toString());

      setOrders(res.data.data.data);
      setMeta(res.data.data.meta);
    } catch (error) {
      console.error("Fetch orders failed:", error);
    }
  }, [page, limit, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (
    id: string,
    updateData: Partial<Pick<OrderType, "status" | "paymentStatus">>
  ) => {
    try {
      setUpdatingId(id);
      await orderService.updateStatus(id, updateData);
      fetchOrders();
    } catch (error) {
      console.error("Update status failed:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure to delete this order?")) {
      try {
        await orderService.remove(id);
        fetchOrders();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div>
      {/* Header + Search */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <div className="mb-4 flex gap-2">
          <Input
            className="flex-1 min-w-[300px]"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            onClick={() => {
              setPage(1);
              fetchOrders();
            }}
          >
            Filter
          </Button>
        </div>

        {/* Orders Table */}
        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-4 text-left">No.</th>
              <th className="py-2 px-4 text-left">Order #</th>
              <th className="py-2 px-4 text-left">Customer</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Payment Method</th>
              <th className="py-2 px-4 text-left">Payment Status</th>
              <th className="py-2 px-4 text-left">Created At</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className="border-b">
                <td className="py-2 px-4">{(page - 1) * limit + index + 1}</td>
                <td className="py-2 px-4">{order.orderNumber}</td>
                <td className="py-2 px-4">
                  {order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : "N/A"}
                </td>
                <td className="py-2 px-4">${order.total?.toFixed(2)}</td>

                {/* Order Status */}
                <td className="py-2 px-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateStatus(order.id!, {
                        status: e.target.value as OrderType["status"],
                      })
                    }
                    disabled={updatingId === order.id}
                    className="border rounded px-2 py-1"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </td>

                {/* Payment Method (read-only) */}
                <td className="py-2 px-4">{order.paymentMethod}</td>

                {/* Payment Status (editable) */}
                <td className="py-2 px-4">
                  <select
                    value={order.paymentStatus}
                    onChange={(e) =>
                      handleUpdateStatus(order.id!, {
                        paymentStatus: e.target
                          .value as OrderType["paymentStatus"],
                      })
                    }
                    disabled={updatingId === order.id}
                    className="border rounded px-2 py-1"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </td>

                <td className="py-2 px-4">
                  {new Date(order.createdAt!).toLocaleString()}
                </td>
                <td className="py-2 px-4">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(order.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        limit={limit}
        totalItems={meta.total}
        setPage={setPage}
        setLimit={setLimit}
      />
    </div>
  );
};

export default AdminOrders;
