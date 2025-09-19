import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, Headphones } from "lucide-react";
import { productService } from "../../services/apiService";
import { cartApi } from "../../services/cartApiService";
import { ProductType } from "../../types/product";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Product } from "../../types/product"; // Make sure this import exists

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.listWithQuery("page=1&limit=10");
        const productsData: ProductType[] = res.data.data.data;
        setFeaturedProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  if (loading) {
    return <div className="text-center py-16">Loading products...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Products
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Shop the latest trends with unbeatable prices and fast delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Join as Merchant
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Free shipping on orders over $50. Delivered in 2-3 business days.
            </p>
          </div>
          <div>
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
            <p className="text-gray-600">
              Your payment info is protected with industry-standard encryption.
            </p>
          </div>
          <div>
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Headphones className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">
              Customer support is available around the clock.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <img
                    src={product.images?.[0] || ""}
                    alt={product.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`)}
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3
                    className="text-lg font-semibold mb-1 line-clamp-2 cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  {/* Merchant name */}
                  {product.merchant && (
                    <p className="text-sm text-gray-500 mb-2">
                      Sold by: {product.merchant.businessName}
                    </p>
                  )}

                  {/* Ratings */}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {(product.averageRating ?? 0).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviewCount ?? 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.comparePrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={
                        (product.stock ?? 0) <= 0 ||
                        addingProductId === product.id
                      }
                      className={`flex-1 px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors ${
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
        </div>
      </section>
    </div>
  );
};

export default HomePage;
