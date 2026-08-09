export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  prices: {
    platform: string;
    price: number;
    rating: number;
    delivery: string;
    discount?: string;
  }[];
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

export interface PlatformDeal {
  id: string;
  platform: string;
  title: string;
  description: string;
  discount: string;
  category: string;
  icon: string;
  gradient: string;
}

export const platformDeals: PlatformDeal[] = [
  {
    id: "amazon-deal",
    platform: "Amazon",
    title: "Electronics Mega Sale",
    description: "Save big on mobiles, laptops and accessories",
    discount: "Up to 60% OFF",
    category: "Electronics",
    icon: "🛒",
    gradient: "from-orange-500 to-amber-500",
  },

  {
    id: "flipkart-deal",
    platform: "Flipkart",
    title: "Big Saving Days",
    description: "Amazing prices on smartphones and gadgets",
    discount: "Up to 50% OFF",
    category: "Mobiles",
    icon: "⚡",
    gradient: "from-blue-600 to-indigo-600",
  },

  {
    id: "myntra-deal",
    platform: "Myntra",
    title: "Fashion Sale",
    description: "Trending styles, sneakers and more",
    discount: "Up to 70% OFF",
    category: "Fashion",
    icon: "👗",
    gradient: "from-pink-500 to-rose-500",
  },

  {
    id: "croma-deal",
    platform: "Croma",
    title: "Gadget Fest",
    description: "Deals on electronics and home appliances",
    discount: "Up to 45% OFF",
    category: "Electronics",
    icon: "🔌",
    gradient: "from-green-500 to-emerald-600",
  },

  {
    id: "ajio-deal",
    platform: "AJIO",
    title: "Style Steals",
    description: "Discover the latest fashion at great prices",
    discount: "Starting ₹499",
    category: "Fashion",
    icon: "👟",
    gradient: "from-purple-600 to-fuchsia-600",
  },

  {
    id: "tatacliq-deal",
    platform: "Tata CLiQ",
    title: "Shopping Specials",
    description: "Exclusive deals across popular categories",
    discount: "Up to 55% OFF",
    category: "Shopping",
    icon: "🏷️",
    gradient: "from-red-500 to-orange-500",
  },
];


/* =========================================================
   CATEGORIES
========================================================= */

export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "📱",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    count: 8900,
  },

  {
    id: "fashion",
    name: "Fashion",
    icon: "👗",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
    count: 12400,
  },

  {
    id: "mobiles",
    name: "Mobiles",
    icon: "📲",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    count: 6700,
  },

  {
    id: "laptops",
    name: "Laptops",
    icon: "💻",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    count: 3400,
  },

  {
    id: "home",
    name: "Home",
    icon: "🏠",
    image:
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=400&h=300&fit=crop",
    count: 5300,
  },

  {
    id: "appliances",
    name: "Appliances",
    icon: "🔌",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=300&fit=crop",
    count: 4100,
  },
];


/* =========================================================
   MARKETPLACE DEALS
========================================================= */

export const deals: Deal[] = [

  {
    id: "amazon-1",
    title: "Amazon Electronics Mega Sale",
    subtitle: "Up to 60% off on Mobiles, Laptops & Accessories",
    gradient: "from-orange-500 to-yellow-500",
    badge: "AMAZON • LIVE",
  },

  {
    id: "flipkart-1",
    title: "Flipkart Big Saving Days",
    subtitle: "Great deals on Smartphones, TVs & Electronics",
    gradient: "from-blue-600 to-indigo-600",
    badge: "FLIPKART • DEALS",
  },

  {
    id: "myntra-1",
    title: "Myntra Fashion Sale",
    subtitle: "Up to 70% off on Trending Fashion & Sneakers",
    gradient: "from-pink-500 to-rose-500",
    badge: "MYNTRA • TRENDING",
  },

  {
    id: "croma-1",
    title: "Croma Electronics Deals",
    subtitle: "Save big on Laptops, TVs, Appliances & Gadgets",
    gradient: "from-green-500 to-emerald-600",
    badge: "CROMA • HOT DEAL",
  },

  {
    id: "ajio-1",
    title: "AJIO Fashion Specials",
    subtitle: "Trending styles starting from ₹499",
    gradient: "from-purple-600 to-fuchsia-600",
    badge: "AJIO • FASHION",
  },

  {
    id: "tata-1",
    title: "Tata CLiQ Shopping Deals",
    subtitle: "Exclusive discounts across popular categories",
    gradient: "from-red-500 to-orange-500",
    badge: "TATA CLIQ • SALE",
  },

];


/* =========================================================
   TRENDING PRODUCTS
========================================================= */

