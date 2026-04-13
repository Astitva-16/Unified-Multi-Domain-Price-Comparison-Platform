import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Bell, Heart, User, Menu, X, Moon, Sun, Mic, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const { isDark, toggleDark, searchQuery, setSearchQuery, setSelectedCategory } = useStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-black">CP</span>
            </div>
            <span className="hidden sm:inline">ComparePro</span>
          </Link>

          {/* Search - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setCatOpen(!catOpen)}
                  className="flex items-center gap-1 px-3 h-10 rounded-l-lg border border-r-0 bg-secondary text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  All <span className="text-xs">▾</span>
                </button>
                <input
                  type="text"
                  placeholder="Search products, food, flights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-10 px-4 border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button type="button" className="h-10 px-2 border border-l-0 bg-card text-muted-foreground hover:text-primary transition-colors">
                  <Mic size={16} />
                </button>
                <button type="button" className="h-10 px-2 border border-l-0 bg-card text-muted-foreground hover:text-primary transition-colors">
                  <Camera size={16} />
                </button>
                <button type="submit" className="h-10 px-4 rounded-r-lg gradient-primary text-primary-foreground">
                  <Search size={16} />
                </button>
              </div>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 mt-1 w-48 bg-card rounded-lg shadow-xl border p-2 z-50"
                  >
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCategory(c.id); setCatOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-secondary transition-colors flex items-center gap-2"
                      >
                        <span>{c.icon}</span> {c.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <Link to="/home" className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Heart size={20} />
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-secondary transition-colors md:hidden">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-10 px-4 rounded-l-lg border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button type="submit" className="h-10 px-4 rounded-r-lg gradient-primary text-primary-foreground">
              <Search size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t bg-card overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/category/${c.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <span>{c.icon}</span> {c.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
