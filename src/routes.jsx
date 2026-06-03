import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import RootLayout from '@app/layouts/RootLayout';
import AuthLayout from '@app/layouts/AuthLayout';
import DashboardLayout from '@app/layouts/DashboardLayout';
import AdminLayout from '@app/layouts/AdminLayout';
import ProtectedRoute from '@features/auth/components/ProtectedRoute';
import RoleGuard from '@features/auth/components/RoleGuard';
import LoadingState from '@shared/components/feedback/LoadingState';
import NotFoundPage from '@app/pages/NotFoundPage';

// ── Lazy page imports ────────────────────────────────────────────────────────

const HomePage = lazy(() => import('@features/home/pages/HomePage'));

const DestinationsPage = lazy(
  () => import('@features/destinations/pages/DestinationsPage'),
);
const DestinationDetailPage = lazy(
  () => import('@features/destinations/pages/DestinationDetailPage'),
);

const PackagesPage = lazy(
  () => import('@features/packages/pages/PackagesPage'),
);
const PackageDetailPage = lazy(
  () => import('@features/packages/pages/PackageDetailPage'),
);

const ReviewsPage = lazy(() => import('@features/reviews/pages/ReviewsPage'));
const InquiryPage = lazy(
  () => import('@features/inquiries/pages/InquiryPage'),
);

const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(
  () => import('@features/auth/pages/ForgotPasswordPage'),
);

const MyBookingsPage = lazy(
  () => import('@features/bookings/pages/MyBookingsPage'),
);
const BookingDetailPage = lazy(
  () => import('@features/bookings/pages/BookingDetailPage'),
);
const BookingPage = lazy(() => import('@features/bookings/pages/BookingPage'));
const BookingSuccessPage = lazy(
  () => import('@features/bookings/pages/BookingSuccessPage'),
);

const PaymentPage = lazy(() => import('@features/payments/pages/PaymentPage'));
const PaymentSuccessPage = lazy(
  () => import('@features/payments/pages/PaymentSuccessPage'),
);
const PaymentFailedPage = lazy(
  () => import('@features/payments/pages/PaymentFailedPage'),
);

const ProfilePage = lazy(() => import('@features/profile/pages/ProfilePage'));

const AdminDashboardPage = lazy(
  () => import('@features/admin/pages/AdminDashboardPage'),
);
const AdminBookingsPage = lazy(
  () => import('@features/admin/pages/AdminBookingsPage'),
);
const AdminUsersPage = lazy(
  () => import('@features/admin/pages/AdminUsersPage'),
);
const AdminInquiriesPage = lazy(
  () => import('@features/admin/pages/AdminInquiriesPage'),
);
const AdminPackagesPage = lazy(
  () => import('@features/admin/pages/AdminPackagesPage'),
);

// ── Suspense wrapper ─────────────────────────────────────────────────────────

const withSuspense = (element) => (
  <Suspense fallback={<LoadingState />}>{element}</Suspense>
);

// ── Router ───────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      {
        path: 'destinations',
        element: withSuspense(<DestinationsPage />),
      },
      {
        path: 'destinations/:slug',
        element: withSuspense(<DestinationDetailPage />),
      },
      { path: 'packages', element: withSuspense(<PackagesPage />) },
      {
        path: 'packages/:slug',
        element: withSuspense(<PackageDetailPage />),
      },
      { path: 'reviews', element: withSuspense(<ReviewsPage />) },
      { path: 'inquiry', element: withSuspense(<InquiryPage />) },
    ],
  },

  // ── Auth ────────────────────────────────────────────────────────────────
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: 'login', element: withSuspense(<LoginPage />) },
      { path: 'register', element: withSuspense(<RegisterPage />) },
      {
        path: 'forgot-password',
        element: withSuspense(<ForgotPasswordPage />),
      },
    ],
  },

  // ── Protected — customer dashboard ──────────────────────────────────────
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="bookings" replace /> },
      { path: 'bookings', element: withSuspense(<MyBookingsPage />) },
      {
        path: 'bookings/:id',
        element: withSuspense(<BookingDetailPage />),
      },
      // :type = safari | sgr_transfer | hotel | event | delivery | flight
      { path: 'book/:type', element: withSuspense(<BookingPage />) },
      {
        path: 'book/:type/success',
        element: withSuspense(<BookingSuccessPage />),
      },
      {
        path: 'bookings/:bookingId/pay',
        element: withSuspense(<PaymentPage />),
      },
      {
        path: 'payment/success',
        element: withSuspense(<PaymentSuccessPage />),
      },
      {
        path: 'payment/failed',
        element: withSuspense(<PaymentFailedPage />),
      },
      { path: 'profile', element: withSuspense(<ProfilePage />) },
    ],
  },

  // ── Protected — admin / agent ────────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <RoleGuard roles={['admin', 'agent']}>
        <AdminLayout />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: 'dashboard',
        element: withSuspense(<AdminDashboardPage />),
      },
      {
        path: 'bookings',
        element: withSuspense(<AdminBookingsPage />),
      },
      { path: 'users', element: withSuspense(<AdminUsersPage />) },
      {
        path: 'inquiries',
        element: withSuspense(<AdminInquiriesPage />),
      },
      {
        path: 'packages',
        element: withSuspense(<AdminPackagesPage />),
      },
    ],
  },

  // ── 404 ─────────────────────────────────────────────────────────────────
  { path: '*', element: <NotFoundPage /> },
]);

export default router;
