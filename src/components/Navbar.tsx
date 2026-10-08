"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/content/site";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { useAccess } from "@/components/AccessProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Wordmark } from "@/components/ui/Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open: openAccess } = useAccess();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    // Unlock synchronously so the hash-scroll that follows the click works.
    document.documentElement.style.overflow = "";
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5"
      >
        <div
          className={cn(
            "mx-auto flex h-14 max-w-[1400px] items-center justify-between border px-4 transition-[background-color,border-color,backdrop-filter] duration-500 md:px-6",
            scrolled || menuOpen
              ? "border-white/10 bg-ink/60 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <Link href="/" aria-label="RobOnHood — home" className="text-fog">
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-mute transition-colors duration-300 hover:text-fog"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <button
              type="button"
              onClick={() => openAccess("login")}
              className="text-[14px] text-mute transition-colors duration-300 hover:text-fog"
            >
              Log in
            </button>
            <MagneticButton
  size="sm"
  onClick={() => {
    window.open("https://app.robonhood.fun", "_blank", "noopener,noreferrer");
  }}
>
  Launch App
</MagneticButton>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-fog md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink/95 px-6 pb-8 pt-28 backdrop-blur-2xl md:hidden"
          >
            <nav aria-label="Mobile">
              <ul>
                {navLinks.map((link, i) => (
                  <li key={link.label} className="overflow-hidden border-b border-white/10">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.08 + i * 0.07 }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="flex items-baseline justify-between py-5 text-[40px] font-medium leading-none tracking-[-0.04em] text-fog"
                      >
                        {link.label}
                        <span className="font-mono text-[11px] tracking-[0.2em] text-mute">
                          0{i + 1}
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
              className="grid grid-cols-2 gap-3"
            >
              <MagneticButton
                variant="ghost"
                onClick={() => {
                  closeMenu();
                  openAccess("login");
                }}
              >
                Log in
              </MagneticButton>
              <MagneticButton
  onClick={() => {
    closeMenu();
    window.open("https://app.robonhood.fun", "_blank", "noopener,noreferrer");
  }}
>
  Launch App
</MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
