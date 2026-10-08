import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

/** Minimal shell for Privacy / Terms. Replace the body copy with your real policies. */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main" className="relative z-10 mx-auto max-w-3xl px-6 pb-32 pt-40 md:px-10">
        <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
          <span aria-hidden="true" className="h-px w-8 bg-signal/70" />
          Legal
        </p>
        <h1 className="text-[clamp(2.6rem,7vw,5rem)] font-medium leading-none tracking-[-0.045em]">
          {title}
        </h1>
        <div className="mt-12 space-y-6 text-[16px] leading-[1.8] text-mute">{children}</div>
      </main>
      <Footer />
    </>
  );
}
