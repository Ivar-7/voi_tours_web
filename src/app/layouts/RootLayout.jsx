import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from '@shared/components/layout/Navbar';
import Footer from '@shared/components/layout/Footer';

export default function RootLayout() {
  const { pathname } = useLocation();
  const isPublicShell =
    pathname !== '/' &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/dashboard') &&
    !pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-dvh">
      {isPublicShell ? <Navbar /> : null}
      <Outlet />
      {isPublicShell ? <Footer /> : null}
    </div>
  );
}
