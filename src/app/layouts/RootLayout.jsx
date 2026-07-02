import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import PageTransition from "@shared/components/layout/PageTransition";
import RouteProgress from "@shared/components/feedback/RouteProgress";

export default function RootLayout() {
  const { pathname } = useLocation();
  // HomePage renders its own footer, so the shared one is skipped there.
  const showSharedFooter = pathname !== "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-dvh">
      <RouteProgress />
      <Navbar />
      <PageTransition>
        <Outlet />
      </PageTransition>
      {showSharedFooter ? <Footer /> : null}
    </div>
  );
}
