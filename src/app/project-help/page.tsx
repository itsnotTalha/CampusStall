import type { Metadata } from "next";
import { BadgeCheck, GitBranch, ShieldCheck, Sparkles } from "lucide-react";

import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { PublicFooter } from "@/components/landing/public-footer";
import { PublicHeader } from "@/components/landing/public-header";
import { HelpRequestList } from "@/components/project-help/help-request-list";
import { ProjectHelpForm } from "@/components/project-help/project-help-form";
import { SellerMatchCard } from "@/components/project-help/seller-match-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/lib/auth/session";
import { databaseIdPattern } from "@/lib/database-id";
import { getProjectHelpPageData } from "@/lib/project-help/queries";

export const metadata: Metadata = {
  title: "Project Help",
  description:
    "Request legitimate mentoring, debugging, consultation, and project support from student sellers on CampusStall.",
};

export default async function ProjectHelpPage({
  searchParams,
}: {
  searchParams: Promise<{
    request?: string | string[];
    submitted?: string | string[];
  }>;
}) {
  const [auth, query] = await Promise.all([getAuthContext(), searchParams]);
  const rawRequestId = Array.isArray(query.request)
    ? query.request[0]
    : query.request;
  const requestId =
    rawRequestId && databaseIdPattern.test(rawRequestId)
      ? rawRequestId
      : undefined;
  const submittedValue = Array.isArray(query.submitted)
    ? query.submitted[0]
    : query.submitted;
  const wasJustSubmitted = submittedValue === "1";
  const pageData = auth
    ? await getProjectHelpPageData(auth.userId, requestId)
    : { currentRequest: null, matches: [], recentRequests: [] };
  const minimumDeadline = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader variant="compact" />
      <main>
        <section className="relative isolate overflow-hidden border-b">
          <div className="pointer-events-none absolute -top-48 left-[12%] -z-10 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="mx-auto grid w-full max-w-[90rem] items-start gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(30rem,1.1fr)] lg:px-8 lg:py-14">
            <div className="pt-2 lg:sticky lg:top-24">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Project Help
              </p>
              <h1 className="mt-3 max-w-xl font-heading text-3xl leading-tight font-semibold tracking-[-0.045em] sm:text-4xl">
                Get focused help from student specialists
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                Describe your problem once. CampusStall compares its category and
                technology tags with published seller services—no AI API required.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <HelpPrinciple
                  icon={GitBranch}
                  text="Deterministic category and technology matching"
                />
                <HelpPrinciple
                  icon={BadgeCheck}
                  text="Recommendations use published seller services"
                />
                <HelpPrinciple
                  icon={ShieldCheck}
                  text="Learning, mentoring, and legitimate support only"
                />
              </div>
            </div>

            <Card className="shadow-lg shadow-foreground/5" variant="glass">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg font-semibold">I Need Help</CardTitle>
                <p className="text-xs leading-5 text-muted-foreground">
                  Clear scope and relevant tags produce better seller matches.
                </p>
              </CardHeader>
              <CardContent>
                <ProjectHelpForm
                  isAuthenticated={Boolean(auth)}
                  minimumDeadline={minimumDeadline}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {pageData.currentRequest && (
          <section
            className="mx-auto w-full max-w-[90rem] scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8"
            id="matches"
          >
            <div className="rounded-xl border border-primary/20 bg-primary/[0.055] p-4 text-sm">
              <span className="font-semibold">
                {wasJustSubmitted ? "Request submitted." : "Request selected."}
              </span>{" "}
              Matches below are ranked from category and technology overlap only.
            </div>
            <div className="mt-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-primary">Recommended matches</p>
                <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight">
                  Seller services for your request
                </h2>
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {pageData.matches.length} matched seller
                {pageData.matches.length === 1 ? "" : "s"}
              </p>
            </div>

            {pageData.matches.length > 0 ? (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {pageData.matches.map((match) => (
                  <SellerMatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed bg-card/55 px-6 text-center">
                <Sparkles aria-hidden="true" className="size-5 text-muted-foreground" />
                <h3 className="mt-4 text-base font-semibold">No close service match yet</h3>
                <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                  Your request is open. Matching will improve as sellers publish
                  services in this category and technology stack.
                </p>
              </div>
            )}
          </section>
        )}

        {pageData.recentRequests.length > 0 && (
          <section className="mx-auto w-full max-w-[90rem] px-4 pb-10 sm:px-6 lg:px-8">
            <DashboardPanel
              description="Requests created from your account."
              title="Your recent help requests"
            >
              <HelpRequestList requests={pageData.recentRequests} />
            </DashboardPanel>
          </section>
        )}
      </main>
      <PublicFooter variant="compact" />
    </div>
  );
}

function HelpPrinciple({
  icon: Icon,
  text,
}: {
  icon: typeof GitBranch;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span>{text}</span>
    </div>
  );
}
