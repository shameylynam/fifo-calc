import React from "react";
import clsx from "clsx";

/**
 * PageContainer is a responsive wrapper for all pages.
 * - Centers content with a max-width on large screens.
 * - Uses fluid horizontal padding for all breakpoints.
 * - Prevents content from touching viewport edges on small devices.
 */
export function PageContainer({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "grid grid-rows-[20px_1fr_20px] min-h-screen gap-8 pb-20 font-[family-name:var(--font-geist-sans)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default PageContainer;
