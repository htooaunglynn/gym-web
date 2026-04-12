"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, ChevronDown, Dumbbell, LogOut, User } from "lucide-react";

export function Header() {
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/v1/auth/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else if (res.status === 401) {
          localStorage.removeItem("accessToken");
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-dark text-white shadow-md">
      <div className="container mx-auto px-4 lg:px-8 flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-3xl font-heading font-bold flex items-center">
            FI<Dumbbell className="w-6 h-6 text-brand mx-0.5" strokeWidth={3} />KIT
          </div>
        </Link>
        
        {/* Navigation - keeping your existing structure */}
        
        {/* Actions */}
        <div className="flex items-center gap-6">
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-5">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 group hover:text-brand transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center border border-brand/30">
                      <User className="w-4 h-4 text-brand" />
                    </div>
                    <span className="text-sm font-bold tracking-wide uppercase">
                      {user.firstName} {user.lastName}
                    </span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-bold tracking-wide hover:text-brand transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">LOGOUT</span>
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="text-sm font-bold tracking-wide hover:text-brand transition-colors whitespace-nowrap"
                >
                  LOG IN
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
