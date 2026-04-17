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
        "mx-auto grid min-h-screen w-full max-w-7xl grid-rows-[20px_1fr_20px] gap-8 px-4 pb-20 font-[family-name:var(--font-geist-sans)] sm:px-8 md:px-16 lg:px-32",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default PageContainer;
