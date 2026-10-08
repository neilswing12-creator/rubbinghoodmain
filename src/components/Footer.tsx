import Link from "next/link";
import { brand, footerGroups, legalLinks } from "@/content/site";
import { AnimatedDivider } from "@/components/ui/AnimatedDivider";
import { Wordmark } from "@/components/ui/Logo";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "text-[14px] text-mute transition-colors duration-300 hover:text-fog";
  return href.startsWith("mailto:") ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden" id="footer">
      <AnimatedDivider />

      <div className="mx-auto max-w-[1400px] px-6 pb-8 pt-16 md:px-10 md:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="RobOnHood — home" className="text-fog">
              <Wordmark />
            </Link>
            <p className="mt-6 max-w-xs text-[14px] leading-[1.7] text-mute">
            One live surface for AI analysis, market signals, and trading.
            </p>
            <p className="mt-8 inline-flex items-center gap-2.5 border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              <span className="h-1.5 w-1.5 bg-signal" aria-hidden="true" />
              All systems operational
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:col-span-8">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-fog/80">
                  {group.title}
                </h2>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 flex flex-col-reverse gap-6 border-t border-white/10 pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-mute md:flex-row md:items-center md:justify-between">
          <p>© 2026 {brand.name}</p>
          <ul className="flex gap-6">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Oversized, cropped wordmark */}
      <div
  aria-hidden="true"
  className="pointer-events-none h-[clamp(5rem,20vw,15rem)] select-none overflow-hidden"
>
  <p className="bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center text-[clamp(4.5rem,18vw,24rem)] font-medium leading-[0.8] tracking-[-0.06em] text-transparent">
    {brand.name}
  </p>
</div>
    </footer>
  );
}