export const products: Product[] = [

  {
    id: "1",
    name: "Men's Premium Cotton T-Shirt",
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",

    prices: [
      {
        platform: "Amazon",
        price: 499,
        rating: 4.3,
        delivery: "2 days",
        discount: "30% off",
      },

      {
        platform: "Flipkart",
        price: 479,
        rating: 4.1,
        delivery: "3 days",
        discount: "35% off",
      },

      {
        platform: "Myntra",
        price: 520,
        rating: 4.5,
        delivery: "4 days",
        discount: "25% off",
      },
    ],
  },


  {
    id: "2",
    name: "Wireless Bluetooth Earbuds Pro",
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",

    prices: [
      {
        platform: "Amazon",
        price: 1299,
        rating: 4.4,
        delivery: "1 day",
        discount: "40% off",
      },

      {
        platform: "Flipkart",
        price: 1199,
        rating: 4.2,
        delivery: "2 days",
        discount: "45% off",
      },

      {
        platform: "Croma",
        price: 1399,
        rating: 4.0,
        delivery: "3 days",
        discount: "30% off",
      },
    ],
  },


  {
    id: "3",
    name: "Smart Watch Series X",
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",

    prices: [
      {
        platform: "Amazon",
        price: 2999,
        rating: 4.5,
        delivery: "1 day",
        discount: "20% off",
      },

      {
        platform: "Flipkart",
        price: 2799,
        rating: 4.3,
        delivery: "2 days",
        discount: "25% off",
      },

      {
        platform: "Croma",
        price: 3199,
        rating: 4.1,
        delivery: "3 days",
      },
    ],
  },


  {
    id: "4",
    name: "Women's Running Sneakers",
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",

    prices: [
      {
        platform: "Amazon",
        price: 1899,
        rating: 4.4,
        delivery: "2 days",
        discount: "15% off",
      },

      {
        platform: "Myntra",
        price: 1799,
        rating: 4.6,
        delivery: "3 days",
        discount: "20% off",
      },

      {
        platform: "Flipkart",
        price: 1949,
        rating: 4.2,
        delivery: "2 days",
      },
    ],
  },


  {
    id: "5",
    name: "Premium Laptop for Work & Gaming",
    category: "laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",

    prices: [
      {
        platform: "Amazon",
        price: 64999,
        rating: 4.5,
        delivery: "2 days",
        discount: "12% off",
      },

      {
        platform: "Flipkart",
        price: 62999,
        rating: 4.4,
        delivery: "3 days",
        discount: "15% off",
      },

      {
        platform: "Croma",
        price: 67999,
        rating: 4.3,
        delivery: "2 days",
        discount: "10% off",
      },
    ],
  },


  {
    id: "6",
    name: "Latest 5G Smartphone",
    category: "mobiles",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",

    prices: [
      {
        platform: "Amazon",
        price: 24999,
        rating: 4.4,
        delivery: "1 day",
        discount: "10% off",
      },

      {
        platform: "Flipkart",
        price: 23999,
        rating: 4.5,
        delivery: "2 days",
        discount: "14% off",
      },

      {
        platform: "Croma",
        price: 25999,
        rating: 4.2,
        delivery: "3 days",
      },
    ],
  },


  {
    id: "7",
    name: "Modern Home Decor Set",
    category: "home",
    image:
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=400&h=400&fit=crop",

    prices: [
      {
        platform: "Amazon",
        price: 1499,
        rating: 4.3,
        delivery: "2 days",
        discount: "25% off",
      },

      {
        platform: "Flipkart",
        price: 1399,
        rating: 4.1,
        delivery: "4 days",
        discount: "30% off",
      },

      {
        platform: "Myntra",
        price: 1599,
        rating: 4.4,
        delivery: "3 days",
      },
    ],
  },


  {
    id: "8",
    name: "Smart Home Appliance",
    category: "appliances",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=400&fit=crop",

    prices: [
      {
        platform: "Amazon",
        price: 3499,
        rating: 4.4,
        delivery: "2 days",
        discount: "18% off",
      },

      {
        platform: "Flipkart",
        price: 3299,
        rating: 4.2,
        delivery: "3 days",
        discount: "22% off",
      },

      {
        platform: "Croma",
        price: 3699,
        rating: 4.5,
        delivery: "1 day",
      },
    ],
  },

];


/* =========================================================
   SEARCH SUGGESTIONS
========================================================= */

export const suggestions = {
  shopping: [
    "Men's Shirts",
    "Sneakers",
    "Trending Gadgets",
    "Women's Dresses",
    "Headphones",
    "Smartphones",
    "Laptops",
  ],

  electronics: [
    "Wireless Earbuds",
    "Smart Watches",
    "Gaming Laptops",
    "Bluetooth Speakers",
    "Power Banks",
  ],

  fashion: [
    "Men's Shirts",
    "Sneakers",
    "Women's Dresses",
    "Jeans",
    "Jackets",
  ],

  mobiles: [
    "5G Smartphones",
    "iPhones",
    "Samsung Phones",
    "OnePlus Phones",
    "Budget Phones",
  ],
};


/* =========================================================
   PRICE RANGES
========================================================= */

export const priceRanges = [
  {
    label: "Under ₹499",
    value: 499,
  },

  {
    label: "Under ₹999",
    value: 999,
  },

  {
    label: "Under ₹1,999",
    value: 1999,
  },

  {
    label: "Under ₹4,999",
    value: 4999,
  },

  {
    label: "Under ₹9,999",
    value: 9999,
  },

  {
    label: "Under ₹49,999",
    value: 49999,
  },
];


/* =========================================================
   TRUSTED / SUPPORTED PLATFORMS
========================================================= */

export const trustedPlatforms = [
  "Amazon",
  "Flipkart",
  "Myntra",
  "Croma",
  "Ajio",
  "TataCliq",
];