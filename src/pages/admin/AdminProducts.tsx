import React, { useEffect, useState, useCallback } from "react";
import { productService } from "../../services/apiService";
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Merchant {
  id: string;
  businessName: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice: number;
  sku: string;
  stock: number;
  images: string[];
  brand: string;
  status: string;
  categoryId: string;
  merchantId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  merchant: Merchant;
  averageRating: number;
  reviewCount: number;
}

enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DISCONTINUED = "DISCONTINUED",
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<Partial<Product> | null>(null);
  const [selectedMerchant, setSelectedMerchant] =
    useState<Partial<Merchant> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(categoryId && { categoryId }),
        ...(minPrice !== undefined && { minPrice: minPrice.toString() }),
        ...(maxPrice !== undefined && { maxPrice: maxPrice.toString() }),
        ...(status && { status }),
      });

      const res = await productService.listWithQuery(query.toString());
      setProducts(res.data.data.data);
      setMeta(res.data.data.meta);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  }, [page, limit, searchTerm, categoryId, minPrice, maxPrice, status]);

  const handleSave = async () => {
    try {
      const {
        id,
        createdAt,
        updatedAt,
        category,
        merchant,
        averageRating,
        reviewCount,
        ...payload
      } = selectedProduct ?? {};

      if (id) {
        await productService.update(id, payload);
      } else {
        await productService.create(payload);
      }

      setIsDialogOpen(false);
      setSelectedProduct(null);
      setSelectedMerchant(null);
      fetchProducts();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure to delete this product?")) {
      try {
        await productService.remove(id);
        fetchProducts();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMetaData();
  }, [fetchProducts]);

  const fetchMetaData = async () => {
    const cats = await productService.fetchCategories();
    const mers = await productService.fetchMerchants();
    setCategories(cats.data.data.data);
    setMerchants(mers.data.data.data);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Products Management
        </h1>
        <Button
          onClick={() => {
            setSelectedProduct({});
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <div className="mb-4 flex flex-wrap gap-2 items-end">
          <div className="flex gap-2 flex-1 min-w-[250px]">
            <Input
              className="flex-1 min-w-[350px]"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Input
              type="number"
              className="w-20"
              placeholder="Min Price"
              value={minPrice ?? ""}
              onChange={(e) => setMinPrice(Number(e.target.value) || undefined)}
            />

            <Input
              type="number"
              className="w-20"
              placeholder="Max Price"
              value={maxPrice ?? ""}
              onChange={(e) => setMaxPrice(Number(e.target.value) || undefined)}
            />
          </div>

          <select
            className="border rounded px-2 py-[6px] h-[42px]"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded px-2 py-[6px] h-[42px]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {Object.values(ProductStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <Button
            className="h-[42px]"
            onClick={() => {
              setPage(1);
              fetchProducts();
            }}
          >
            Filter
          </Button>
        </div>

        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">No.</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Compare Price</th>
              <th className="py-2 px-4 text-left">Stock Keeping Unit</th>
              <th className="py-2 px-4 text-left">Stock</th>
              <th className="py-2 px-4 text-left">Brand</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Merchant</th>
              <th className="py-2 px-4 text-left">Images</th>
              <th className="py-2 px-4 text-left">Created At</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p.id} className="border-b align-top">
                <td className="py-2 px-4">{(page - 1) * limit + index + 1}</td>
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">{p.description}</td>
                <td className="py-2 px-4">{p.price}</td>
                <td className="py-2 px-4">{p.comparePrice}</td>
                <td className="py-2 px-4">{p.sku}</td>
                <td className="py-2 px-4">{p.stock}</td>
                <td className="py-2 px-4">{p.brand}</td>
                <td className="py-2 px-4">
                  {" "}
                  {p.status.charAt(0).toUpperCase() +
                    p.status.slice(1).toLowerCase()}
                </td>
                <td className="py-2 px-4">{p.category?.name || "-"}</td>
                <td className="py-2 px-4">{p.merchant?.businessName || "-"}</td>
                <td className="py-2 px-4">
                  {p.images?.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Image ${i + 1}`}
                      className="inline-block h-12 w-12 mr-2 rounded cursor-pointer transition-transform duration-300 ease-in-out hover:scale-150"
                    />
                  ))}
                </td>
                <td className="py-2 px-4">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedProduct(p);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(p.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProduct?.id ? "Edit" : "Add"} Product
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={selectedProduct?.name || ""}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Description"
              value={selectedProduct?.description || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  description: e.target.value,
                })
              }
            />
            <Input
              type="number"
              placeholder="Price"
              value={selectedProduct?.price || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: Number(e.target.value),
                })
              }
            />
            <Input
              type="number"
              placeholder="Compare Price"
              value={selectedProduct?.comparePrice || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  comparePrice: Number(e.target.value),
                })
              }
            />
            <Input
              placeholder="SKU"
              value={selectedProduct?.sku || ""}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, sku: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Stock"
              value={selectedProduct?.stock || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  stock: Number(e.target.value),
                })
              }
            />
            <Input
              placeholder="Brand"
              value={selectedProduct?.brand || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  brand: e.target.value,
                })
              }
            />

            <select
              className="border rounded px-2 py-1 me-2"
              value={selectedProduct?.status || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  status: e.target.value,
                })
              }
            >
              <option value="">Select Status</option>
              {Object.values(ProductStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              className="border rounded px-2 py-1"
              value={selectedProduct?.categoryId || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  categoryId: e.target.value,
                })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="border rounded px-2 py-1"
              value={selectedProduct?.merchantId || ""}
              onChange={(e) => {
                const merchantId = e.target.value;
                const merchant =
                  merchants.find((m) => m.id === merchantId) || null;

                setSelectedMerchant(merchant);
                setSelectedProduct((prev) => ({
                  ...prev,
                  merchantId: merchantId,
                }));
              }}
            >
              <option value="">Select Merchant</option>
              {merchants.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.businessName}
                </option>
              ))}
            </select>

            <div className="space-y-2">
              <label className="block font-semibold">Image URLs</label>

              <div className="flex gap-2">
                <input
                  id="image-url-input"
                  type="text"
                  placeholder="Enter image URL"
                  className="border rounded px-2 py-1 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        setSelectedProduct((prev) => ({
                          ...prev!,
                          images: [...(prev?.images || []), value],
                        }));
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => {
                    const input =
                      document.querySelector<HTMLInputElement>(
                        "#image-url-input"
                      );
                    if (input) {
                      const value = input.value.trim();
                      if (value) {
                        setSelectedProduct((prev) => ({
                          ...prev!,
                          images: [...(prev?.images || []), value],
                        }));
                        input.value = "";
                      }
                    }
                  }}
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProduct?.images
                  ?.filter((url) => url && url.trim() !== "")
                  .map((url, i) => (
                    <div key={i} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${i}`}
                        className="h-40 w-40 object-cover rounded shadow"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2"
                        onClick={() =>
                          setSelectedProduct((prev) => ({
                            ...prev!,
                            images:
                              prev!.images?.filter((_, index) => index !== i) ||
                              [],
                          }))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                {(!selectedProduct?.images ||
                  selectedProduct.images.filter(
                    (url) => url && url.trim() !== ""
                  ).length === 0) && (
                  <div className="text-gray-500 text-sm">No images added</div>
                )}
              </div>
            </div>
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

export default AdminProducts;
