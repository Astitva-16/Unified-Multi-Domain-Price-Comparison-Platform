import { motion } from "framer-motion";
import { User, Mail, Bell, Heart, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-muted-foreground text-sm">john@example.com</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Comparisons", value: "128" },
            { label: "Saved", value: "24" },
            { label: "Alerts", value: "7" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl bg-card border text-center">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {[
            { icon: User, label: "Edit Profile", to: "/profile" },
            { icon: Heart, label: "Wishlist", to: "/home" },
            { icon: Bell, label: "Notifications", to: "/profile" },
            { icon: Settings, label: "Settings", to: "/profile" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border hover:shadow-md transition-shadow"
            >
              <item.icon size={20} className="text-muted-foreground" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          <button className="flex items-center gap-3 p-4 rounded-xl bg-card border hover:shadow-md transition-shadow w-full text-destructive">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
