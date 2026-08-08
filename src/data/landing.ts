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
  MessageCircleQuestion,
  RadioTower,
  ScanEye,
  ShieldCheck,
  Smartphone,
  Store,
} from "lucide-react";

import {
  marketplaceProjects,
  marketplaceServices,
} from "@/data/marketplace";

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
  { label: "Categories", href: "/#categories" },
  { label: "Projects", href: "/#projects" },
  { label: "Services", href: "/#services" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Student perks", href: "/#perks" },
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
    tone:
      "border-violet-200/70 bg-violet-50 text-violet-700 dark:border-violet-400/25 dark:bg-violet-400/10 dark:text-violet-300",
  },
  {
    name: "Web Development",
    slug: "web-development",
    icon: Code2,
    tone:
      "border-sky-200/70 bg-sky-50 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300",
  },
  {
    name: "Mobile Apps",
    slug: "mobile-apps",
    icon: Smartphone,
    tone:
      "border-blue-200/70 bg-blue-50 text-blue-700 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-300",
  },
  {
    name: "IoT",
    slug: "iot",
    icon: RadioTower,
    tone:
      "border-cyan-200/70 bg-cyan-50 text-cyan-700 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-300",
  },
  {
    name: "Arduino",
    slug: "arduino",
    icon: Cpu,
    tone:
      "border-teal-200/70 bg-teal-50 text-teal-700 dark:border-teal-400/25 dark:bg-teal-400/10 dark:text-teal-300",
  },
  {
    name: "Robotics",
    slug: "robotics",
    icon: Bot,
    tone:
      "border-orange-200/70 bg-orange-50 text-orange-700 dark:border-orange-400/25 dark:bg-orange-400/10 dark:text-orange-300",
  },
  {
    name: "Data Science",
    slug: "data-science",
    icon: ChartSpline,
    tone:
      "border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  {
    name: "Computer Vision",
    slug: "computer-vision",
    icon: ScanEye,
    tone:
      "border-indigo-200/70 bg-indigo-50 text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-400/10 dark:text-indigo-300",
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    icon: ShieldCheck,
    tone:
      "border-rose-200/70 bg-rose-50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-300",
  },
  {
    name: "Electronics",
    slug: "electronics",
    icon: CircuitBoard,
    tone:
      "border-amber-200/70 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300",
  },
];

export const featuredProjects = marketplaceProjects.slice(0, 4);

export const popularServices = marketplaceServices.slice(0, 4);

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
