import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Masthead } from './components/Masthead';
import { Dock } from './components/Dock';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductPage } from './pages/ProductPage';
import { AjShield } from './pages/AjShield';
import { NotFound } from './pages/NotFound';
import { CartProvider } from './lib/cart';
import { useCart } from './lib/bag';
import { TransitionProvider } from './lib/transition';
import { findProduct } from './data/products';

export function App() {
  return (
    <TransitionProvider>
      <CartProvider>
        <Shell />
      </CartProvider>
    </TransitionProvider>
  );
}

function Shell() {
  const { announcement } = useCart();

  return (
    <div className="relative min-h-screen bg-void text-bone-100">
      <a href="#main" className="skip-link">Skip to content</a>
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <Masthead />

      <main id="main" className="relative z-10">
        <Routes>
          <Route path="/" element={<LegacyPieceRedirect><Home /></LegacyPieceRedirect>} />
          <Route path="/shop" element={<LegacyPieceRedirect><Shop /></LegacyPieceRedirect>} />
          <Route path="/p/:slug" element={<ProductPage />} />
          <Route path="/aj-shield" element={<AjShield />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <Dock />
    </div>
  );
}

// Old share links were /#piece=<id> (and /shop#piece=<id>): send them to the piece's page
function LegacyPieceRedirect({ children }: { children: React.ReactNode }) {
  const { hash } = useLocation();
  const id = new URLSearchParams(hash.slice(1)).get('piece');
  if (id) return <Navigate to={findProduct(id) ? `/p/${id}` : '/shop'} replace />;
  return <>{children}</>;
}

export default App;
