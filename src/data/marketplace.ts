import type { LucideIcon } from "lucide-react";
import {
  Bot,
  BrainCircuit,
  Bug,
  ChartSpline,
  CircuitBoard,
  Database,
  Droplets,
  Eye,
  Hospital,
  HousePlug,
  Leaf,
  Network,
  Palette,
  ScanLine,
  ShoppingCart,
  WalletCards,
} from "lucide-react";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ListingSeller = {
  name: string;
  verified: boolean;
};

export type MarketplaceProject = {
  id: string;
  title: string;
  seller: ListingSeller;
  category: string;
  department: string;
  difficulty: Difficulty;
  summary: string;
  technologies: readonly string[];
  rating: number;
  reviewCount: number;
  price: number;
  hasPreview: boolean;
  icon: LucideIcon;
  visualTone: string;
  createdAt: string;
  popularity: number;
};

export type MarketplaceService = {
  id: string;
  title: string;
  seller: ListingSeller;
  category: string;
  department: string;
  summary: string;
  technologies: readonly string[];
  rating: number;
  reviewCount: number;
  startingPrice: number;
  deliveryTime: string;
  icon: LucideIcon;
  visualTone: string;
  createdAt: string;
  popularity: number;
};

export const marketplaceProjects: MarketplaceProject[] = [
  {
    id: "ai-plant-disease-detection",
    title: "AI Plant Disease Detection",
    seller: { name: "Ayesha T.", verified: true },
    category: "AI / Machine Learning",
    department: "CSE",
    difficulty: "Intermediate",
    summary:
      "Image-based crop disease classification with training notebooks, sample data, and an inference interface.",
    technologies: ["Python", "TensorFlow", "OpenCV"],
    rating: 4.8,
    reviewCount: 18,
    price: 3200,
    hasPreview: true,
    icon: Leaf,
    visualTone:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300",
    createdAt: "2026-07-24",
    popularity: 96,
  },
  {
    id: "face-recognition-attendance-system",
    title: "Face Recognition Attendance System",
    seller: { name: "Nabil H.", verified: true },
    category: "Computer Vision",
    department: "CSE",
    difficulty: "Advanced",
    summary:
      "A documented attendance workflow with face enrollment, recognition logs, and an admin dashboard.",
    technologies: ["Python", "OpenCV", "Flask"],
    rating: 4.7,
    reviewCount: 14,
    price: 4500,
    hasPreview: true,
    icon: Eye,
    visualTone:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-400/10 dark:text-indigo-300",
    createdAt: "2026-06-18",
    popularity: 92,
  },
  {
    id: "smart-irrigation-iot-system",
    title: "Smart Irrigation IoT System",
    seller: { name: "Farhan M.", verified: true },
    category: "IoT",
    department: "EEE",
    difficulty: "Intermediate",
    summary:
      "Soil-moisture automation with ESP32 firmware, circuit diagrams, and a lightweight monitoring panel.",
    technologies: ["ESP32", "C++", "Sensors"],
    rating: 4.9,
    reviewCount: 21,
    price: 3800,
    hasPreview: true,
    icon: Droplets,
    visualTone:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-300",
    createdAt: "2026-07-02",
    popularity: 98,
  },
  {
    id: "ecommerce-analytics-dashboard",
    title: "E-commerce Dashboard",
    seller: { name: "Raisa K.", verified: false },
    category: "Web Development",
    department: "CSE",
    difficulty: "Intermediate",
    summary:
      "A responsive commerce operations dashboard with catalog, order, and sales visualization modules.",
    technologies: ["Next.js", "TypeScript", "Tailwind"],
    rating: 4.6,
    reviewCount: 11,
    price: 2500,
    hasPreview: true,
    icon: ShoppingCart,
    visualTone:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300",
    createdAt: "2026-07-29",
    popularity: 90,
  },
  {
    id: "hospital-management-system",
    title: "Hospital Management System",
    seller: { name: "Tanvir S.", verified: true },
    category: "Web Development",
    department: "CSE",
    difficulty: "Advanced",
    summary:
      "Role-based patient, appointment, billing, and inventory modules with clear technical documentation.",
    technologies: ["Laravel", "MySQL", "Bootstrap"],
    rating: 4.8,
    reviewCount: 16,
    price: 5200,
    hasPreview: true,
    icon: Hospital,
    visualTone:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-300",
    createdAt: "2026-05-21",
    popularity: 94,
  },
  {
    id: "bangla-sentiment-analysis",
    title: "Bangla Sentiment Analysis",
    seller: { name: "Samia R.", verified: true },
    category: "AI / Machine Learning",
    department: "CSE",
    difficulty: "Intermediate",
    summary:
      "An NLP starter covering Bangla text preprocessing, model comparison, evaluation, and inference.",
    technologies: ["Python", "NLP", "scikit-learn"],
    rating: 4.7,
    reviewCount: 13,
    price: 2800,
    hasPreview: true,
    icon: BrainCircuit,
    visualTone:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/25 dark:bg-violet-400/10 dark:text-violet-300",
    createdAt: "2026-07-11",
    popularity: 91,
  },
  {
    id: "vehicle-number-plate-recognition",
    title: "Vehicle Number Plate Recognition",
    seller: { name: "Mahin A.", verified: true },
    category: "Computer Vision",
    department: "CSE",
    difficulty: "Advanced",
    summary:
      "Plate localization and OCR pipeline with test media, evaluation notes, and a simple review interface.",
    technologies: ["Python", "YOLO", "OCR"],
    rating: 4.9,
    reviewCount: 19,
    price: 4800,
    hasPreview: true,
    icon: ScanLine,
    visualTone:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-400/10 dark:text-indigo-300",
    createdAt: "2026-08-01",
    popularity: 97,
  },
  {
    id: "expense-tracker-mobile-app",
    title: "Expense Tracker Mobile App",
    seller: { name: "Nusrat J.", verified: false },
    category: "Mobile Apps",
    department: "CSE",
    difficulty: "Beginner",
    summary:
      "A clean personal finance app with categories, budgets, local persistence, and chart-based summaries.",
    technologies: ["Flutter", "Dart", "SQLite"],
    rating: 4.5,
    reviewCount: 9,
    price: 1800,
    hasPreview: true,
    icon: WalletCards,
    visualTone:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-300",
    createdAt: "2026-07-16",
    popularity: 86,
  },
  {
    id: "arduino-home-automation",
    title: "Arduino Home Automation",
    seller: { name: "Zarif I.", verified: true },
    category: "Arduino",
    department: "EEE",
    difficulty: "Intermediate",
    summary:
      "Bluetooth-controlled lighting and appliance prototype with schematics, firmware, and build notes.",
    technologies: ["Arduino", "C++", "Bluetooth"],
    rating: 4.6,
    reviewCount: 12,
    price: 3400,
    hasPreview: false,
    icon: HousePlug,
    visualTone:
      "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-400/25 dark:bg-teal-400/10 dark:text-teal-300",
    createdAt: "2026-06-27",
    popularity: 88,
  },
  {
    id: "network-monitoring-dashboard",
    title: "Network Monitoring Dashboard",
    seller: { name: "Adnan C.", verified: true },
    category: "Cybersecurity",
    department: "CSE",
    difficulty: "Advanced",
    summary:
      "A network health dashboard with device discovery, uptime views, alerts, and deployment guidance.",
    technologies: ["Python", "SNMP", "React"],
    rating: 4.8,
    reviewCount: 15,
    price: 4200,
    hasPreview: true,
    icon: Network,
    visualTone:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-300",
    createdAt: "2026-07-20",
    popularity: 93,
  },
  {
    id: "autonomous-line-following-robot",
    title: "Autonomous Line-Following Robot",
    seller: { name: "Sakib N.", verified: false },
    category: "Robotics",
    department: "EEE",
    difficulty: "Intermediate",
    summary:
      "A sensor-calibrated robot build with chassis guide, motor control code, and tuning walkthrough.",
    technologies: ["Arduino", "IR Sensors", "Motor Driver"],
    rating: 4.4,
    reviewCount: 8,
    price: 3000,
    hasPreview: false,
    icon: Bot,
    visualTone:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-400/25 dark:bg-orange-400/10 dark:text-orange-300",
    createdAt: "2026-05-30",
    popularity: 82,
  },
  {
    id: "student-result-analytics",
    title: "Student Result Analytics",
    seller: { name: "Maliha P.", verified: false },
    category: "Data Science",
    department: "CSE",
    difficulty: "Beginner",
    summary:
      "Exploratory analysis and prediction notebooks with a compact dashboard for academic datasets.",
    technologies: ["Python", "Pandas", "Power BI"],
    rating: 4.5,
    reviewCount: 10,
    price: 2200,
    hasPreview: true,
    icon: ChartSpline,
    visualTone:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300",
    createdAt: "2026-07-07",
    popularity: 84,
  },
  {
    id: "digital-logic-ic-tester",
    title: "Digital Logic IC Tester",
    seller: { name: "Mehedi B.", verified: false },
    category: "Electronics",
    department: "EEE",
    difficulty: "Intermediate",
    summary:
      "A compact logic-IC testing prototype with schematic, firmware, PCB notes, and component guide.",
    technologies: ["Arduino", "C++", "PCB"],
    rating: 4.6,
    reviewCount: 7,
    price: 3600,
    hasPreview: false,
    icon: CircuitBoard,
    visualTone:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300",
    createdAt: "2026-06-09",
    popularity: 80,
  },
];

