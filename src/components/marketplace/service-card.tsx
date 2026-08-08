import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { PopularService } from "@/data/landing";

type ServiceCardProps = {
  service: PopularService;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="h-full shadow-xs transition-all group-hover:-translate-y-0.5 group-hover:ring-primary/25 group-hover:shadow-md">
        <CardHeader className="gap-3 px-5">
          <span className="flex size-10 items-center justify-center rounded-lg border bg-muted/60 text-foreground shadow-xs">
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-xs font-semibold text-primary">
              {service.category}
            </p>
            <h3 className="mt-1 font-heading text-base leading-6 font-semibold tracking-[-0.015em]">
              {service.title}
            </h3>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col px-5">
          <p className="text-sm leading-6 text-muted-foreground">
            {service.summary}
          </p>
          <div className="mt-5 flex items-end justify-between gap-4 border-t pt-4">
            <div>
              <p className="font-semibold">{service.startingPrice}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock3 aria-hidden="true" className="size-3.5" />
                {service.delivery}
              </p>
            </div>
            <ArrowRight
              aria-hidden="true"
              className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
