/**
 * All copy and data lives here, separate from presentation.
 * Swap this file to re-skin the site for a different product.
 */

export const brand = {
  name: "RobOnHood",
  salesEmail: "sales@robonhood.fun",
  contactEmail: "hello@robonhood.fun",
} as const;

export const navLinks = [
  { label: "Product", href: "/#product" },
  { label: "Solutions", href: "/#system" },
  { label: "Resources", href: "/#proof" },
  { label: "More", href: "/#get-started" },
] as const;

export const hero = {
  eyebrow: "Your AI trading intelligence",
  headline: ["Analyze with AI.", "Trade with confidence."],
  body: "RobOnHood combines AI-powered token analysis with a live 3D trading environment — helping you understand what’s happening on-chain before you decide when to trade.",
  primary: "Launch RobOnHood",
  secondary: "See How It Works",
  meta: ["AI Powered", "3D Market Intelligence", "On-Chain Analysis"],
} as const;

export const statement = {
  label: "Why RobOnHood",
  lines: ["Stop chasing signals.", "Let AI find them."],
  body: "RobOnHood combines AI-powered token analysis with a live 3D trading experience, giving you a clearer view of liquidity, activity, momentum, and risk before you make a trade.",
} as const;

export type FeatureVisual = "connected" | "intelligence" | "workflow";

export interface Feature {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  specs: readonly string[];
  visual: FeatureVisual;
}

export const features: readonly Feature[] = [
  {
    id: "connected",
    number: "01",
    category: "Token Discovery",
    title: "Find what’s moving.",
    description:
      "Explore tokens and on-chain activity through a live market surface. RobOnHood brings liquidity, volume, transactions and market signals together so you can quickly identify tokens worth investigating.",
    specs: [
      "Live token discovery",
      "On-chain market data",
      "Liquidity & volume signals",
    ],
    visual: "connected",
  },
  {
    id: "intelligence",
    number: "02",
    category: "AI Token Intelligence",
    title: "Let AI do the analysis.",
    description:
      "RobOnHood analyzes tokens using on-chain data and market signals, turning complex activity into a clear AI-generated assessment before you decide whether to trade.",
    specs: [
      "AI-powered token analysis",
      "Risk & momentum signals",
      "Real-time market intelligence",
    ],
    visual: "intelligence",
  },
  {
    id: "workflow",
    number: "03",
    category: "AI-Powered Trading",
    title: "From analysis to trade.",
    description:
      "Once you understand the signal, move from analysis to execution. RobOnHood connects AI insights directly to the trading experience so you can act without leaving the platform.",
    specs: [
      "Integrated token trading",
      "AI-informed decisions",
      "Fast trade execution",
    ],
    visual: "workflow",
  },
] as const;

export const system = {
  label: "How it works",
  lines: ["One AI.", "Every signal in orbit."],
  body: "RobOnHood puts AI at the center of your trading experience, connecting token discovery, liquidity, volume, holders and on-chain activity into one live 3D environment. Explore the network, inspect a token, and let the AI turn the signal into an actionable trade.",
} as const;

export interface NetworkNode {
  id: string;
  label: string;
  status: "nominal" | "degraded";
  latency: string;
  detail: string;
}

export const networkNodes: readonly NetworkNode[] = [
  {
    id: "scanner",
    label: "SCANNER",
    status: "nominal",
    latency: "12 ms",
    detail: "Scanning new tokens and on-chain activity",
  },
  {
    id: "liquidity",
    label: "LIQUIDITY",
    status: "nominal",
    latency: "18 ms",
    detail: "Tracking liquidity depth, pools and flow",
  },
  {
    id: "volume",
    label: "VOLUME",
    status: "nominal",
    latency: "21 ms",
    detail: "Real-time trading volume and transaction flow",
  },
  {
    id: "holders",
    label: "HOLDERS",
    status: "nominal",
    latency: "16 ms",
    detail: "Analyzing holder distribution and wallet activity",
  },
  {
    id: "ai",
    label: "AI CORE",
    status: "nominal",
    latency: "34 ms",
    detail: "Evaluating token signals, momentum and risk",
  },
  {
    id: "risk",
    label: "RISK",
    status: "nominal",
    latency: "27 ms",
    detail: "Contract, liquidity and market risk assessment",
  },
  {
    id: "signal",
    label: "SIGNAL",
    status: "nominal",
    latency: "19 ms",
    detail: "AI-generated token assessment and trade signal",
  },
  {
    id: "trade",
    label: "TRADE",
    status: "nominal",
    latency: "11 ms",
    detail: "Execute trades directly from RobOnHood",
  },
] as const;

