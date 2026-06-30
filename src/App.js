import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";
import ProductDetails from "./pages/product/ProductDetails";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./components/ToastProvider";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            <Navbar />
            <ScrollToTop />
            <main className="flex-1">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Home />
                      <About />
                      <Products />
                      <Testimonials />
                      <Contact />
                    </>
                  }
                />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
