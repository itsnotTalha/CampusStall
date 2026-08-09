"use client";

import { useEffect } from "react";

import { PageError } from "@/components/ui/page-error";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <PageError reset={reset} />;
}
