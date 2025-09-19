import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { productService } from "../../services/apiService";
import { cartApi } from "../../services/cartApiService";
import { ProductType } from "../../types/product";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Product } from "../../types/product";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const res = await productService.get(id);
        setProduct(res.data.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAdding(true);

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
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-16 text-red-500">Product not found</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">
              {(product.averageRating ?? 0).toFixed(1)}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              ({product.reviewCount ?? 0} reviews)
            </span>
          </div>

          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="flex items-center space-x-4 mb-4">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.comparePrice}
              </span>
            )}
          </div>

          {product.brand && (
            <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
          )}
          {product.category && (
            <p className="text-gray-600 mb-2">
              Category: {product.category.name}
            </p>
          )}
          {product.merchant && (
            <p className="text-gray-600 mb-4">
              Merchant: {product.merchant.businessName}
            </p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={adding || (product.stock ?? 0) <= 0}
            className={`px-6 py-3 rounded-lg text-white transition-colors ${
              adding || (product.stock ?? 0) <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {adding
              ? "Adding..."
              : product.stock && product.stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
