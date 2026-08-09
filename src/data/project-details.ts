import type { MarketplaceProject } from "@/data/marketplace";

export type ProjectPreviewKind =
  | "machine-learning"
  | "dashboard"
  | "generic";

export type ScreenshotLayout = "overview" | "analytics" | "workspace";

export type ProjectScreenshot = {
  id: string;
  title: string;
  description: string;
  layout: ScreenshotLayout;
};

export type ProjectPreviewMedia = {
  altText: string;
  id: string;
  kind: "cover" | "screenshot";
  title: string;
  url: string;
};

export type DeliverableName =
  | "Source Code"
  | "Database"
  | "Dataset"
  | "Trained Model"
  | "Documentation"
  | "Presentation"
  | "Installation Guide"
  | "Demo"
  | "Seller Support";

export type ProjectReview = {
  id: string;
  author: string;
  context: string;
  rating: number;
  comment: string;
};

export type ProjectDetail = {
  overview: string;
  features: readonly string[];
  howItWorks: readonly string[];
  deliverables: readonly DeliverableName[];
  requirements: readonly string[];
  installation: readonly string[];
  previewKind: ProjectPreviewKind;
  screenshots: readonly ProjectScreenshot[];
  commercialLicenseAvailable: boolean;
  supportDays: number;
  reviews: readonly ProjectReview[];
};

export type PackageOption = {
  id: "source" | "complete" | "support";
  name: string;
  description: string;
  multiplier: number;
  highlights: readonly string[];
};

export type LicenseOption = {
  id: "personal" | "single" | "commercial";
  name: string;
  description: string;
  multiplier: number;
};

export const packageOptions: readonly PackageOption[] = [
  {
    id: "source",
    name: "Source Only",
    description: "The core project files for independent setup.",
    multiplier: 1,
    highlights: ["Source code", "Readme", "Personal license"],
  },
  {
    id: "complete",
    name: "Complete Package",
    description: "Project files plus supporting assets and documentation.",
    multiplier: 1.35,
    highlights: ["All project assets", "Documentation", "Installation guide"],
  },
  {
    id: "support",
    name: "Complete + Support",
    description: "The full package with limited setup assistance.",
    multiplier: 1.7,
    highlights: ["Complete package", "Setup support", "Clarification session"],
  },
];

export const licenseOptions: readonly LicenseOption[] = [
  {
    id: "personal",
    name: "Learning/Personal License",
    description: "For personal learning, practice, and portfolio exploration.",
    multiplier: 1,
  },
  {
    id: "single",
    name: "Single Project License",
    description: "Use and adapt within one declared non-commercial project.",
    multiplier: 1.2,
  },
  {
    id: "commercial",
    name: "Commercial License",
    description: "Use within one commercial product, subject to listed terms.",
    multiplier: 1.8,
  },
];

const projectOverrides: Record<string, Partial<ProjectDetail>> = {
  "ai-plant-disease-detection": {
    overview:
      "A structured computer-vision project that classifies common plant leaf conditions from images. It includes a reproducible training workflow, prepared sample data, evaluation outputs, and a lightweight interface for simulated inference demonstrations.",
    features: [
      "Multi-class plant leaf image classification",
      "Reusable preprocessing and augmentation pipeline",
      "Model training and evaluation notebooks",
      "Confidence-ranked prediction output",
      "Sample dataset structure and labeling guide",
      "Simple inference interface for demonstrations",
    ],
    howItWorks: [
      "Leaf images are resized, normalized, and passed through the preprocessing pipeline.",
      "The trained image-classification model evaluates visual patterns across supported classes.",
      "The inference layer returns the predicted condition and a confidence score.",
      "Evaluation notebooks summarize model behavior and areas for further improvement.",
    ],
    deliverables: [
      "Source Code",
      "Dataset",
      "Trained Model",
      "Documentation",
      "Presentation",
      "Installation Guide",
      "Demo",
      "Seller Support",
    ],
    requirements: [
      "Python 3.11 or a compatible environment",
      "At least 8 GB RAM for local experimentation",
      "Jupyter Notebook or a compatible editor",
      "Basic understanding of Python and machine learning",
    ],
    installation: [
      "Create a virtual Python environment.",
      "Install the pinned dependencies from requirements.txt.",
      "Place the included sample dataset in the documented directory.",
      "Run the inference application or open the training notebook.",
    ],
    previewKind: "machine-learning",
    screenshots: [
      {
        id: "ml-inference",
        title: "Inference workspace",
        description: "Sample selection and prediction confidence output.",
        layout: "workspace",
      },
      {
        id: "ml-evaluation",
        title: "Model evaluation",
        description: "Class distribution and evaluation summary.",
        layout: "analytics",
      },
      {
        id: "ml-overview",
        title: "Project overview",
        description: "Dataset, model, and run-status summary.",
        layout: "overview",
      },
    ],
    commercialLicenseAvailable: false,
    supportDays: 14,
  },
  "ecommerce-analytics-dashboard": {
    overview:
      "A polished commerce operations dashboard starter for managing catalog activity, orders, customers, and sales reporting. Its modular Next.js structure is prepared for customization and later backend integration.",
    features: [
      "Responsive operations dashboard",
      "Order and fulfillment workflow views",
      "Product catalog management interface",
      "Sales and customer overview charts",
      "Reusable table, filter, and status components",
      "Light and dark-ready design tokens",
    ],
    howItWorks: [
      "Dashboard modules read typed demo records through a dedicated data layer.",
      "Filters and date controls update the visible commerce summaries.",
      "Reusable table components present orders, products, and customer data.",
      "The architecture can later connect to a secure commerce API or database.",
    ],
    deliverables: [
      "Source Code",
      "Database",
      "Documentation",
      "Presentation",
      "Installation Guide",
      "Demo",
      "Seller Support",
    ],
    requirements: [
      "Node.js 22 or newer",
      "npm, pnpm, or another supported package manager",
      "A modern web browser",
      "Basic familiarity with React and Next.js",
    ],
    installation: [
      "Install the project dependencies.",
      "Copy the provided example environment file for local configuration.",
      "Start the Next.js development server.",
      "Replace demo records through the documented data adapter when ready.",
    ],
    previewKind: "dashboard",
    screenshots: [
      {
        id: "commerce-overview",
        title: "Commerce overview",
        description: "Sales, orders, and customer summary.",
        layout: "overview",
      },
      {
        id: "commerce-analytics",
        title: "Sales analytics",
        description: "Revenue trends and channel comparison.",
        layout: "analytics",
      },
      {
        id: "commerce-orders",
        title: "Order workspace",
        description: "Searchable order and fulfillment view.",
        layout: "workspace",
      },
    ],
    commercialLicenseAvailable: true,
    supportDays: 21,
  },
};

