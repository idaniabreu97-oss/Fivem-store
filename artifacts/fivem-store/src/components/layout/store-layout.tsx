import { Link, useLocation } from "wouter";
import { Terminal, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Scripts", href: "/scripts" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Terminal className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">NEXUS</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
                  >
                    {items.length}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="container md:hidden py-4 pb-6 space-y-4 border-t border-border/40 bg-background/95 backdrop-blur">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === item.href
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Admin Dashboard
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 bg-background py-12 md:py-16">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Terminal className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">NEXUS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium FiveM resources for serious server owners. Built for performance, secured by Asset Escrow.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Store</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/scripts" className="hover:text-primary transition-colors">All Scripts</Link></li>
              <li><Link href="/scripts?featured=true" className="hover:text-primary transition-colors">Featured</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-not-allowed hover:text-primary transition-colors">Terms of Service</span></li>
              <li><span className="cursor-not-allowed hover:text-primary transition-colors">Privacy Policy</span></li>
              <li><span className="cursor-not-allowed hover:text-primary transition-colors">Refund Policy</span></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">System</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link></li>
              <li><span className="cursor-not-allowed hover:text-primary transition-colors">API Documentation</span></li>
            </ul>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Nexus Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
