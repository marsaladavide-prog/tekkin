"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // relative import for wider compatibility
import { motion, AnimatePresence } from "framer-motion";
import TekkinSpotlight from "../components/TekkinSpotlight";
import {
  ShoppingBag,
  LogIn,
  UserPlus,
  Radio,
  Music2,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  PlayCircle,
  Newspaper,
  Crown,
  Github,
  X,
} from "lucide-react";

// --- Minimal inline UI primitives (no shadcn required) ---

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "outline" | "solid" };
const Button: React.FC<ButtonProps> = ({ className = "", variant = "solid", ...props }) => (
  <button
    {...props}
    className={
      `${variant === "outline" ? "border border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800" : "bg-[#43FFD2] text-black hover:bg-[#2fe8be]"} ` +
      `inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition ${className}`
    }
  />
);

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div {...props} className={`rounded-xl ${className}`} />
);
const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div {...props} className={`p-4 ${className}`} />
);
const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div {...props} className={`px-4 pb-4 ${className}`} />
);
const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", ...props }) => (
  <h4 {...props} className={`font-medium ${className}`} />
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`h-9 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm outline-none focus:ring-1 focus:ring-zinc-700 ${className}`}
  />
);

// Simple Dialog primitives
interface DialogRootProps { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }
const Dialog: React.FC<DialogRootProps> = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div className="absolute inset-0 grid place-items-center p-4">{children}</div>
    </div>
  );
};
const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div {...props} className={`w-full max-w-md rounded-xl border border-zinc-800 bg-[#121212] p-4 shadow-xl ${className}`} />
);
const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div {...props} className={`mb-2 ${className}`} />
);
const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", ...props }) => (
  <h3 {...props} className={`text-lg font-semibold ${className}`} />
);

// --- Theme ---
const brand = {
  bg: "bg-[#0b0b0b]",
  panel: "bg-[#121212]",
  border: "border-[#222]",
  text: "text-zinc-200",
};

// Expose NEXT_PUBLIC envs for diagnostics in client
const PUB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const PUB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

// --- Mock data ---
const news = [
  { id: 1, title: "Supported by Manda Moor at Elrow", body: "Project pack preview + set highlights.", date: "2025-09-28" },
  { id: 2, title: "Tekkin Radio – New Episode", body: "Minimal / Deep Tech showcase with guests.", date: "2025-09-25" },
  { id: 3, title: "New Sample Pack Drop", body: "Drums, bass loops, atmos & FX – underground flavor.", date: "2025-09-18" },
];

const packs = [
  {
    id: 1,
    slug: "show-me-your",
    name: "SHOW ME YOUR (Ableton Project)",
    price: 24.99,
    currency: "EUR",
    desc: "Complete Ableton project with arranged sections, mixbus, and stems. Kick, Bass, Tops, Perc, Vocals, FX are neatly labeled and color-coded.",
    tag: "NEW",
    image: "/products/show-me-your.png",
    features: [
      "Ableton Live project (.als)",
      "WAV 24‑bit 44.1 kHz stems",
      "Royalty‑free for released tracks",
      "Color‑coded minimal / deep‑tech racks",
      "CPU‑friendly (native first)",
    ],
  },
];

// --- Splash (semplice) ---
function Splash({ onDone }: { onDone: () => void }) {
  const [pixels] = useState(
    Array.from({ length: 64 }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.9,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
    }))
  );

  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`${brand.bg} ${"text-zinc-200"} fixed inset-0 grid place-items-center overflow-hidden`}>
      <div className="relative w-[320px] h-[320px]">
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-[2px]">
          {pixels.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: [1, 0.45, 1, 0],
                scale: [1, 1.04, 0.96, 1, 0.9],
                x: [0, 0, 0, p.x],
                y: [0, 0, 0, p.y],
              }}
              transition={{ duration: 1.8, delay: p.delay, ease: "easeInOut" }}
              className="bg-[#1f1f1f]"
            />
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, letterSpacing: 12 }}
          animate={{ opacity: 1, letterSpacing: 2, x: [0, -1, 1, -1, 0], y: [0, 1, -1, 0, 0] }}
          transition={{ duration: 1.0, ease: "easeOut", repeat: Infinity, repeatDelay: 0.15 }}
          className="absolute inset-0 grid place-items-center text-4xl tracking-[.2em] font-semibold select-none"
        >
          TEKKIN
        </motion.h1>

        <motion.div
          initial={{ y: -160, opacity: 0 }}
          animate={{ y: 160, opacity: [0, 0.35, 0] }}
          transition={{ duration: 1.0, ease: "easeInOut", delay: 0.35 }}
          className="absolute left-0 right-0 h-[2px] bg-[#43FFD2]/60"
        />
      </div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-10 text-xs tracking-widest uppercase text-zinc-500"
      >
        loading — pixelating logo
      </motion.span>
    </div>
  );
}

