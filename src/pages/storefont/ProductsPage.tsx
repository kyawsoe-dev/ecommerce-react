import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/apiService";
import { cartApi } from "../../services/cartApiService";
import { ProductType } from "../../types/product";
import { Search, Grid, List } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Product } from "../../types/product";
interface MetaType {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface CategoryType {
  id: string;
  name: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [meta, setMeta] = useState<MetaType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productService.fetchCategories();
        const data = Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : [];
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search: debouncedSearch,
        minPrice: minPrice || "",
        maxPrice: maxPrice || "",
        categoryId: selectedCategory || "",
      }).toString();

      const res = await productService.listWithQuery(query);
      const productsData = res.data?.data?.data ?? [];
      const metaData = res.data?.data?.meta ?? null;

      setProducts(Array.isArray(productsData) ? productsData : []);
      setMeta(metaData);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [debouncedSearch, minPrice, maxPrice, selectedCategory]);

  const handleAddToCart = async (product: ProductType) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAddingProductId(product.id);

    try {
      await cartApi.addItem({
        productId: product.id,
        quantity: 1,
      });

      const status =
        product.status === "ACTIVE" ||
        product.status === "INACTIVE" ||
        product.status === "OUT_OF_STOCK"
          ? product.status
          : "ACTIVE";

      const normalizedProduct: Product = {
        id: product.id,
        name: product.name,
        price: product.price ?? 0,
        stock: product.stock ?? 0,
        images: product.images ?? [],
        sku: product.sku ?? "",
        brand: product.brand ?? "",
        status,
        createdAt: product.createdAt ?? new Date().toISOString(),
        category: product.category
          ? { id: product.category.id, name: product.category.name }
          : undefined,
        merchant: product.merchant
          ? {
              id: product.merchant.id,
              businessName: product.merchant.businessName,
            }
          : undefined,
      };

      addItem(normalizedProduct, 1);

      alert("Product added to cart!");
    } catch (err: any) {
      console.error("Failed to add product to cart:", err);
      alert(
        err.response?.data?.message ||
          "Failed to add product to cart. Please try again."
      );
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-30 pl-3 pr-3 py-1 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-30 pl-3 pr-3 py-1 border border-gray-300 rounded-lg"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-48 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 py-1 ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Grid className="h-3 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <List className="h-3 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {products.map((product) => (
            <div
              key={product.id}
              className={`border rounded-lg p-4 shadow-sm flex ${
                viewMode === "list" ? "flex-row" : "flex-col"
              }`}
            >
              <div
                className={`bg-gray-200 overflow-hidden ${
                  viewMode === "list"
                    ? "w-48 h-32 flex-shrink-0 rounded"
                    : "h-48 rounded"
                }`}
              >
                <img
                  src={
                    product.images?.[0] ||
                    "https://i0.wp.com/css-tricks.com/wp-content/uploads/2020/11/css-gradient.png"
                  }
                  alt={product.name}
                  className="object-cover w-full h-full cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                />
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <h3
                  className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {product.description ?? "No description"}
                </p>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.comparePrice}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={
                      addingProductId === product.id ||
                      (product.stock ?? 0) <= 0
                    }
                    className={`px-3 py-2 rounded-lg text-sm text-white transition-colors ${
                      addingProductId === product.id ||
                      (product.stock ?? 0) <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {addingProductId === product.id
                      ? "Adding..."
                      : (product.stock ?? 0) > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={meta.page <= 1}
            onClick={() => fetchProducts(meta.page - 1)}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            disabled={meta.page >= meta.totalPages}
            onClick={() => fetchProducts(meta.page + 1)}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
