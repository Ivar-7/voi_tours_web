import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import PageTransition from "@shared/components/layout/PageTransition";
import RouteProgress from "@shared/components/feedback/RouteProgress";

export default function RootLayout() {
  const { pathname } = useLocation();
  const isPublicShell =
    pathname !== "/" &&
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-dvh">
      <RouteProgress />
      {isPublicShell ? <Navbar /> : null}
      <PageTransition>
        <Outlet />
      </PageTransition>
      {isPublicShell ? <Footer /> : null}
    </div>
  );
}
