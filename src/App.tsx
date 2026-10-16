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
  // Hidden on hero, visible once hero scrolls out of view
  const [showWhatsApp, setShowWhatsApp] = useState(false);

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

  // Show WhatsApp button only after hero scrolls out of view
  useEffect(() => {
    const hero = document.getElementById('hero-section');
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowWhatsApp(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
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

      {/* ── Floating WhatsApp contact button ──────────────────────────────
          Hidden during hero, fades in once hero scrolls out of view.       */}
      <a
        href="https://wa.me/60017633352"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className={`fixed bottom-6 right-6 z-50
                   flex items-center justify-center
                   bg-emerald-500 hover:bg-emerald-400
                   rounded-full shadow-[0_4px_24px_rgba(16,185,129,0.45)]
                   hover:shadow-[0_4px_32px_rgba(16,185,129,0.65)]
                   transition-all duration-500 hover:scale-110
                   ${showWhatsApp ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        style={{ width: '52px', height: '52px' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-white"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}

export default App;
