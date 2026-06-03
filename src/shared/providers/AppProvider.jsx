// Composes all top-level providers in the correct nesting order:
// ThemeProvider > QueryProvider > AuthProvider > Toaster
import { Toaster } from 'react-hot-toast';
import ThemeProvider from './ThemeProvider';
import QueryProvider from './QueryProvider';
import AuthProvider from './AuthProvider';

export default function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