// --- Nav (logo statico) ---
function Nav({ onOpenLogin, onOpenSignup, onNav, user, onLogout }: {
  onOpenLogin: () => void; onOpenSignup: () => void; onNav: (v: View) => void; user: any; onLogout: () => void;
}) {
  return (
    <div className="sticky top-0 z-40 border-b backdrop-blur border-zinc-800 bg-black/50">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNav("home") }>
          <div className="h-7 w-7 grid place-items-center rounded-md bg-zinc-900 border border-zinc-800 font-bold">T</div>
          <span className="tracking-[0.25em] text-sm text-zinc-300">TEKKIN</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
          <button className="hover:text-white" onClick={() => onNav("home")}>Home</button>
          <button className="hover:text-white" onClick={() => onNav("packs")}>Sample Packs</button>
          {user ? (<button className="hover:text-white" onClick={() => onNav("dashboard")}>Dashboard</button>) : null}
          <a className="hover:text-white" href="#radio">Radio</a>
           <a className="hover:text-[#43FFD2]" href="/spotlight">Spotlight</a>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden md:inline text-xs text-zinc-400 mr-2">{user.email}</span>
              <Button variant="outline" className="h-9" onClick={onLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button data-testid="signup-btn" onClick={onOpenSignup} variant="outline" className="h-9 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
                <UserPlus className="h-4 w-4 mr-2" />Sign Up
              </Button>
              <Button data-testid="login-btn" onClick={onOpenLogin} className="h-9 bg-[#43FFD2] text-black hover:bg-[#2fe8be]">
                <LogIn className="h-4 w-4 mr-2" />Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Hero ---
function Hero({ onBrowsePacks }: { onBrowsePacks: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0f0f0f,_#000)]" />
      <div className="mx-auto max-w-6xl px-4 py-20 relative">
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-semibold tracking-tight">
          Minimal / Deep-Tech hub for artists & ravers
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="mt-4 max-w-2xl text-zinc-400">
          News, sample packs, Tekkin Radio, and a members area. Clean tools, raw sound, underground vibe.
        </motion.p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={onBrowsePacks}><ShoppingBag className="h-4 w-4 mr-2" />Browse Packs</Button>
          <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
            <Radio className="h-4 w-4 mr-2" />Listen Tekkin Radio
          </Button>
        </div>
      </div>
    </section>
  );
}

function News() {
  return (
    <section id="news" className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Newspaper className="h-5 w-5 text-zinc-400" />
        <h3 className="text-xl font-semibold">Info / News</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {news.map((n) => (
          <Card key={n.id} className={`${brand.panel} border ${brand.border}`}>
            <CardHeader>
              <CardTitle className="text-base">{n.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">{n.body}</p>
              <p className="text-xs text-zinc-500 mt-3">{n.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Packs({ onOpenProduct }: { onOpenProduct: (id: number) => void }) {
  const p = packs[0];
  return (
    <section id="packs" className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Music2 className="h-5 w-5 text-zinc-400" />
        <h3 className="text-xl font-semibold">Sample Pack</h3>
      </div>
      <div className={`${brand.panel} border ${brand.border} rounded-xl overflow-hidden grid md:grid-cols-2`}>
        <div className="p-6 flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900">
          <img src={p.image} alt={p.name} className="w-full max-w-sm rounded-lg border border-zinc-800 shadow" />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h4 className="text-2xl font-semibold leading-tight">{p.name}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-300 h-fit mt-1">{p.tag}</span>
          </div>
          <p className="text-zinc-400 mt-3">{p.desc}</p>
          <ul className="mt-4 text-sm text-zinc-300 grid gap-2 list-disc ml-5">
            {p.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xl">€{p.price.toFixed(2)}</span>
            <Button className="h-10" onClick={() => onOpenProduct(p.id)}>
              <ShoppingBag className="h-4 w-4 mr-2" />View details
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductPage({ id, onBack }: { id: number; onBack: () => void }) {
  const p = packs.find((x) => x.id === id) || packs[0];
  const priceLabel = new Intl.NumberFormat("it-IT", { style: "currency", currency: p.currency }).format(p.price);
  const disabledCheckout = !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY; // client-side only key

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <button onClick={onBack} className="mb-6 text-sm text-zinc-400 hover:text-white">← Back to packs</button>
      <div className={`${brand.panel} border ${brand.border} rounded-xl p-6 grid md:grid-cols-2 gap-6`}>
        <div className="flex items-center justify-center">
          <img src={p.image} alt={p.name} className="w-full max-w-md rounded-lg border border-zinc-800 shadow" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold">{p.name}</h2>
          <p className="text-zinc-400 mt-3">{p.desc}</p>
          <div className="mt-4 grid gap-2">
            {p.features.map((f, i) => (
              <div key={i} className="text-sm text-zinc-300 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#43FFD2]" /> {f}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-2xl">{priceLabel}</span>
<Button
  className="h-10"
  onClick={async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 1 }),
      });
      if (!res.ok) {
        const t = await res.text();
        alert("Checkout error: " + t);
        return;
      }
      const { url } = await res.json();
      if (url) {
        window.location.href = url; // redirect diretto all'hosted Checkout
      } else {
        alert("Checkout error: URL non ricevuta.");
      }
    } catch (e: any) {
      alert("Checkout error: " + (e?.message || e));
    }
  }}
>
  Proceed to checkout
</Button>

          </div>
          <p className="text-xs text-zinc-500 mt-3">Secure payments via Stripe. PSD2/3D Secure supported.</p>
        </div>
      </div>
    </section>
  );
}

function Membership() {
  return (
    <section id="membership" className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="h-5 w-5 text-zinc-400" />
        <h3 className="text-xl font-semibold">Membership</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className={`${brand.panel} border ${brand.border}`}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Free <BadgeCheck className="h-4 w-4 text-zinc-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-400">
            <ul className="list-disc ml-5 space-y-1">
              <li>News & Radio access</li>
              <li>Store previews</li>
            </ul>
            <Button variant="outline" className="mt-4 w-full border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
              Get started
            </Button>
          </CardContent>
        </Card>

        <Card className={`${brand.panel} border ${brand.border} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-[.06] bg-[radial-gradient(circle_at_20%_0%,#43FFD2,transparent_40%)]" aria-hidden />
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Member <Sparkles className="h-4 w-4 text-zinc-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-400">
            <ul className="list-disc ml-5 space-y-1">
              <li>Monthly exclusive samples</li>
              <li>Tekkin Radio archives</li>
              <li>Community access</li>
            </ul>
            <Button className="mt-4 w-full bg-[#43FFD2] text-black hover:bg-[#2fe8be]">Join Member</Button>
          </CardContent>
        </Card>

        <Card className={`${brand.panel} border ${brand.border} ring-1 ring-[#43FFD2]/30`}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Member Plus <Crown className="h-4 w-4 text-[#43FFD2]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-400">
            <ul className="list-disc ml-5 space-y-1">
              <li>All Member benefits</li>
              <li>Full sample packs included</li>
              <li>Download credits monthly</li>
              <li>Private drops & stems</li>
            </ul>
            <Button className="mt-4 w-full bg-[#43FFD2] text-black hover:bg-[#2fe8be]">Upgrade to Plus</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function RadioBlock() {
  return (
    <section id="radio" className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <PlayCircle className="h-5 w-5 text-zinc-400" />
        <h3 className="text-xl font-semibold">Tekkin Radio</h3>
      </div>
      <Card className={`${brand.panel} border ${brand.border}`}>
        <CardContent className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-400">Weekly underground selections, guests & showcases.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
              <Radio className="h-4 w-4 mr-2" />Listen now
            </Button>
            <Button className="bg-[#43FFD2] text-black hover:bg-[#2fe8be]">
              <Sparkles className="h-4 w-4 mr-2" />Submit your mix
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm flex flex-col md:flex-row gap-4 items-center justify-between text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 grid place-items-center rounded-md bg-zinc-900 border border-zinc-800 font-bold">T</div>
          <span>© {new Date().getFullYear()} TEKKIN. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <a className="hover:text-white" href="#">Instagram</a>
          <a className="hover:text-white" href="#">SoundCloud</a>
          <a className="hover:text-white" href="#">Contact</a>
          <a className="hover:text-white flex items-center gap-1" href="#">
            <Github className="h-4 w-4" />Repo
          </a>
        </div>
      </div>
      {/* Diagnostics panel (client-side only) */}
      <div className="mx-auto max-w-6xl px-4 pb-10">
        <details className="text-xs text-zinc-500">
          <summary className="cursor-pointer hover:text-zinc-300">Auth diagnostics</summary>
          <div className="mt-3 grid gap-2">
            <div>Env URL set: <span className="text-zinc-300">{String(!!PUB_URL)}</span></div>
            <div>Env ANON set: <span className="text-zinc-300">{String(!!PUB_ANON)}</span></div>
            <button
              onClick={async () => {
                try {
                  if (!PUB_URL || !PUB_ANON) throw new Error("Missing NEXT_PUBLIC envs");
                  const r = await fetch(`${PUB_URL.replace(/\/$/, "")}/auth/v1/settings`, { headers: { apikey: PUB_ANON } });
                  const t = await r.text();
                  alert(`Auth settings status: ${r.status}
${t.slice(0, 200)}`);
                } catch (e: any) {
                  alert(`Diag error: ${e?.message || e}`);
                }
              }}
              className="mt-2 inline-flex px-2 py-1 rounded border border-zinc-800 hover:bg-zinc-900"
            >
              Ping Supabase auth
            </button>
          </div>
        </details>
      </div>
    </footer>
  );
}

function AuthDialogs({
  openLogin, setOpenLogin, openSignup, setOpenSignup, onLogin, onSignup, status,
}: {
  openLogin: boolean; setOpenLogin: (v: boolean) => void; openSignup: boolean; setOpenSignup: (v: boolean) => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, artist?: string) => Promise<void>;
  status: { login?: string; signup?: string };
}) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupArtist, setSignupArtist] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);

  return (
    <>
      <Dialog open={openLogin} onOpenChange={setOpenLogin}>
        <DialogContent className={`${brand.panel} border ${brand.border}`} data-testid="login-dialog">
          <DialogHeader className="relative pr-8">
            <DialogTitle>Login to Tekkin</DialogTitle>
            <button aria-label="Close" data-testid="login-close" onClick={() => setOpenLogin(false)} className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900">
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="grid gap-3">
            <Input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" />
            <Input value={loginPass} onChange={(e) => setLoginPass(e.target.value)} type="password" placeholder="Password" />
            {status.login && <p className="text-xs text-zinc-400">{status.login}</p>}
            <Button disabled={loadingLogin} onClick={async () => { setLoadingLogin(true); await onLogin(loginEmail, loginPass); setLoadingLogin(false); }} className="bg-[#43FFD2] text-black hover:bg-[#2fe8be]">
              {loadingLogin ? "Logging in…" : "Login"}
            </Button>
            <Button variant="outline" onClick={() => { setOpenLogin(false); setOpenSignup(true); }}>Create account</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openSignup} onOpenChange={setOpenSignup}>
        <DialogContent className={`${brand.panel} border ${brand.border}`} data-testid="signup-dialog">
          <DialogHeader className="relative pr-8">
            <DialogTitle>Create your Tekkin account</DialogTitle>
            <button aria-label="Close" data-testid="signup-close" onClick={() => setOpenSignup(false)} className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900">
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="grid gap-3">
            <Input value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="Email" />
            <Input value={signupPass} onChange={(e) => setSignupPass(e.target.value)} type="password" placeholder="Password" />
            <Input value={signupArtist} onChange={(e) => setSignupArtist(e.target.value)} placeholder="Artist name (optional)" />
            {status.signup && <p className="text-xs text-zinc-400">{status.signup}</p>}
            <Button disabled={loadingSignup} onClick={async () => { setLoadingSignup(true); await onSignup(signupEmail, signupPass, signupArtist); setLoadingSignup(false); }} className="bg-[#43FFD2] text-black hover:bg-[#2fe8be]">
              {loadingSignup ? "Creating…" : "Sign Up"}
            </Button>
            <Button variant="outline" onClick={() => { setOpenSignup(false); setOpenLogin(true); }}>I already have an account</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Dashboard({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-semibold">Welcome, {user?.email}</h2>
      <p className="text-zinc-400 mt-2">You're logged in. This is your dashboard placeholder.</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={onSignOut} variant="outline">Logout</Button>
        <Button onClick={() => alert("Coming soon: manage profile, downloads, membership status")}>Open profile</Button>
      </div>
    </section>
  );
}

// --- Dev smoke tests ---
function useDevSmokeTests(handlers: { openLogin: () => void; openSignup: () => void; closeAll: () => void }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const run = window.location.hash.includes("run-tests");
    if (!run) return;
    console.group("TEKKIN UI smoke tests");
    try {
      const signupBtn = document.querySelector('[data-testid="signup-btn"]') as HTMLButtonElement | null;
      if (!signupBtn) throw new Error("Signup button not found");
      signupBtn.click();
      setTimeout(() => {
        const signupDialog = document.querySelector('[data-testid="signup-dialog"]');
        console.assert(!!signupDialog, "Signup dialog should render");
        handlers.closeAll();
        const loginBtn = document.querySelector('[data-testid="login-btn"]') as HTMLButtonElement | null;
        if (!loginBtn) throw new Error("Login button not found");
        loginBtn.click();
        setTimeout(() => {
          const loginDialog = document.querySelector('[data-testid="login-dialog"]');
          console.assert(!!loginDialog, "Login dialog should render");
          handlers.closeAll();
          console.info("All smoke tests executed");
          console.groupEnd();
        }, 60);
      }, 60);
    } catch (e) {
      console.error(e);
      console.groupEnd();
    }
  }, [handlers]);
}

type View = "home" | "packs" | "product" | "dashboard";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [status, setStatus] = useState<{ login?: string; signup?: string }>({});
  const [view, setView] = useState<View>("home");
  const [productId, setProductId] = useState<number>(1);
  const [user, setUser] = useState<any>(null);

  // Supabase auth state
  useEffect(() => {
    (async () => { const { data } = await supabase.auth.getSession(); setUser(data.session?.user ?? null); })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  async function handleSignup(email: string, password: string, artist?: string) {
    setStatus((s) => ({ ...s, signup: "" }));
    if (!email || !password) { setStatus((s) => ({ ...s, signup: "Please enter email and password." })); return; }
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setStatus((s) => ({ ...s, signup: `Error: ${error.message}` })); return; }
      try { await supabase.auth.signInWithPassword({ email, password }); } catch {}
      if (artist && data.user?.id) { await supabase.from("profiles").insert({ user_id: data.user.id, artist_name: artist }).catch(() => {}); }
      setOpenSignup(false); setView("dashboard"); setStatus((s) => ({ ...s, signup: "Account created." }));
    } catch (e: any) { setStatus((s) => ({ ...s, signup: `Network error: ${e?.message || e}` })); }
  }

  async function handleLogin(email: string, password: string) {
    setStatus((s) => ({ ...s, login: "" }));
    if (!email || !password) { setStatus((s) => ({ ...s, login: "Please enter email and password." })); return; }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setStatus((s) => ({ ...s, login: `Error: ${error.message}` })); return; }
      setOpenLogin(false); setView("dashboard"); setStatus((s) => ({ ...s, login: "Logged in!" }));
    } catch (e: any) { setStatus((s) => ({ ...s, login: `Network error: ${e?.message || e}` })); }
  }

  async function handleLogout() { await supabase.auth.signOut(); setView("home"); }

  useDevSmokeTests({ openLogin: () => setOpenLogin(true), openSignup: () => setOpenSignup(true), closeAll: () => { setOpenLogin(false); setOpenSignup(false); } });

  return (
    <div className={`${brand.bg} ${"text-zinc-200"} min-h-screen`}>
      <AnimatePresence>
        {showSplash && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Splash onDone={() => setShowSplash(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {!showSplash && (
        <>
          <Nav onOpenLogin={() => setOpenLogin(true)} onOpenSignup={() => setOpenSignup(true)} onNav={(v) => setView(v)} user={user} onLogout={handleLogout} />
          <main>
            {view === "home" && (<><Hero onBrowsePacks={() => setView("packs")} /><News /><Packs onOpenProduct={(id) => { setProductId(id); setView("product"); }} /><Membership /><RadioBlock /><TekkinSpotlight />
</>)}
            {view === "packs" && (<Packs onOpenProduct={(id) => { setProductId(id); setView("product"); }} />)}
            {view === "product" && (<ProductPage id={productId} onBack={() => setView("packs")} />)}
            {view === "dashboard" && user && (<Dashboard user={user} onSignOut={handleLogout} />)}
          </main>
          <Footer />
          <AuthDialogs openLogin={openLogin} setOpenLogin={setOpenLogin} openSignup={openSignup} setOpenSignup={setOpenSignup} onLogin={handleLogin} onSignup={handleSignup} status={status} />
        </>
      )}
    </div>
  );
}
