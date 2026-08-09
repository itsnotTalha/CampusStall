import type { Database } from "@/types/database";

export const projectHelpCategories = [
  { name: "AI / Machine Learning", slug: "ai-machine-learning" },
  { name: "Web Development", slug: "web-development" },
  { name: "Mobile Apps", slug: "mobile-apps" },
  { name: "IoT", slug: "iot" },
  { name: "Arduino", slug: "arduino" },
  { name: "Robotics", slug: "robotics" },
  { name: "Data Science", slug: "data-science" },
  { name: "Computer Vision", slug: "computer-vision" },
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "Electronics", slug: "electronics" },
  { name: "UI / UX Design", slug: "ui-ux-design" },
] as const;

export const technologySuggestions = [
  "Python",
  "Next.js",
  "React",
  "TypeScript",
  "Flutter",
  "Node.js",
  "TensorFlow",
  "OpenCV",
  "Arduino",
  "ESP32",
] as const;

export type ProjectHelpRequestSummary = {
  budgetBdt: number | null;
  categoryName: string;
  createdAt: string;
  deadline: string | null;
  description: string;
  id: string;
  status: Database["public"]["Enums"]["request_status"];
  technologyTags: string[];
  title: string;
};

export type SellerServiceMatch = {
  categoryName: string;
  description: string;
  id: string;
  reasons: string[];
  score: number;
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  startingPriceBdt: number;
  technologyTags: string[];
  title: string;
};

export const helpRequestStatusLabels: Record<
  ProjectHelpRequestSummary["status"],
  string
> = {
  open: "Open",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};
