import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function CustomerLayout() {
  const { pathname } = useLocation();
  const noFooter = ['/booking'].includes(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}