export const marketplaceServices: MarketplaceService[] = [
  {
    id: "react-nextjs-debugging",
    title: "React & Next.js Debugging",
    seller: { name: "Imran F.", verified: true },
    category: "Web Development",
    department: "CSE",
    summary:
      "Work through rendering, routing, state, or deployment issues with a student developer.",
    technologies: ["React", "Next.js", "TypeScript"],
    rating: 4.9,
    reviewCount: 24,
    startingPrice: 800,
    deliveryTime: "1–2 days",
    icon: Bug,
    visualTone:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300",
    createdAt: "2026-07-28",
    popularity: 98,
  },
  {
    id: "capstone-ui-ux-design",
    title: "Capstone UI/UX Design",
    seller: { name: "Lamisa A.", verified: true },
    category: "UI / UX Design",
    department: "Design",
    summary:
      "Turn requirements into a clear user flow, wireframes, and a polished interface direction.",
    technologies: ["Figma", "Wireframes", "Prototype"],
    rating: 4.8,
    reviewCount: 17,
    startingPrice: 1500,
    deliveryTime: "3–5 days",
    icon: Palette,
    visualTone:
      "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-400/25 dark:bg-fuchsia-400/10 dark:text-fuchsia-300",
    createdAt: "2026-07-13",
    popularity: 93,
  },
  {
    id: "arduino-prototype-mentoring",
    title: "Arduino Prototype Mentoring",
    seller: { name: "Rafid M.", verified: true },
    category: "Arduino",
    department: "EEE",
    summary:
      "Get guidance on component choices, circuits, code structure, and prototype debugging.",
    technologies: ["Arduino", "C++", "Electronics"],
    rating: 4.9,
    reviewCount: 20,
    startingPrice: 1200,
    deliveryTime: "2 sessions",
    icon: HousePlug,
    visualTone:
      "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-400/25 dark:bg-teal-400/10 dark:text-teal-300",
    createdAt: "2026-06-22",
    popularity: 95,
  },
  {
    id: "data-analysis-consultation",
    title: "Data Analysis Consultation",
    seller: { name: "Tahmid R.", verified: false },
    category: "Data Science",
    department: "CSE",
    summary:
      "Plan a clean analysis workflow and get help understanding models and visualizations.",
    technologies: ["Python", "Pandas", "Power BI"],
    rating: 4.7,
    reviewCount: 13,
    startingPrice: 1000,
    deliveryTime: "1–2 days",
    icon: ChartSpline,
    visualTone:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300",
    createdAt: "2026-07-05",
    popularity: 89,
  },
  {
    id: "machine-learning-model-review",
    title: "Machine Learning Model Review",
    seller: { name: "Sabrina H.", verified: true },
    category: "AI / Machine Learning",
    department: "CSE",
    summary:
      "Review preprocessing, model choices, evaluation, and code quality with actionable feedback.",
    technologies: ["Python", "TensorFlow", "scikit-learn"],
    rating: 4.8,
    reviewCount: 16,
    startingPrice: 1400,
    deliveryTime: "2–3 days",
    icon: BrainCircuit,
    visualTone:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/25 dark:bg-violet-400/10 dark:text-violet-300",
    createdAt: "2026-08-02",
    popularity: 92,
  },
  {
    id: "database-api-architecture-help",
    title: "Database & API Architecture Help",
    seller: { name: "Fahim Q.", verified: true },
    category: "Web Development",
    department: "CSE",
    summary:
      "Shape a maintainable schema and API plan, or troubleshoot an existing backend design.",
    technologies: ["PostgreSQL", "Node.js", "REST API"],
    rating: 4.7,
    reviewCount: 12,
    startingPrice: 1100,
    deliveryTime: "1–3 days",
    icon: Database,
    visualTone:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-300",
    createdAt: "2026-07-19",
    popularity: 90,
  },
];

const allListings = [...marketplaceProjects, ...marketplaceServices];

export const marketplaceCategories = Array.from(
  new Set(allListings.map((listing) => listing.category)),
).sort();

export const marketplaceDepartments = Array.from(
  new Set(allListings.map((listing) => listing.department)),
).sort();

export const marketplaceTechStacks = Array.from(
  new Set(allListings.flatMap((listing) => listing.technologies)),
).sort();

export const marketplaceDifficulties: Difficulty[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];