export function getProjectDetail(project: MarketplaceProject): ProjectDetail {
  const override = projectOverrides[project.id];
  const commercialByDefault = ["Web Development", "Mobile Apps"].includes(
    project.category,
  );

  const defaults: ProjectDetail = {
    overview: `${project.summary} The package is organized for review, learning, responsible customization, and continued development.`,
    features: [
      "Organized and readable project structure",
      "Documented setup and configuration flow",
      "Reusable core modules",
      "Demo records or sample inputs",
      "Clear extension points for customization",
    ],
    howItWorks: [
      "Configure the included environment and project dependencies.",
      "Run the documented application or hardware workflow.",
      "Review the sample inputs and expected outputs.",
      "Customize modules responsibly for your own learning or project needs.",
    ],
    deliverables: [
      "Source Code",
      "Documentation",
      "Installation Guide",
      "Demo",
      "Seller Support",
    ],
    requirements: [
      `A development environment suitable for ${project.technologies[0]}`,
      "The tools listed in the installation guide",
      `Basic familiarity with ${project.category}`,
      "Any required hardware or third-party accounts listed by the seller",
    ],
    installation: [
      "Review the included requirements and folder structure.",
      "Install the documented dependencies or prepare the required hardware.",
      "Load the provided sample configuration.",
      "Run the included demo and verify the expected output.",
    ],
    previewKind: "generic",
    screenshots: [
      {
        id: `${project.id}-overview`,
        title: "Project overview",
        description: "Core modules and current status.",
        layout: "overview",
      },
      {
        id: `${project.id}-workspace`,
        title: "Main workspace",
        description: "Primary workflow and project controls.",
        layout: "workspace",
      },
      {
        id: `${project.id}-results`,
        title: "Results view",
        description: "Example output and project summary.",
        layout: "analytics",
      },
    ],
    commercialLicenseAvailable: commercialByDefault,
    supportDays: 7,
    reviews: createDemoReviews(project),
  };

  return {
    ...defaults,
    ...override,
    reviews: override?.reviews ?? defaults.reviews,
  };
}

function createDemoReviews(project: MarketplaceProject): ProjectReview[] {
  return [
    {
      id: `${project.id}-review-1`,
      author: "Demo reviewer A",
      context: "Student buyer preview",
      rating: Math.min(5, project.rating + 0.1),
      comment:
        "The folder structure and setup notes were clear, which made the project straightforward to explore and adapt.",
    },
    {
      id: `${project.id}-review-2`,
      author: "Demo reviewer B",
      context: "Learning license preview",
      rating: project.rating,
      comment:
        "The documentation explains the main workflow well and highlights the areas intended for customization.",
    },
    {
      id: `${project.id}-review-3`,
      author: "Demo reviewer C",
      context: "Package quality preview",
      rating: Math.max(4, project.rating - 0.2),
      comment:
        "A useful starting point with sensible examples. The installation guide answered the key setup questions.",
    },
  ];
}
