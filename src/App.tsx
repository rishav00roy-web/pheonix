import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { DossierSheet } from './components/DossierSheet';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { PRODUCTS } from './data/products';
import type { ManifestItem, Product } from './types';
import { soundManager } from './utils/audio';

export function App() {
  const [manifest, setManifest] = useState<ManifestItem[]>(() => {
    try {
      const saved = localStorage.getItem('pheonix_manifest_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('pheonix_manifest_v2', JSON.stringify(manifest));
    } catch {}
  }, [manifest]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
        setIsVaultOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAcquire = (product: Product, size: string, color: string) => {
    soundManager.playClick();
    setManifest((prev) => {
      const idx = prev.findIndex(
        (m) =>
          m.product.id === product.id &&
          m.size === size &&
          m.color === color
      );

      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      } else {
        return [
          ...prev,
          {
            product,
            size,
            color,
            quantity: 1
          }
        ];
      }
    });
  };

  const handleUpdateQuantity = (id: string, size: string, color: string, qty: number) => {
    soundManager.playClick();
    if (qty <= 0) {
      handleRemoveItem(id, size, color);
      return;
    }
    setManifest((prev) =>
      prev.map((item) => {
        if (
          item.product.id === id &&
          item.size === size &&
          item.color === color
        ) {
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string, size: string, color: string) => {
    soundManager.playClick();
    setManifest((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === id &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('collection-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalVaultCount = manifest.reduce((acc, m) => acc + m.quantity, 0);

  return (
    <div className="relative min-h-screen bg-void text-bone-100 flex flex-col selection:bg-ember-500 selection:text-white">
      {/* 35mm Analog Film Grain Layer */}
      <div className="film-grain" />

      {/* Sticky Hairline Top Navigation */}
      <Navbar
        cartCount={totalVaultCount}
        onOpenVault={() => setIsVaultOpen(true)}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* High-Fashion Centered Apparel Hero */}
        <Hero
          onExploreClick={scrollToCatalog}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            scrollToCatalog();
          }}
          selectedCategory={selectedCategory}
        />

        {/* Extensive 14-Piece Wardrobe Catalog (2-Col Mobile Grid + 1-Col Editorial) */}
        <ProductCatalog
          products={PRODUCTS}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAcquire={handleAcquire}
        />
      </main>

      {/* Slide-Up Mobile Dossier Inspection Sheet */}
      <DossierSheet
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAcquire={handleAcquire}
      />

      {/* Acquisition Manifest Vault Drawer */}
      <CartDrawer
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        items={manifest}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setManifest([])}
      />

      {/* Haute Couture Footer */}
      <Footer />
    </div>
  );
}

export default App;
