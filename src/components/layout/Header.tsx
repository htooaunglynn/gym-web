import Link from "next/link";
import { Search, ShoppingCart, Menu, ChevronDown, Dumbbell } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-dark text-white shadow-md">
      <div className="container mx-auto px-4 lg:px-8 flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-3xl font-heading font-bold flex items-center">
            FI<Dumbbell className="w-6 h-6 text-brand mx-0.5" strokeWidth={3} />KIT
          </div>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          <div className="relative group h-full flex items-center">
            <Link href="/" className="text-sm font-semibold tracking-wide hover:text-brand flex items-center gap-1 transition-colors text-brand">
              HOME <ChevronDown className="w-4 h-4" />
            </Link>
          </div>
          <Link href="/about" className="text-sm font-semibold tracking-wide hover:text-brand transition-colors">
            ABOUT
          </Link>
          <div className="relative group h-full flex items-center">
            <Link href="/services" className="text-sm font-semibold tracking-wide hover:text-brand flex items-center gap-1 transition-colors">
              SERVICES <ChevronDown className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative group h-full flex items-center">
            <Link href="/pages" className="text-sm font-semibold tracking-wide hover:text-brand flex items-center gap-1 transition-colors">
              PAGES <ChevronDown className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative group h-full flex items-center">
            <Link href="/blog" className="text-sm font-semibold tracking-wide hover:text-brand flex items-center gap-1 transition-colors">
              BLOG <ChevronDown className="w-4 h-4" />
            </Link>
          </div>
          <Link href="/contact" className="text-sm font-semibold tracking-wide hover:text-brand transition-colors">
            CONTACT
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <button aria-label="Search" className="hover:text-brand transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <button aria-label="Cart" className="relative hover:text-brand transition-colors hidden sm:block">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
              0
            </span>
          </button>
          <button aria-label="Menu" className="hover:text-brand transition-colors ml-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
