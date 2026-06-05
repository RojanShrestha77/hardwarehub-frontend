export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badge?: string;
  color: string; // gradient class for placeholder image bg
  description: string;
  specs: Record<string, string>;
  images: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "NVIDIA GeForce RTX 4070 Super 12GB",
    category: "GPU",
    brand: "NVIDIA",
    price: 74999,
    originalPrice: 84999,
    rating: 4.8,
    reviewCount: 2847,
    inStock: true,
    badge: "Best Seller",
    color: "from-green-900 to-green-700",
    description: "Experience next-gen gaming with DLSS 3, ray tracing, and Ada Lovelace architecture. The RTX 4070 Super delivers up to 2× the performance of the RTX 3070.",
    specs: { VRAM: "12GB GDDR6X", "Core Clock": "1980 MHz", "Boost Clock": "2505 MHz", "Memory Bus": "192-bit", TDP: "220W", Interface: "PCIe 4.0 x16" },
    images: [],
  },
  {
    id: "2",
    name: "AMD Ryzen 9 7950X 16-Core Processor",
    category: "CPU",
    brand: "AMD",
    price: 89999,
    originalPrice: 104999,
    rating: 4.9,
    reviewCount: 1923,
    inStock: true,
    badge: "Top Rated",
    color: "from-red-900 to-red-700",
    description: "The ultimate desktop processor with 16 cores and 32 threads. Dominate multitasking, content creation, and gaming with 5nm Zen 4 architecture.",
    specs: { Cores: "16C / 32T", "Base Clock": "4.5 GHz", "Boost Clock": "5.7 GHz", Cache: "64MB L3", TDP: "170W", Socket: "AM5" },
    images: [],
  },
  {
    id: "3",
    name: "Corsair Vengeance DDR5 32GB 6000MHz",
    category: "RAM",
    brand: "Corsair",
    price: 18999,
    originalPrice: 22999,
    rating: 4.7,
    reviewCount: 4120,
    inStock: true,
    badge: "Deal",
    color: "from-blue-900 to-blue-700",
    description: "High-performance DDR5 memory with XMP 3.0 support. Exceptional bandwidth for gaming, streaming, and professional workloads.",
    specs: { Capacity: "2×16GB", Speed: "DDR5-6000", Latency: "CL36", Voltage: "1.35V", Type: "DIMM", Profile: "XMP 3.0" },
    images: [],
  },
  {
    id: "4",
    name: "Samsung 990 Pro 2TB NVMe SSD",
    category: "Storage",
    brand: "Samsung",
    price: 22999,
    originalPrice: 27999,
    rating: 4.8,
    reviewCount: 3562,
    inStock: true,
    color: "from-indigo-900 to-indigo-700",
    description: "PCIe 4.0 NVMe SSD with read speeds up to 7450 MB/s. Optimized for gaming with low latency and consistent performance.",
    specs: { Capacity: "2TB", Interface: "PCIe 4.0 NVMe M.2", "Read Speed": "7450 MB/s", "Write Speed": "6900 MB/s", NAND: "Samsung V-NAND TLC", Warranty: "5 years" },
    images: [],
  },
  {
    id: "5",
    name: "ASUS ROG Strix X670E-E Gaming",
    category: "Motherboard",
    brand: "ASUS",
    price: 64999,
    originalPrice: 72999,
    rating: 4.6,
    reviewCount: 892,
    inStock: true,
    color: "from-purple-900 to-purple-700",
    description: "AMD AM5 flagship motherboard with PCIe 5.0, WiFi 6E, and robust power delivery for Ryzen 7000 series processors.",
    specs: { Socket: "AM5", Chipset: "X670E", "Memory Slots": "4×DDR5", "Max Memory": "128GB", "PCIe Slots": "PCIe 5.0 x16", Connectivity: "WiFi 6E, BT 5.3" },
    images: [],
  },
  {
    id: "6",
    name: "Corsair RM1000x 1000W 80+ Gold",
    category: "PSU",
    brand: "Corsair",
    price: 19999,
    originalPrice: 24999,
    rating: 4.9,
    reviewCount: 2103,
    inStock: true,
    badge: "Best Seller",
    color: "from-yellow-900 to-yellow-700",
    description: "Fully modular 80 PLUS Gold certified PSU with Zero RPM fan mode for silent operation at low-to-medium loads.",
    specs: { Wattage: "1000W", Efficiency: "80+ Gold", Modular: "Fully Modular", Fan: "135mm Zero RPM", Rails: "Single +12V", Warranty: "10 years" },
    images: [],
  },
  {
    id: "7",
    name: "Noctua NH-D15 CPU Cooler",
    category: "Cooling",
    brand: "Noctua",
    price: 12999,
    rating: 4.9,
    reviewCount: 5841,
    inStock: true,
    badge: "Top Rated",
    color: "from-amber-900 to-amber-700",
    description: "The benchmark of air cooling. Dual 140mm fans, six heat pipes, and near-silent operation for premium builds.",
    specs: { Type: "Dual-Tower Air", Fans: "2× NF-A15 140mm", "Max TDP": "250W+", Height: "165mm", Socket: "Intel/AMD Universal", Noise: "≤24.6 dB(A)" },
    images: [],
  },
  {
    id: "8",
    name: "AMD Radeon RX 7800 XT 16GB",
    category: "GPU",
    brand: "AMD",
    price: 59999,
    originalPrice: 67999,
    rating: 4.6,
    reviewCount: 1435,
    inStock: false,
    color: "from-rose-900 to-rose-700",
    description: "Exceptional 1440p gaming performance with 16GB GDDR6 and RDNA 3 architecture. FSR 3 support for smoother framerates.",
    specs: { VRAM: "16GB GDDR6", "Core Clock": "1295 MHz", "Boost Clock": "2430 MHz", "Memory Bus": "256-bit", TDP: "263W", Interface: "PCIe 4.0 x16" },
    images: [],
  },
];

export const CATEGORIES = [
  { name: "GPU",         icon: "🎮", desc: "Graphics Cards",     count: 48  },
  { name: "CPU",         icon: "⚡", desc: "Processors",         count: 36  },
  { name: "RAM",         icon: "🧩", desc: "Memory Modules",     count: 62  },
  { name: "Storage",     icon: "💾", desc: "SSDs & Hard Drives", count: 74  },
  { name: "Motherboard", icon: "🔌", desc: "Motherboards",       count: 29  },
  { name: "PSU",         icon: "⚙️", desc: "Power Supplies",     count: 31  },
  { name: "Cooling",     icon: "❄️", desc: "Coolers & Fans",     count: 55  },
  { name: "Cases",       icon: "🖥️", desc: "PC Cases",           count: 43  },
];

export const REVIEWS = [
  { id: "r1", author: "Rohan M.", rating: 5, date: "2025-11-12", comment: "Absolute beast of a component. Installation was smooth, temps are great, and the performance uplift is massive. Highly recommend for any serious build." },
  { id: "r2", author: "Priya S.", rating: 4, date: "2025-10-28", comment: "Great value for the price. Running stable at stock settings. Minor packaging damage on delivery but the product itself is perfect." },
  { id: "r3", author: "Bikash T.", rating: 5, date: "2025-10-15", comment: "Exactly what I needed for my workstation build. Handles everything I throw at it without breaking a sweat. HardwareHub delivered fast." },
];
