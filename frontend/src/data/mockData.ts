export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  prices: { platform: string; price: number; rating: number; delivery: string; discount?: string }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  count: number;
}

export interface Deal {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  badge?: string;
}

export const categories: Category[] = [
  { id: "electronics", name: "Electronics", icon: "📱", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop", count: 8900 },
  { id: "fashion", name: "Fashion", icon: "👗", image: "https://images.unsplash.com/photo-1520975911072-0db362e8a926?w=400&h=300&fit=crop", count: 12400 },
  { id: "mobiles", name: "Mobiles", icon: "📲", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop", count: 6700 },
  { id: "laptops", name: "Laptops", icon: "💻", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop", count: 3400 },
  { id: "home", name: "Home", icon: "🏠", image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=400&h=300&fit=crop", count: 5300 },
  { id: "appliances", name: "Appliances", icon: "🔌", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=300&fit=crop", count: 4100 },
];

export const deals: Deal[] = [
  { id: "1", title: "Amazon Big Sale", subtitle: "Up to 70% off on Electronics", gradient: "from-orange-500 to-amber-500", badge: "LIVE" },
  { id: "2", title: "Flipkart Electronics Fest", subtitle: "Best deals on Smartphones & Laptops", gradient: "from-blue-600 to-indigo-600", badge: "NEW" },
  { id: "3", title: "Swiggy Flat 50% Off", subtitle: "On your first 5 orders", gradient: "from-orange-600 to-red-500" },
  { id: "4", title: "Travel Discounts", subtitle: "Flights starting ₹1,499", gradient: "from-emerald-500 to-teal-600", badge: "HOT" },
  { id: "5", title: "Fashion Week Sale", subtitle: "Trending styles at best prices", gradient: "from-pink-500 to-rose-500" },
];

export const products: Product[] = [
  {
    id: "1", name: "Men's Premium Cotton T-Shirt", category: "fashion",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    prices: [
      { platform: "Amazon", price: 499, rating: 4.3, delivery: "2 days", discount: "30% off" },
      { platform: "Flipkart", price: 479, rating: 4.1, delivery: "3 days", discount: "35% off" },
      { platform: "Myntra", price: 520, rating: 4.5, delivery: "4 days", discount: "25% off" },
    ],
  },
  {
    id: "2", name: "Wireless Bluetooth Earbuds Pro", category: "electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    prices: [
      { platform: "Amazon", price: 1299, rating: 4.4, delivery: "1 day", discount: "40% off" },
      { platform: "Flipkart", price: 1199, rating: 4.2, delivery: "2 days", discount: "45% off" },
      { platform: "Croma", price: 1399, rating: 4.0, delivery: "3 days", discount: "30% off" },
    ],
  },
  {
    id: "3", name: "Margherita Pizza (Large)", category: "food",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop",
    prices: [
      { platform: "Swiggy", price: 299, rating: 4.2, delivery: "30 min" },
      { platform: "Zomato", price: 279, rating: 4.3, delivery: "35 min", discount: "₹50 off" },
      { platform: "Dominos", price: 349, rating: 4.0, delivery: "25 min" },
    ],
  },
  {
    id: "4", name: "Delhi → Mumbai Flight", category: "travel",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=400&h=400&fit=crop",
    prices: [
      { platform: "MakeMyTrip", price: 3499, rating: 4.1, delivery: "2h 10m" },
      { platform: "Booking.com", price: 3299, rating: 4.3, delivery: "2h 10m", discount: "₹500 off" },
      { platform: "Goibibo", price: 3599, rating: 4.0, delivery: "2h 15m" },
    ],
  },
  {
    id: "5", name: "Smart Watch Series X", category: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    prices: [
      { platform: "Amazon", price: 2999, rating: 4.5, delivery: "1 day", discount: "20% off" },
      { platform: "Flipkart", price: 2799, rating: 4.3, delivery: "2 days", discount: "25% off" },
      { platform: "Croma", price: 3199, rating: 4.1, delivery: "3 days" },
    ],
  },
  {
    id: "6", name: "Women's Running Sneakers", category: "fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    prices: [
      { platform: "Amazon", price: 1899, rating: 4.4, delivery: "2 days", discount: "15% off" },
      { platform: "Myntra", price: 1799, rating: 4.6, delivery: "3 days", discount: "20% off" },
      { platform: "Flipkart", price: 1949, rating: 4.2, delivery: "2 days" },
    ],
  },
  {
    id: "7", name: "Budget Hotel — Goa Beachside", category: "travel",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
    prices: [
      { platform: "Booking.com", price: 999, rating: 4.0, delivery: "Instant", discount: "₹200 off" },
      { platform: "MakeMyTrip", price: 1099, rating: 3.9, delivery: "Instant" },
      { platform: "Goibibo", price: 949, rating: 4.1, delivery: "Instant", discount: "₹300 off" },
    ],
  },
  {
    id: "8", name: "Chicken Biryani (Family Pack)", category: "food",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop",
    prices: [
      { platform: "Swiggy", price: 399, rating: 4.5, delivery: "40 min", discount: "₹80 off" },
      { platform: "Zomato", price: 379, rating: 4.4, delivery: "45 min" },
      { platform: "EatSure", price: 429, rating: 4.2, delivery: "35 min" },
    ],
  },
];

export const suggestions = {
  shopping: ["Men's Shirts", "Sneakers", "Trending Gadgets", "Women's Dresses", "Headphones"],
  food: ["Order Pizza", "Chinese Cuisine", "Budget Meals", "Biryani", "Desserts"],
  travel: ["Flights under ₹2999", "Hotels under ₹999", "Weekend Trips", "Beach Resorts", "Mountain Stays"],
};

export const priceRanges = [
  { label: "₹99 Only", value: 99 },
  { label: "₹199 Only", value: 199 },
  { label: "₹299 Only", value: 299 },
  { label: "₹499 Only", value: 499 },
  { label: "₹999 Only", value: 999 },
  { label: "₹1999 Only", value: 1999 },
];

export const trustedPlatforms = [
  "Amazon", "Flipkart", "Myntra", "Croma", "Ajio", "TataCliq",
];
