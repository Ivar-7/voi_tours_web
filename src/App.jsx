import { RouterProvider } from "react-router-dom";
import AppProvider from "@shared/providers/AppProvider";
import ErrorBoundary from "@shared/components/feedback/ErrorBoundary";
import router from "./routes";

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ErrorBoundary>
  );
}
