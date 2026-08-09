import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import {
  Toaster as Sonner,
} from "@/components/ui/sonner";

import {
  Toaster,
} from "@/components/ui/toaster";

import {
  TooltipProvider,
} from "@/components/ui/tooltip";

import {
  AuthProvider,
} from "@/context/AuthContext";

import ProtectedRoute from "@/components/ProtectedRoute";

import Layout from "@/components/Layout";

import HomeDashboard from "@/pages/HomeDashboard";
import SearchResults from "@/pages/SearchResults";
import ComparePage from "@/pages/ComparePage";
import CategoryPage from "@/pages/CategoryPage";
import ProfilePage from "@/pages/ProfilePage";
import CartPage from "@/pages/CartPage";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AuthPage from "@/pages/AuthPage";

import NotFound from "@/pages/NotFound";


const queryClient = new QueryClient();


const App = () => {

  return (

    <QueryClientProvider
      client={queryClient}
    >

      <TooltipProvider>

        <AuthProvider>

          <BrowserRouter>

            <Routes>


              {/* =========================================
                  PUBLIC AUTH ROUTES
              ========================================== */}

              <Route
                path="/auth"
                element={<AuthPage />}
              />

              <Route
                path="/login"
                element={<LoginPage />}
              />

              <Route
                path="/register"
                element={<RegisterPage />}
              />


              {/* =========================================
                  PROTECTED SHOPPING WEBSITE
              ========================================== */}

              <Route
                element={

                  <ProtectedRoute>

                    <Layout />

                  </ProtectedRoute>

                }
              >


                {/* HOME */}

                <Route
                  path="/"
                  element={<HomeDashboard />}
                />

                <Route
                  path="/home"
                  element={<HomeDashboard />}
                />


                {/* SEARCH */}

                <Route
                  path="/search"
                  element={<SearchResults />}
                />


                {/* COMPARE */}

                <Route
                  path="/compare/:id"
                  element={<ComparePage />}
                />


                {/* CATEGORY */}

                <Route
                  path="/category/:id"
                  element={<CategoryPage />}
                />


                {/* PROFILE */}

                <Route
                  path="/profile"
                  element={<ProfilePage />}
                />


                {/* CART */}

                <Route
                  path="/cart"
                  element={<CartPage />}
                />

              </Route>


              {/* =========================================
                  UNKNOWN URL
              ========================================== */}

              <Route
                path="*"
                element={<NotFound />}
              />


            </Routes>


            <Toaster />

            <Sonner />

          </BrowserRouter>

        </AuthProvider>

      </TooltipProvider>

    </QueryClientProvider>

  );

};


export default App;