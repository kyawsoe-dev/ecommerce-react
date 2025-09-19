import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StorefrontLayout from "./layouts/StorefrontLayout";
import AdminLayout from "./layouts/AdminLayout";
import MerchantLayout from "./layouts/MerchantLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/storefont/HomePage";
import ProductsPage from "./pages/storefont/ProductsPage";
import ProductDetailPage from "./pages/storefont/ProductDetailPage";
import CartPage from "./pages/storefont/CartPage";
import CheckoutPage from "./pages/storefont/CheckoutPage";
import ProfilePage from "./pages/storefont/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMerchants from "./pages/admin/AdminMerchants";
import MerchantDashboard from "./pages/merchant/MerchantDashboard";
import MerchantProducts from "./pages/merchant/MerchantProducts";
import MerchantOrders from "./pages/merchant/MearchantOrders";
import MerchantPayouts from "./pages/merchant/MerchantPayouts";
import AboutPage from "./pages/storefont/AboutPage";
import ContactPage from "./pages/storefont/ContactPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Storefront Routes */}
            <Route path="/" element={<StorefrontLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route
                path="cart"
                element={
                  <ProtectedRoute requiredRole="CUSTOMER">
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route
                path="profile"
                element={
                  <ProtectedRoute
                    requiredRole={["CUSTOMER", "MERCHANT", "ADMIN"]}
                  >
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="merchants" element={<AdminMerchants />} />
            </Route>

            {/* Merchant Routes */}
            <Route
              path="/merchant"
              element={
                <ProtectedRoute requiredRole="MERCHANT">
                  <MerchantLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MerchantDashboard />} />
              <Route path="products" element={<MerchantProducts />} />
              <Route path="orders" element={<MerchantOrders />} />
              <Route path="payouts" element={<MerchantPayouts />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
