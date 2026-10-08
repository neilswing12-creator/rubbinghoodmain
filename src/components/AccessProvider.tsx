"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";

type Mode = "start" | "login";
type Status = "idle" | "sending" | "done";

interface AccessContextValue {
  open: (mode?: Mode) => void;
}

const AccessContext = createContext<AccessContextValue>({ open: () => {} });

/** Open the Get Started / Log in dialog from anywhere. */
export const useAccess = () => useContext(AccessContext);

const copy: Record<Mode, { eyebrow: string; title: string; body: string; cta: string; done: string }> = {
  start: {
    eyebrow: "Get started",
    title: "Start building with RobOnHood.",
    body: "Enter your work email and we'll send you a link to set up your workspace.",
    cta: "Create workspace",
    done: "Check your inbox — your setup link is on its way.",
  },
  login: {
    eyebrow: "Log in",
    title: "Welcome back.",
    body: "Enter your work email and we'll send you a secure sign-in link.",
    cta: "Send sign-in link",
    done: "Check your inbox — your sign-in link is on its way.",
  },
};

/**
 * Provides a single accessible modal (native <dialog>) for all sign-up / log-in CTAs.
 * Focus trapping, Escape-to-close and inert background come free from showModal().
 *
 * The submit handler is a stub — wire it to your auth / waitlist endpoint.
 */
export function AccessProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<Mode>("start");
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  const open = useCallback((next: Mode = "start") => {
    setMode(next);
    setStatus("idle");
    dialogRef.current?.showModal();
  }, []);

  const close = () => dialogRef.current?.close();

  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) close();
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    // TODO: replace with a real request, e.g. await fetch("/api/access", { ... })
    window.setTimeout(() => setStatus("done"), 700);
  };

  const value = useMemo(() => ({ open }), [open]);
  const t = copy[mode];

  return (
    <AccessContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        onClick={onBackdropClick}
        aria-labelledby="access-title"
        className="m-auto w-[min(92vw,30rem)] max-w-none border border-white/15 bg-ink p-0 text-fog shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-7 md:p-9">
          <button
            type="button"
            onClick={close}
            aria-label="Close dialog"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center text-mute transition-colors hover:text-fog"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <LogoMark className="mb-8 h-6 w-6" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
            {t.eyebrow}
          </p>
          <h2
            id="access-title"
            className="mt-3 text-[28px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[34px]"
          >
            {t.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-mute">{t.body}</p>

          {status === "done" ? (
            <div role="status" className="mt-8 border border-signal/30 bg-signal/[0.06] p-4 text-[14px] text-fog">
              {t.done}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8">
              <label htmlFor="access-email" className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
                Work email
              </label>
              <input
                id="access-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-12 w-full border border-white/15 bg-transparent px-4 text-[15px] text-fog placeholder:text-mute/60 focus:border-signal/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-4 h-12 w-full bg-fog text-[15px] font-medium text-ink transition-[background-color,opacity] hover:bg-white disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : t.cta}
              </button>
            </form>
          )}

          <p className="mt-6 text-[13px] text-mute">
            {mode === "start" ? "Already have a workspace? " : "New to RobOnHood? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "start" ? "login" : "start");
                setStatus("idle");
              }}
              className="text-fog underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-fog"
            >
              {mode === "start" ? "Log in" : "Get started"}
            </button>
          </p>
        </div>
      </dialog>
    </AccessContext.Provider>
  );
}
