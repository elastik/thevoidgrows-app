interface ConnectingSkeletonProps {
  variant?: 'dashboard' | 'form' | 'sterilize';
}

export function ConnectingSkeleton({ variant = 'dashboard' }: ConnectingSkeletonProps) {
  if (variant === 'dashboard') {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="h-24 animate-shimmer rounded-xl" />
          <div className="h-24 animate-shimmer rounded-xl" />
          <div className="h-24 animate-shimmer rounded-xl" />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Connecting to dome...
        </p>
      </div>
    );
  }

  if (variant === 'sterilize') {
    return (
      <div className="p-4 space-y-6">
        <div className="h-6 w-48 animate-shimmer rounded" />
        <div className="h-24 animate-shimmer rounded-xl" />
        <div className="h-40 animate-shimmer rounded-xl" />
      </div>
    );
  }

  // form variant (settings)
  return (
    <div className="p-4 space-y-6">
      <div className="h-6 w-48 animate-shimmer rounded" />
      <div className="space-y-4">
        <div className="h-16 animate-shimmer rounded-xl" />
        <div className="h-16 animate-shimmer rounded-xl" />
        <div className="h-16 animate-shimmer rounded-xl" />
      </div>
    </div>
  );
}