export interface ActivityItem {
  tag: string;
  text: string;
  level: "ok" | "warn" | "info";
}

export const activity: readonly ActivityItem[] = [
  { tag: "launch", text: "RobOnHood token launched on Robinhood Chain", level: "info" },
  { tag: "liquidity", text: "Liquidity pool initialized for $ROB", level: "ok" },
  { tag: "volume", text: "24h trading volume continues to climb", level: "info" },
  { tag: "signal", text: "Strong buying activity detected across the market", level: "ok" },
  { tag: "holders", text: "New holders joining the RobOnHood community", level: "info" },
  { tag: "momentum", text: "$ROB momentum building across the market", level: "ok" },
  { tag: "alert", text: "Whale activity detected in the $ROB liquidity pool", level: "warn" },
  { tag: "market", text: "RobOnHood trading activity remains highly active", level: "info" },
] as const;

export const regions = [
  { name: "us-east", load: 72 },
  { name: "us-west", load: 54 },
  { name: "eu-west", load: 81 },
  { name: "ap-south", load: 47 },
  { name: "ap-east", load: 63 },
] as const;

export const testimonial = {
  label: "Built for the next trade",
  quote:
    "Instead of jumping between charts, scanners and wallets, RobOnHood gives me the analysis in one place. The AI breaks down the token, shows me what matters, and lets me move from signal to trade.",
  name: "RobOnHood User",
  role: "Early Access Trader",
  company: "RobOnHood",
  logos: ["AI Analysis", "Live 3D", "On-Chain Data", "Token Intelligence", "Smart Trading", "RobOnHood"],
} as const;

export type Metric =
  | { kind: "count"; to: number; decimals: number; suffix: string; label: string }
  | { kind: "text"; text: string; label: string };

export const metrics: readonly Metric[] = [
  { kind: "count", to: 970, decimals: 0, suffix: "K+", label: "pools processed ON DEX" },
  { kind: "count", to: 99.99, decimals: 2, suffix: "%", label: "platform uptime" },
  { kind: "count", to: 4.2, decimals: 1, suffix: "x", label: "faster workflows" },
  { kind: "text", text: "24/7", label: "visibility" },
] as const;

export const finalCta = {
  headline: ["Ready to", "trade smarter?"],
  body: "Let AI analyze the market. See the signal in 3D. Make your next move with RobOnHood.",
  primary: "Launch RobOnHood",
  secondary: "Explore AI",
} as const;

export const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "AI Analysis", href: "/#product" },
      { label: "3D Market", href: "/#system" },
      { label: "Trading", href: "/#product" },
      { label: "Get Started", href: "https://app.robonhood.fun" },
    ],
  },
  {
    title: "Intelligence",
    links: [
      { label: "Token Scanner", href: "/#system" },
      { label: "AI Signals", href: "/#product" },
      { label: "Market Analysis", href: "/#system" },
      { label: "Risk Analysis", href: "/#system" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Community", href: "/#proof" },
      { label: "Documentation", href: `mailto:${brand.contactEmail}?subject=Documentation` },
      { label: "Changelog", href: `mailto:${brand.contactEmail}?subject=Changelog` },
      { label: "Status", href: `mailto:${brand.contactEmail}?subject=Status` },
    ],
  },
  {
    title: "RobOnHood",
    links: [
      { label: "About", href: `mailto:${brand.contactEmail}?subject=About` },
      { label: "Careers", href: `mailto:${brand.contactEmail}?subject=Careers` },
      { label: "Press", href: `mailto:${brand.contactEmail}?subject=Press` },
      { label: "Contact", href: `mailto:${brand.contactEmail}` },
    ],
  },
] as const;

export const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: `mailto:${brand.contactEmail}` },
] as const;
