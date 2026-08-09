import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Layout from "@/components/Layout";
import HomeDashboard from "@/pages/HomeDashboard";
import SearchResults from "@/pages/SearchResults";
import ComparePage from "@/pages/ComparePage";
import CategoryPage from "@/pages/CategoryPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import CartPage from "@/pages/CartPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>

        <Routes>

          {/* Main shopping website */}

          <Route element={<Layout />}>

            <Route path="/" element={<HomeDashboard />} />

            <Route path="/home" element={<HomeDashboard />} />

            <Route
              path="/search"
              element={<SearchResults />}
            />

            <Route
              path="/compare/:id"
              element={<ComparePage />}
            />

            <Route
              path="/category/:id"
              element={<CategoryPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            <Route 
              path="/cart" 
              element={<CartPage />} 
            />

          </Route>

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;