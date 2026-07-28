'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin');
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/signin' });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white shadow-lg z-40 px-4 py-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center space-x-2 font-bold">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-xs">
            KM
          </div>
          <span>Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-lg transition-transform duration-300 z-30 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          <div className="hidden lg:block px-6 py-8">
            <Link href="/admin" className="flex items-center space-x-2 text-2xl font-bold">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                KM
              </div>
              <span>Admin</span>
            </Link>
          </div>

          <div className="lg:hidden px-6 py-4 border-b border-gray-800">
            <Link href="/admin" onClick={closeSidebar} className="flex items-center space-x-2 text-xl font-bold">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                KM
              </div>
              <span>Admin</span>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-gray-800 space-y-2">
            <div className="text-xs sm:text-sm text-gray-400 px-4 py-2 truncate">
              {session?.user?.email}
            </div>
            <Button 
              onClick={handleLogout}
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-red-600 bg-gray-800 cursor-pointer text-sm"
            >
              <LogOut className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="truncate">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <main className="lg:ml-64 min-h-screen bg-gray-50 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}