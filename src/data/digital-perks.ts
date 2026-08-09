import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  CloudCog,
  Code2,
  GraduationCap,
  ListChecks,
  Palette,
  PenTool,
} from "lucide-react";

export const perkCategories = [
  "AI",
  "Development",
  "Design",
  "Cloud",
  "Learning",
  "Productivity",
  "Creative",
] as const;

export type PerkCategory = (typeof perkCategories)[number];

export type DigitalPerkListing = {
  category: PerkCategory;
  description: string;
  destinationUrl: string;
  eligibility: string;
  id: string;
  offerLabel: string;
  providerName: string;
  terms: string;
  title: string;
};

export const perkCategoryIcons: Record<PerkCategory, LucideIcon> = {
  AI: BrainCircuit,
  Development: Code2,
  Design: PenTool,
  Cloud: CloudCog,
  Learning: GraduationCap,
  Productivity: ListChecks,
  Creative: Palette,
};

export const officialDigitalPerks: DigitalPerkListing[] = [
  {
    category: "AI",
    description:
      "A collaborative notebook workspace offer for verified students building data science and machine-learning projects.",
    destinationUrl: "https://education.github.com/pack",
    eligibility: "Verified GitHub Student Developer Pack membership.",
    id: "deepnote-student-offer",
    offerLabel: "Student plan",
    providerName: "Deepnote",
    terms: "Current availability and plan limits are shown by GitHub Education.",
    title: "Deepnote student access",
  },
  {
    category: "Development",
    description:
      "A verified collection of developer tools, learning resources, and partner offers for students.",
    destinationUrl: "https://education.github.com/pack",
    eligibility: "Students aged 13 or older who pass GitHub Education verification.",
    id: "github-student-developer-pack",
    offerLabel: "Student benefits",
    providerName: "GitHub Education",
    terms: "Each included provider sets its own duration, limits, and redemption terms.",
    title: "GitHub Student Developer Pack",
  },
  {
    category: "Development",
    description:
      "Educational access to professional JetBrains desktop IDEs for eligible students and teachers.",
    destinationUrl: "https://www.jetbrains.com/community/education/#students",
    eligibility: "Current students or teachers who complete education verification.",
    id: "jetbrains-student-pack",
    offerLabel: "Free educational license",
    providerName: "JetBrains",
    terms: "Educational use terms apply and eligibility must be renewed periodically.",
    title: "JetBrains Student Pack",
  },
  {
    category: "Design",
    description:
      "Verified education teams receive access to Figma and FigJam tools for classroom design and collaboration.",
    destinationUrl: "https://www.figma.com/education/",
    eligibility: "Eligible students and educators in supported regions after verification.",
    id: "figma-for-education",
    offerLabel: "Free education plan",
    providerName: "Figma",
    terms: "Plan level, regional availability, and renewal requirements vary by institution type.",
    title: "Figma for Education",
  },
  {
    category: "Cloud",
    description:
      "Cloud credits, selected free services, developer tools, and learning resources for eligible students.",
    destinationUrl: "https://azure.microsoft.com/en-us/free/students",
    eligibility: "Eligible full-time university students using a school identity.",
    id: "azure-for-students",
    offerLabel: "Student cloud credit",
    providerName: "Microsoft Azure",
    terms: "Credits, service limits, availability, and annual renewal follow Microsoft's current terms.",
    title: "Azure for Students",
  },
  {
    category: "Learning",
    description:
      "In-depth web development courses available through a current GitHub Education partner offer.",
    destinationUrl: "https://education.github.com/pack",
    eligibility: "Verified GitHub Student Developer Pack membership.",
    id: "frontend-masters-student-offer",
    offerLabel: "Learning access",
    providerName: "Frontend Masters",
    terms: "The current access period and redemption conditions are listed in the GitHub pack.",
    title: "Frontend Masters student offer",
  },
  {
    category: "Productivity",
    description:
      "An education workspace for notes, coursework, planning, and collaboration using verified school access.",
    destinationUrl: "https://www.notion.com/product/notion-for-education",
    eligibility: "Eligible higher-education students and educators with a school email.",
    id: "notion-for-education",
    offerLabel: "Education plan",
    providerName: "Notion",
    terms: "Workspace features and verification requirements follow Notion's current education terms.",
    title: "Notion for Education",
  },
  {
    category: "Creative",
    description:
      "Renewable educational access to eligible Autodesk software for learning and non-commercial coursework.",
    destinationUrl: "https://www.autodesk.com/education/edu-software/overview",
    eligibility: "Verified students and educators at qualified educational institutions.",
    id: "autodesk-education",
    offerLabel: "Free education access",
    providerName: "Autodesk",
    terms: "Educational licenses cannot be used for commercial or professional work.",
    title: "Autodesk Education access",
  },
  {
    category: "Creative",
    description:
      "Discounted Creative Cloud plans for eligible students and teachers, subject to regional pricing.",
    destinationUrl: "https://www.adobe.com/creativecloud/buy/students.html",
    eligibility: "Eligible students and educators who complete Adobe's verification.",
    id: "adobe-student-pricing",
    offerLabel: "Student discount",
    providerName: "Adobe",
    terms: "Introductory pricing, renewal pricing, and availability vary by country and plan.",
    title: "Adobe Creative Cloud student pricing",
  },
];

export function inferPerkCategory(value: string): PerkCategory {
  const normalized = value.toLowerCase();

  if (/\bai\b|machine learning|data science|notebook/.test(normalized)) return "AI";
  if (/design|ui|ux|figma/.test(normalized)) return "Design";
  if (/cloud|hosting|infrastructure|deploy/.test(normalized)) return "Cloud";
  if (/course|learn|training|tutorial/.test(normalized)) return "Learning";
  if (/productivity|planning|notes|workspace/.test(normalized)) return "Productivity";
  if (/creative|photo|video|animation|3d/.test(normalized)) return "Creative";
  return "Development";
}

export const prohibitedPerkTerms = [
  "shared account",
  "shared login",
  "shared password",
  "username and password",
  "account credentials",
  "account for sale",
  "account resale",
  "credential resale",
  "login for sale",
] as const;
