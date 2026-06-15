/* eslint-disable react-refresh/only-export-components -- this file is router configuration, not a component module */
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import RootLayout from "@app/layouts/RootLayout";
import AuthLayout from "@app/layouts/AuthLayout";
import DashboardLayout from "@app/layouts/DashboardLayout";
import AdminLayout from "@app/layouts/AdminLayout";
import ProtectedRoute from "@features/auth/components/ProtectedRoute";
import RoleGuard from "@features/auth/components/RoleGuard";
import RouteLoadingState from "@shared/components/feedback/RouteLoadingState";
import ErrorBoundary from "@shared/components/feedback/ErrorBoundary";
import NotFoundPage from "@app/pages/NotFoundPage";

// ── Lazy page imports ────────────────────────────────────────────────────────

const HomePage = lazy(() => import("@features/home/pages/HomePage"));

const DestinationsPage = lazy(
  () => import("@features/destinations/pages/DestinationsPage"),
);
const DestinationDetailPage = lazy(
  () => import("@features/destinations/pages/DestinationDetailPage"),
);

const PackagesPage = lazy(
  () => import("@features/packages/pages/PackagesPage"),
);
const PackageDetailPage = lazy(
  () => import("@features/packages/pages/PackageDetailPage"),
);

const ReviewsPage = lazy(() => import("@features/reviews/pages/ReviewsPage"));
const InquiryPage = lazy(() => import("@features/inquiries/pages/InquiryPage"));

const LoginPage = lazy(() => import("@features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("@features/auth/pages/ForgotPasswordPage"),
);

const MyBookingsPage = lazy(
  () => import("@features/bookings/pages/MyBookingsPage"),
);
const BookingDetailPage = lazy(
  () => import("@features/bookings/pages/BookingDetailPage"),
);
const BookingPage = lazy(() => import("@features/bookings/pages/BookingPage"));
const BookingSuccessPage = lazy(
  () => import("@features/bookings/pages/BookingSuccessPage"),
);

const PaymentPage = lazy(() => import("@features/payments/pages/PaymentPage"));
const PaymentSuccessPage = lazy(
  () => import("@features/payments/pages/PaymentSuccessPage"),
);
const PaymentFailedPage = lazy(
  () => import("@features/payments/pages/PaymentFailedPage"),
);

const ProfilePage = lazy(() => import("@features/profile/pages/ProfilePage"));

const AdminDashboardPage = lazy(
  () => import("@features/admin/pages/AdminDashboardPage"),
);
const AdminDestinationsPage = lazy(
  () => import("@features/destinations/pages/AdminDestinationsPage"),
);
const AdminDestinationCreatePage = lazy(
  () => import("@features/destinations/pages/AdminDestinationCreatePage"),
);
const AdminDestinationEditPage = lazy(
  () => import("@features/destinations/pages/AdminDestinationEditPage"),
);
const AdminDestinationDetailPage = lazy(
  () => import("@features/destinations/pages/AdminDestinationDetailPage"),
);
const AdminBookingsPage = lazy(
  () => import("@features/admin/pages/AdminBookingsPage"),
);
const AdminUsersPage = lazy(
  () => import("@features/admin/pages/AdminUsersPage"),
);
const AdminInquiriesPage = lazy(
  () => import("@features/admin/pages/AdminInquiriesPage"),
);
const AdminPackagesPage = lazy(
  () => import("@features/admin/pages/AdminPackagesPage"),
);
const AdminPackageDetailPage = lazy(
  () => import("@features/admin/pages/AdminPackageDetailPage"),
);

// ── Suspense wrapper ─────────────────────────────────────────────────────────

const withSuspense = (element, variant = "public") => (
  <ErrorBoundary>
    <Suspense fallback={<RouteLoadingState variant={variant} />}>
      {element}
    </Suspense>
  </ErrorBoundary>
);

// ── Router ───────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      {
        path: "destinations",
        element: withSuspense(<DestinationsPage />),
      },
      {
        path: "destinations/:slug",
        element: withSuspense(<DestinationDetailPage />),
      },
      { path: "packages", element: withSuspense(<PackagesPage />) },
      {
        path: "packages/:slug",
        element: withSuspense(<PackageDetailPage />),
      },
      { path: "reviews", element: withSuspense(<ReviewsPage />) },
      { path: "inquiry", element: withSuspense(<InquiryPage />) },
    ],
  },

  // ── Auth ────────────────────────────────────────────────────────────────
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: withSuspense(<LoginPage />, "auth") },
      { path: "register", element: withSuspense(<RegisterPage />, "auth") },
      {
        path: "forgot-password",
        element: withSuspense(<ForgotPasswordPage />, "auth"),
      },
    ],
  },

  // ── Protected — customer dashboard ──────────────────────────────────────
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="bookings" replace /> },
      {
        path: "bookings",
        element: withSuspense(<MyBookingsPage />, "dashboard"),
      },
      {
        path: "bookings/:id",
        element: withSuspense(<BookingDetailPage />, "dashboard"),
      },
      // :type = safari | sgr_transfer | hotel | event | delivery | flight
      {
        path: "book/:type",
        element: withSuspense(<BookingPage />, "dashboard"),
      },
      {
        path: "book/:type/success",
        element: withSuspense(<BookingSuccessPage />, "dashboard"),
      },
      {
        path: "bookings/:bookingId/pay",
        element: withSuspense(<PaymentPage />, "dashboard"),
      },
      {
        path: "payment/success",
        element: withSuspense(<PaymentSuccessPage />, "dashboard"),
      },
      {
        path: "payment/failed",
        element: withSuspense(<PaymentFailedPage />, "dashboard"),
      },
      { path: "profile", element: withSuspense(<ProfilePage />, "dashboard") },
    ],
  },

  // ── Protected — admin / agent ────────────────────────────────────────────
  {
    path: "/admin",
    element: (
      <RoleGuard roles={["admin", "agent"]}>
        <AdminLayout />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: "dashboard",
        element: withSuspense(<AdminDashboardPage />, "admin"),
      },
      {
        path: "destinations",
        element: withSuspense(<AdminDestinationsPage />, "admin"),
      },
      {
        path: "destinations/new",
        element: withSuspense(<AdminDestinationCreatePage />, "admin"),
      },
      {
        path: "destinations/:id",
        element: withSuspense(<AdminDestinationDetailPage />, "admin"),
      },
      {
        path: "destinations/:id/edit",
        element: withSuspense(<AdminDestinationEditPage />, "admin"),
      },
      {
        path: "bookings",
        element: withSuspense(<AdminBookingsPage />, "admin"),
      },
      { path: "users", element: withSuspense(<AdminUsersPage />, "admin") },
      {
        path: "inquiries",
        element: withSuspense(<AdminInquiriesPage />, "admin"),
      },
      {
        path: "packages",
        element: withSuspense(<AdminPackagesPage />, "admin"),
      },
      {
        path: "packages/:id",
        element: withSuspense(<AdminPackageDetailPage />, "admin"),
      },
    ],
  },

  // ── 404 ─────────────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
