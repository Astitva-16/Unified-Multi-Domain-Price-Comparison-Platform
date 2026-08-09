import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home, Search, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="w-full max-w-xl text-center"
      >
        {/* ICON */}

        <div className="w-20 h-20 mx-auto rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <TriangleAlert
            size={38}
            className="text-destructive"
          />
        </div>

        {/* 404 */}

        <p className="mt-8 text-7xl md:text-8xl font-extrabold tracking-tight gradient-text">
          404
        </p>

        <h1 className="mt-5 text-2xl md:text-3xl font-bold text-foreground">
          Page not found
        </h1>

        <p className="mt-3 text-muted-foreground max-w-md mx-auto leading-6">
          The page you are looking for doesn't exist, may have been moved,
          or the link you entered is incorrect.
        </p>

        {/* CURRENT PATH */}

        <div className="mt-6 inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm">
          <span className="text-muted-foreground">
            Requested:
          </span>

          <span className="font-medium text-foreground truncate max-w-[220px]">
            {location.pathname}
          </span>
        </div>

        {/* ACTIONS */}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link to="/home">
            <Button className="w-full sm:w-auto gap-2">
              <Home size={17} />
              Go to Dashboard
            </Button>
          </Link>

          <Link to="/search">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-2"
            >
              <Search size={17} />
              Search Products
            </Button>
          </Link>
        </div>

        {/* BACK */}

        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 mt-7 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Go back to previous page
        </button>

        {/* BRAND */}

        <p className="mt-10 text-xs text-muted-foreground">
          MOL BHAO · Compare prices and find the best deals
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;