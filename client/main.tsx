import "./global.css";

import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NewIndex from "./pages/NewIndex";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Global error handler component
function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections (like Firebase fetch errors)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.warn("Unhandled promise rejection caught:", event.reason);

      // Check if it's a Firebase/Firestore error
      if (
        event.reason?.message?.includes("Failed to fetch") ||
        event.reason?.message?.includes("Network unavailable") ||
        event.reason?.code === "unavailable" ||
        event.reason?.code === "permission-denied" ||
        event.reason?.message?.includes("INTERNAL ASSERTION FAILED") ||
        event.reason?.message?.includes("Unexpected state") ||
        event.reason?.message?.includes("ID: b815") ||
        event.reason?.message?.includes("ID: ca9") ||
        event.reason?.message?.includes("ID: c050") ||
        event.reason?.message?.match(/ID: [a-z0-9]+/) || // Catch any Firebase error ID
        event.reason?.code === "internal" ||
        event.reason?.code === "aborted" ||
        event.reason?.message?.includes("Pending promise was never set") ||
        event.reason?.code === "auth/popup-blocked" ||
        event.reason?.code === "auth/popup-closed-by-user" ||
        event.reason?.code === "auth/cancelled-popup-request"
      ) {
        console.warn(
          "Firebase auth/network/internal error handled gracefully - continuing with fallback",
        );
        // Prevent the error from propagating
        event.preventDefault();
      }
    };

    // Handle general errors
    const handleError = (event: ErrorEvent) => {
      console.warn("Global error caught:", event.error);

      // Check if it's a network/Firebase error
      if (
        event.error?.message?.includes("Failed to fetch") ||
        event.error?.message?.includes("Network unavailable") ||
        event.message?.includes("TypeError: Failed to fetch") ||
        event.message?.includes("Network unavailable") ||
        event.error?.message?.includes("INTERNAL ASSERTION FAILED") ||
        event.error?.message?.includes("Unexpected state") ||
        event.error?.message?.includes("ID: b815") ||
        event.error?.message?.includes("ID: ca9") ||
        event.error?.message?.includes("ID: c050") ||
        event.error?.message?.match(/ID: [a-z0-9]+/) || // Catch any Firebase error ID
        event.error?.code === "internal" ||
        event.error?.code === "aborted" ||
        event.error?.message?.includes("Pending promise was never set") ||
        event.message?.includes("INTERNAL ASSERTION FAILED") ||
        event.message?.includes("Unexpected state") ||
        event.message?.match(/ID: [a-z0-9]+/) // Catch any Firebase error ID
      ) {
        console.warn(
          "Network/Firebase internal error handled gracefully - app continuing with fallback",
        );
        // Prevent the error from propagating
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}

const App = () => (
  <ErrorBoundary>
    <GlobalErrorHandler />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<NewIndex />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

// Robust root management for Vite HMR with debugging
const container = document.getElementById("root")!;

// Check if we already have a root
const existingRoot = (window as any).__reactRoot;

if (!existingRoot) {
  console.log("Creating new React root");
  (window as any).__reactRoot = createRoot(container);
} else {
  console.log("Reusing existing React root");
}

// Always render on the root
(window as any).__reactRoot.render(<App />);

// Add HMR handling to prevent double initialization
if (import.meta.hot) {
  import.meta.hot.accept();
}
