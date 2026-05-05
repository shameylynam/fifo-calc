"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";

type AiOverviewProps = {
  text: string;
  isLoading: boolean;
  error: string | null;
};

export function AiOverview({ text, isLoading, error }: AiOverviewProps) {
  if (!isLoading && !text && !error) return null;

  return (
    <Card className="p-6 space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold">AI Overview</h2>
        {isLoading && (
          <span className="text-xs text-muted-foreground animate-pulse">
            Generating…
          </span>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {text && (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {text}
        </p>
      )}
    </Card>
  );
}
