import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  ChartSpline,
  CheckCircle2,
  CircuitBoard,
  CloudCog,
  Code2,
  Cpu,
  FileCode2,
  GraduationCap,
  Handshake,
  Lightbulb,
  MessageCircleQuestion,
  Palette,
  RadioTower,
  ScanEye,
  ShieldCheck,
  Smartphone,
  Store,
  Wrench,
} from "lucide-react";

export type LandingNavigationItem = {
  label: string;
  href: string;
};

export type ProjectCategory = {
  name: string;
  slug: string;
  icon: LucideIcon;
  tone: string;
};

export type FeaturedProject = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  price: string;
  tags: readonly string[];
  icon: LucideIcon;
  visualTone: string;
};

export type PopularService = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  startingPrice: string;
  delivery: string;
  icon: LucideIcon;
};

export type HowItWorksStep = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type DigitalPerk = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const landingNavigation: LandingNavigationItem[] = [
  { label: "Categories", href: "#categories" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Student perks", href: "#perks" },
];

export const heroHighlights = [
  "Ready-made student projects",
  "Skilled student talent",
  "Practical project support",
  "Legitimate digital perks",
] as const;

export const projectCategories: ProjectCategory[] = [
  {
    name: "AI / Machine Learning",
    slug: "ai-machine-learning",
    icon: BrainCircuit,
    tone: "border-violet-200/70 bg-violet-50 text-violet-700",
  },
  {
    name: "Web Development",
    slug: "web-development",
    icon: Code2,
    tone: "border-sky-200/70 bg-sky-50 text-sky-700",
  },
  {
    name: "Mobile Apps",
    slug: "mobile-apps",
    icon: Smartphone,
    tone: "border-blue-200/70 bg-blue-50 text-blue-700",
  },
  {
    name: "IoT",
    slug: "iot",
    icon: RadioTower,
    tone: "border-cyan-200/70 bg-cyan-50 text-cyan-700",
  },
  {
    name: "Arduino",
    slug: "arduino",
    icon: Cpu,
    tone: "border-teal-200/70 bg-teal-50 text-teal-700",
  },
  {
    name: "Robotics",
    slug: "robotics",
    icon: Bot,
    tone: "border-orange-200/70 bg-orange-50 text-orange-700",
  },
  {
    name: "Data Science",
    slug: "data-science",
    icon: ChartSpline,
    tone: "border-emerald-200/70 bg-emerald-50 text-emerald-700",
  },
  {
    name: "Computer Vision",
    slug: "computer-vision",
    icon: ScanEye,
    tone: "border-indigo-200/70 bg-indigo-50 text-indigo-700",
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    icon: ShieldCheck,
    tone: "border-rose-200/70 bg-rose-50 text-rose-700",
  },
  {
    name: "Electronics",
    slug: "electronics",
    icon: CircuitBoard,
    tone: "border-amber-200/70 bg-amber-50 text-amber-700",
  },
];

export const featuredProjects: FeaturedProject[] = [
  {
    title: "Bangla Sentiment Analysis Toolkit",
    slug: "bangla-sentiment-analysis-toolkit",
    category: "AI / Machine Learning",
    summary:
      "A documented NLP starter with preprocessing, model training, and evaluation notebooks.",
    price: "৳2,800",
    tags: ["Python", "NLP", "Notebook"],
    icon: BrainCircuit,
    visualTone: "border-violet-200 bg-violet-50 text-violet-700",
  },
  {
    title: "Smart Energy Monitor with ESP32",
    slug: "smart-energy-monitor-esp32",
    category: "IoT",
    summary:
      "An ESP32 monitoring prototype with circuit guide, dashboard, and setup documentation.",
    price: "৳4,500",
    tags: ["ESP32", "Sensors", "IoT"],
    icon: RadioTower,
    visualTone: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  {
    title: "Campus Shuttle Tracker",
    slug: "campus-shuttle-tracker",
    category: "Mobile Apps",
    summary:
      "A cross-platform tracking app starter with route views and a clean operations panel.",
    price: "৳3,200",
    tags: ["Flutter", "Maps", "Mobile"],
    icon: Smartphone,
    visualTone: "border-blue-200 bg-blue-50 text-blue-700",
  },
  {
    title: "Portfolio CMS Starter",
    slug: "portfolio-cms-starter",
    category: "Web Development",
    summary:
      "A responsive portfolio and content dashboard prepared for straightforward customization.",
    price: "৳1,800",
    tags: ["Next.js", "TypeScript", "CMS"],
    icon: FileCode2,
    visualTone: "border-sky-200 bg-sky-50 text-sky-700",
  },
];

export const popularServices: PopularService[] = [
  {
    title: "React & Next.js debugging",
    slug: "react-nextjs-debugging",
    category: "Development support",
    summary:
      "Work through UI, routing, state, or deployment issues with a student developer.",
    startingPrice: "From ৳800",
    delivery: "Remote session",
    icon: Wrench,
  },
  {
    title: "Capstone UI/UX design",
    slug: "capstone-ui-ux-design",
    category: "Design",
    summary:
      "Turn requirements into a clear user flow, wireframes, and a polished interface direction.",
    startingPrice: "From ৳1,500",
    delivery: "Design package",
    icon: Palette,
  },
  {
    title: "Arduino prototype mentoring",
    slug: "arduino-prototype-mentoring",
    category: "Electronics",
    summary:
      "Get guidance on component choices, circuits, code structure, and prototype debugging.",
    startingPrice: "From ৳1,200",
    delivery: "1:1 mentoring",
    icon: Lightbulb,
  },
  {
    title: "Data analysis consultation",
    slug: "data-analysis-consultation",
    category: "Data Science",
    summary:
      "Plan a clean analysis workflow and get help understanding models and visualizations.",
    startingPrice: "From ৳1,000",
    delivery: "Consultation",
    icon: ChartSpline,
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: "01",
    title: "Explore what you need",
    description:
      "Browse ready-made projects, student services, practical support, and useful perks.",
    icon: Store,
  },
  {
    step: "02",
    title: "Review the details",
    description:
      "Compare scope, deliverables, documentation, and expectations before you decide.",
    icon: CheckCircle2,
  },
  {
    step: "03",
    title: "Learn, build, and improve",
    description:
      "Use licensed assets responsibly or work with a student to move your own project forward.",
    icon: GraduationCap,
  },
];

export const digitalPerks: DigitalPerk[] = [
  {
    title: "Developer resources",
    description:
      "Find legitimate student plans, learning tools, and software offers in one place.",
    icon: Code2,
  },
  {
    title: "Cloud & infrastructure",
    description:
      "Discover education programs and credits intended for eligible student builders.",
    icon: CloudCog,
  },
  {
    title: "Design & productivity",
    description:
      "Browse verified paths to student pricing for creative and productivity tools.",
    icon: BadgePercent,
  },
];

export const sellerBenefits = [
  "List work you own or can distribute",
  "Explain exactly what buyers receive",
  "Offer customization as a separate service",
] as const;

export const trustPrinciples = [
  {
    title: "Legitimate reuse",
    description: "Projects and assets must be owned or licensed for distribution.",
    icon: ShieldCheck,
  },
  {
    title: "Learning-first support",
    description: "Mentoring, tutoring, consultation, and debugging are welcome.",
    icon: MessageCircleQuestion,
  },
  {
    title: "Clear boundaries",
    description:
      "No exam impersonation, credential sharing, plagiarism, or dishonest submissions.",
    icon: Handshake,
  },
] as const;

export const footerGroups = [
  {
    title: "Marketplace",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Ready-made projects", href: "/projects" },
      { label: "Hire talent", href: "/talent" },
      { label: "Digital perks", href: "/perks" },
    ],
  },
  {
    title: "For students",
    links: [
      { label: "Sell a project", href: "/sell" },
      { label: "Offer a service", href: "/sell" },
      { label: "Project help", href: "/project-help" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Principles",
    links: [
      { label: "Academic integrity", href: "#trust" },
      { label: "Responsible reuse", href: "#trust" },
      { label: "Student safety", href: "#trust" },
    ],
  },
] as const;

export const marketplaceAreas = [
  { label: "Projects", icon: FileCode2 },
  { label: "Student talent", icon: BriefcaseBusiness },
  { label: "Project support", icon: MessageCircleQuestion },
] as const;
