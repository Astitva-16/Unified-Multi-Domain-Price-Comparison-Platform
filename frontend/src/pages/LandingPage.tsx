import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Mic, Camera, BarChart3, Bell, Sparkles, Globe, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trustedPlatforms } from "@/data/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Globe, title: "Shopping Search", desc: "Compare products across Amazon, Flipkart, and Myntra." },
  { icon: BarChart3, title: "Real-Time Comparison", desc: "See price, rating, and delivery side by side." },
  { icon: Bell, title: "Deal Alerts", desc: "Track the best discounts and never miss a price drop." },
  { icon: Sparkles, title: "Smart Suggestions", desc: "Get product recommendations based on your shopping trends." },
  { icon: Shield, title: "Trusted Platforms", desc: "Shop with confidence from popular online stores." },
  { icon: Zap, title: "Fast Insights", desc: "Find the lowest price and top deals instantly." },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Minimal Landing Nav */}
      <nav className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-black">MB</span>
            </div>
            MOL BHAO
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#platforms" className="hover:text-foreground transition-colors">Platforms</a>
            <Link to="/home" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Dot pattern bg */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="container mx-auto px-4 py-20 md:py-32 text-center relative">
          {/* Floating decorative elements */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-20 left-[10%] hidden lg:block w-48 bg-card rounded-2xl shadow-xl border p-4"
          >
            <div className="bg-accent/20 rounded-lg p-3 mb-2">
              <p className="text-xs font-medium italic text-foreground">Track deals across 100+ platforms easily.</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap size={16} className="text-primary-foreground" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [8, -8, 8] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-16 right-[8%] hidden lg:block w-44 bg-card rounded-2xl shadow-xl border p-4"
          >
            <p className="font-semibold text-sm">Reminders</p>
            <p className="text-xs text-muted-foreground mt-1">Price drop alert</p>
            <p className="text-xs text-muted-foreground">iPhone 15 — ₹54,999</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-success font-medium">
              <Shield size={12} /> Verified
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles size={14} /> Trusted by 50,000+ users
            </div>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-balance"
          >
            Compare Prices Across{" "}
            <span className="gradient-text">Shopping Platforms</span>{" "}
            in One Place
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto"
          >
            Shopping price comparison across Amazon, Flipkart, and Myntra — find the best deal fast.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8 text-base shadow-glow">
                Get Started
              </Button>
            </Link>
            <Link to="/home">
              <Button size="lg" variant="outline" className="px-8 text-base">
                Explore Categories
              </Button>
            </Link>
          </motion.div>

          {/* Bottom floating cards */}
          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 4.5, repeat: Infinity }}
            className="absolute bottom-8 left-[5%] hidden lg:block w-52 bg-card rounded-2xl shadow-xl border p-4"
          >
            <p className="font-semibold text-sm">Today's tasks</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Compare sneakers</span>
                <span className="text-primary font-medium">60%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary">
                <div className="h-full w-3/5 rounded-full bg-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="absolute bottom-12 right-[5%] hidden lg:block w-44 bg-card rounded-2xl shadow-xl border p-4"
          >
            <p className="font-semibold text-sm italic">100+ Platforms</p>
            <div className="flex gap-1 mt-2">
              {["🛒", "🍕", "✈️", "🎬"].map((e, i) => (
                <span key={i} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm">{e}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Everything you need to find the best deals across every domain.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <f.icon size={22} className="text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trusted Platforms */}
      <section id="platforms" className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">Comparing prices across trusted platforms</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {trustedPlatforms.map((p) => (
              <div key={p} className="px-6 py-3 bg-card rounded-xl border shadow-sm text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto p-12 rounded-3xl gradient-primary text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to save money?</h2>
          <p className="opacity-90 mb-8">Join thousands of smart shoppers comparing prices across every platform.</p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="px-8 text-base font-semibold">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 gradient-text">ComparePro</h3>
              <p className="text-sm text-muted-foreground">Find the best deals across all domains.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ComparePro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
