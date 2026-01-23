"use client";

import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export function ChatContainerSkeleton() {
  return (
    <div className="flex-1 min-h-0 flex gap-4">
      {/* Sidebar Skeleton */}
      <Card className="hidden md:block w-72 shrink-0 p-3 space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="space-y-2 pt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-3">
              <Skeleton className="h-4 w-4 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
      {/* Chat Skeleton */}
      <Card className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center">
          <Skeleton className="h-20 w-20 rounded-full mb-6" />
          <Skeleton className="h-8 w-48 mb-3" />
          <Skeleton className="h-4 w-64 mb-8" />
          <div className="grid grid-cols-2 gap-2 max-w-md w-full">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-full" />
            ))}
          </div>
        </div>
        <div className="border-t pt-4 mt-4">
          <div className="flex gap-3">
            <Skeleton className="flex-1 h-12 rounded-xl" />
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      </Card>
    </div>
  );
}
