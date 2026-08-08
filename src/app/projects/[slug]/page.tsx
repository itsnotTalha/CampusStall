import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  CircleCheck,
  Code2,
  Info,
  Layers3,
} from "lucide-react";

import { PublicFooter } from "@/components/landing/public-footer";
import { PublicHeader } from "@/components/landing/public-header";
import { PageContainer } from "@/components/layout/page-container";
import { ProjectCard } from "@/components/marketplace/project-card";
import { RatingDisplay } from "@/components/marketplace/rating-display";
import { PreviewExperience } from "@/components/project-preview/preview-experience";
import { DeliverablesGrid } from "@/components/project-details/deliverables-grid";
import { DetailSection } from "@/components/project-details/detail-section";
import { PurchasePanel } from "@/components/project-details/purchase-panel";
import { ReviewsList } from "@/components/project-details/reviews-list";
import { SellerSummary } from "@/components/project-details/seller-summary";
import { getProjectDetail } from "@/data/project-details";
import { marketplaceProjects } from "@/data/marketplace";
import { formatBdt } from "@/lib/format";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const sectionLinks = [
  ["Overview", "overview"],
  ["Features", "features"],
  ["Technology", "technology"],
  ["How it works", "how-it-works"],
  ["Package", "what-you-receive"],
  ["Requirements", "requirements"],
  ["Installation", "installation"],
  ["Seller", "seller"],
  ["Reviews", "reviews"],
] as const;

export function generateStaticParams() {
  return marketplaceProjects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = marketplaceProjects.find((item) => item.id === slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: `${project.summary} Preview this demo listing on CampusStall.`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = marketplaceProjects.find((item) => item.id === slug);

  if (!project) {
    notFound();
  }

  const detail = getProjectDetail(project);
  const similarProjects = [
    ...marketplaceProjects.filter(
      (item) => item.id !== project.id && item.category === project.category,
    ),
    ...marketplaceProjects.filter(
      (item) => item.id !== project.id && item.category !== project.category,
    ),
  ].slice(0, 3);

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />
      <main>
        <PageContainer className="py-5 sm:py-7">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 overflow-hidden text-xs text-muted-foreground"
          >
            <Link className="shrink-0 hover:text-foreground" href="/explore">
              Explore
            </Link>
            <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
            <Link
              className="shrink-0 hover:text-foreground"
              href={`/explore?category=${encodeURIComponent(project.category)}`}
            >
              {project.category}
            </Link>
            <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate text-foreground">{project.title}</span>
          </nav>

          <header className="mt-7 flex flex-col gap-6 border-b pb-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border bg-card px-2.5 py-1 text-[10px] font-semibold text-primary shadow-xs">
                  {project.category}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                  {project.difficulty}
                </span>
                {project.hasPreview && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                    Interactive preview
                  </span>
                )}
              </div>
              <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-[-0.045em] text-balance sm:text-4xl lg:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                {project.summary}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  by <span className="font-semibold text-foreground">{project.seller.name}</span>
                  {project.seller.verified && (
                    <BadgeCheck
                      aria-label="Verified seller"
                      className="size-4 fill-primary text-primary-foreground"
                    />
                  )}
                </span>
                <RatingDisplay
                  className="text-sm"
                  rating={project.rating}
                  reviewCount={project.reviewCount}
                />
                <span className="text-xs text-muted-foreground">
                  {project.department} · {project.difficulty}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span
                    className="rounded-md border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-xs"
                    key={technology}
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 lg:text-right">
              <p className="text-xs font-medium text-muted-foreground">
                Packages from
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">
                {formatBdt(project.price)}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Demo listing price in BDT
              </p>
            </div>
          </header>

          <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <PreviewExperience
              previewKind={detail.previewKind}
              projectTitle={project.title}
              screenshots={detail.screenshots}
            />
            <PurchasePanel
              basePrice={project.price}
              commercialLicenseAvailable={detail.commercialLicenseAvailable}
              projectId={project.id}
              projectTitle={project.title}
            />
          </div>

          <nav
            aria-label="Project details sections"
            className="mt-8 flex gap-1 overflow-x-auto rounded-xl border bg-card p-2 shadow-xs"
          >
            {sectionLinks.map(([label, id]) => (
              <a
                className="shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                href={`#${id}`}
                key={id}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <DetailSection className="lg:col-span-2" id="overview" title="Overview">
              <p className="max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base">
                {detail.overview}
              </p>
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-primary/15 bg-primary/5 p-4 text-sm leading-6">
                <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                <p>
                  This is a mock marketplace listing. Review the final seller
                  documentation, license, and deliverables before any future
                  purchase.
                </p>
              </div>
            </DetailSection>

            <DetailSection id="features" title="Features">
              <ul className="grid gap-3 sm:grid-cols-2">
                {detail.features.map((feature) => (
                  <li className="flex items-start gap-2.5 text-sm leading-6" key={feature}>
                    <CircleCheck
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-primary"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection id="technology" title="Technology Used">
              <div className="grid gap-3 sm:grid-cols-2">
                {project.technologies.map((technology, index) => (
                  <div
                    className="flex items-center gap-3 rounded-lg border bg-background p-3"
                    key={technology}
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {index === 0 ? (
                        <Code2 aria-hidden="true" className="size-4" />
                      ) : (
                        <Layers3 aria-hidden="true" className="size-4" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{technology}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        Included in the documented stack
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>

            <DetailSection
              className="lg:col-span-2"
              id="how-it-works"
              title="How It Works"
            >
              <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {detail.howItWorks.map((step, index) => (
                  <li className="rounded-lg border bg-background p-4" key={step}>
                    <span className="font-mono text-[10px] font-semibold text-primary">
                      STEP {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-3 text-sm leading-6">{step}</p>
                  </li>
                ))}
              </ol>
            </DetailSection>

            <DetailSection
              className="lg:col-span-2"
              description="Exact files vary by the package selected. This demo shows the complete package contents."
              id="what-you-receive"
              title="What You Receive"
            >
              <DeliverablesGrid deliverables={detail.deliverables} />
            </DetailSection>

            <DetailSection id="requirements" title="Requirements">
              <ul className="space-y-3">
                {detail.requirements.map((requirement) => (
                  <li className="flex items-start gap-2.5 text-sm leading-6" key={requirement}>
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-primary"
                    />
                    {requirement}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection id="installation" title="Installation">
              <ol className="space-y-3">
                {detail.installation.map((step, index) => (
                  <li className="flex items-start gap-3 text-sm leading-6" key={step}>
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-[10px] font-semibold">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </DetailSection>

            <DetailSection className="lg:col-span-2" id="seller" title="Seller">
              <SellerSummary project={project} supportDays={detail.supportDays} />
            </DetailSection>

            <DetailSection
              className="lg:col-span-2"
              description="Placeholder reviews demonstrate the future review presentation and are not real buyer claims."
              id="reviews"
              title="Reviews"
            >
              <ReviewsList reviews={detail.reviews} />
            </DetailSection>
          </div>

          <section className="mt-14 border-t pt-10" id="similar-projects">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">Keep exploring</p>
                <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight">
                  Similar Projects
                </h2>
              </div>
              <Link
                className="text-sm font-semibold text-primary hover:underline"
                href={`/explore?category=${encodeURIComponent(project.category)}`}
              >
                Explore {project.category}
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similarProjects.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </section>
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
}
