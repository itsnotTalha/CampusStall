import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { HeroMarketplacePreview } from "@/components/landing/hero-marketplace-preview";
import { PublicFooter } from "@/components/landing/public-footer";
import { PublicHeader } from "@/components/landing/public-header";
import { SectionHeading } from "@/components/landing/section-heading";
import { PageContainer } from "@/components/layout/page-container";
import { CategoryCard } from "@/components/marketplace/category-card";
import { ProjectCard } from "@/components/marketplace/project-card";
import { ServiceCard } from "@/components/marketplace/service-card";
import { buttonVariants } from "@/components/ui/button";
import {
  digitalPerks,
  featuredProjects,
  heroHighlights,
  howItWorksSteps,
  popularServices,
  projectCategories,
  sellerBenefits,
  trustPrinciples,
} from "@/data/landing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Student projects, skills and resources",
  description:
    "Explore ready-made student projects, hire student talent, find practical project support, and discover legitimate digital perks.",
};

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />
      <main>
        <section className="relative overflow-hidden border-b bg-card">
          <div className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-primary/20" />
          <PageContainer className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-28">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-semibold text-primary shadow-xs">
                <Sparkles aria-hidden="true" className="size-3.5" />
                Built on campus. Made for students.
              </div>
              <h1 className="mt-6 max-w-3xl font-heading text-4xl leading-[1.08] font-semibold tracking-[-0.055em] text-balance sm:text-5xl lg:text-[3.75rem]">
                Projects, skills &amp; student resources — all in one place.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground text-pretty sm:text-lg sm:leading-8">
                Buy ready-made projects, hire skilled student talent, get
                practical project support, and discover legitimate student perks
                through one focused marketplace.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/explore"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 gap-2 px-5 text-sm shadow-sm",
                  )}
                >
                  Explore Marketplace
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  href="/sell"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "h-11 px-5 text-sm shadow-xs",
                  )}
                >
                  Sell Your Project
                </Link>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {heroHighlights.map((highlight) => (
                  <span
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                    key={highlight}
                  >
                    <Check aria-hidden="true" className="size-4 text-primary" />
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
            <HeroMarketplacePreview />
          </PageContainer>
        </section>

        <section className="scroll-mt-20" id="categories">
          <PageContainer className="py-16 sm:py-20 lg:py-24">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Browse by category"
                title="Start with what you want to build"
                description="Explore practical project areas across software, data, electronics, and emerging technology."
              />
              <Link
                className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary"
                href="/explore"
              >
                View all categories
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {projectCategories.map((category) => (
                <CategoryCard category={category} key={category.slug} />
              ))}
            </div>
          </PageContainer>
        </section>

        <section className="scroll-mt-20 border-y bg-card" id="projects">
          <PageContainer className="py-16 sm:py-20 lg:py-24">
            <SectionHeading
              eyebrow="Ready-made projects"
              title="Thoughtful starting points for student builders"
              description="Preview demo listings designed to show how owned or properly licensed projects can be presented with clear deliverables and documentation."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 gap-2 px-4",
                )}
                href="/projects"
              >
                Explore ready-made projects
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </PageContainer>
        </section>

        <section className="scroll-mt-20" id="services">
          <PageContainer className="py-16 sm:py-20 lg:py-24">
            <SectionHeading
              eyebrow="Popular services"
              title="Get practical help from student talent"
              description="Find focused development, design, tutoring, debugging, consultation, and customization support."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {popularServices.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </PageContainer>
        </section>

        <section
          className="scroll-mt-20 border-y bg-card"
          id="how-it-works"
        >
          <PageContainer className="py-16 sm:py-20 lg:py-24">
            <SectionHeading
              align="center"
              eyebrow="Simple by design"
              title="How CampusStall works"
              description="A clear path from discovering the right resource to using it responsibly in your own learning and work."
            />
            <div className="relative mt-12 grid gap-5 md:grid-cols-3">
              <div className="absolute top-10 right-[16%] left-[16%] hidden border-t border-dashed md:block" />
              {howItWorksSteps.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    className="relative rounded-xl border bg-background p-6 shadow-xs"
                    key={item.step}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-xl border bg-card text-primary shadow-xs">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <span className="font-mono text-xs font-semibold text-muted-foreground">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="mt-8 font-heading text-lg font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer className="py-16 sm:py-20 lg:py-24">
            <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground shadow-lg sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <div className="absolute -top-20 -right-20 size-64 rounded-full border border-primary-foreground/10" />
              <div className="absolute -right-8 -bottom-28 size-56 rounded-full border border-primary-foreground/10" />
              <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold text-primary-foreground/75">
                    Created something useful?
                  </p>
                  <h2 className="mt-2 font-heading text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
                    Give your student project a life beyond the semester.
                  </h2>
                  <p className="mt-4 max-w-xl leading-7 text-primary-foreground/75">
                    Package work you own, document it clearly, and help another
                    student learn or build faster.
                  </p>
                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {sellerBenefits.map((benefit) => (
                      <span
                        className="flex items-center gap-2 text-sm text-primary-foreground/85"
                        key={benefit}
                      >
                        <BadgeCheck aria-hidden="true" className="size-4" />
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 bg-primary-foreground px-5 text-primary shadow-sm hover:bg-primary-foreground/90",
                  )}
                  href="/sell"
                >
                  Start selling
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section className="scroll-mt-20 border-y bg-card" id="perks">
          <PageContainer className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-24">
            <SectionHeading
              eyebrow="Digital perks"
              title="Student benefits worth knowing about"
              description="Discover legitimate software discounts, education plans, resources, and offers—without password or account sharing. Availability and eligibility can vary."
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {digitalPerks.map((perk) => {
                const Icon = perk.icon;

                return (
                  <article
                    className="rounded-xl border bg-background p-5 shadow-xs"
                    key={perk.title}
                  >
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <h3 className="mt-5 font-heading font-semibold">
                      {perk.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {perk.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </PageContainer>
        </section>

        <section className="scroll-mt-20" id="trust">
          <PageContainer className="py-16 sm:py-20 lg:py-24">
            <div className="rounded-2xl border bg-card p-6 shadow-xs sm:p-10 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck aria-hidden="true" className="size-5" />
                  </span>
                  <h2 className="mt-5 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                    Built around trust and academic integrity
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                    CampusStall supports learning, legitimate reuse, mentoring,
                    debugging, and licensed project assets—not shortcuts that
                    misrepresent someone else&apos;s work as your own.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {trustPrinciples.map((principle) => {
                    const Icon = principle.icon;

                    return (
                      <div
                        className="rounded-xl border bg-background p-5"
                        key={principle.title}
                      >
                        <Icon
                          aria-hidden="true"
                          className="size-5 text-primary"
                        />
                        <h3 className="mt-4 text-sm font-semibold">
                          {principle.title}
                        </h3>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                          {principle.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </PageContainer>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
