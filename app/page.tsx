"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import {
  ShoppingBag,
  LogIn,
  UserPlus,
  Radio,
  Newspaper,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Crown,
  PlayCircle,
  Github,
  X,
} from "lucide-react";
import TekkinSpotlight from "../components/TekkinSpotlight";
import NewsGrid from "../components/NewsGrid";

// === Utility UI ===
const Button = ({ children, variant = "solid", className = "", ...props }) => (
  <button
    {...props}
    className={`rounded-md px-4 py-2 text-sm transition ${
      variant === "outline"
        ? "border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
        : "bg-[#43FFD2] text-black hover:bg-[#2fe8be]"
    } ${className}`}
  >
    {children}
  </button>
);

const Card = ({ className = "", ...props }) => (
  <div
    {...props}
    className={`rounded-xl border border-zinc-800 bg-[#121212]/80 backdrop-blur ${className}`}
  />
);

// === Splash Glitch ===
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
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 grid place-items-center bg-[#0b0b0b] text-zinc-200 overflow-hidden">
      <div className="relative w-[320px] h-[320px]">
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-[2px]">
          {pixels.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: [1, 0.45, 1, 0],
                scale: [1, 1.04, 0.96, 1, 0.9],
                x: [0, 0, p.x],
                y: [0, 0, p.y],
              }}
              transition={{ duration: 1.8, delay: p.delay, ease: "easeInOut" }}
              className="bg-[#1f1f1f]"
            />
          ))}
        </div>
        <motion.h1
          initial={{ opacity: 0, letterSpacing: 12 }}
          animate={{
            opacity: 1,
            letterSpacing: 2,
            x: [0, -1, 1, -1, 0],
            y: [0, 1, -1, 0, 0],
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 0.15,
          }}
          className="absolute inset-0 grid place-items-center text-4xl font-semibold select-none tracking-[.2em]"
        >
          TEKKIN
        </motion.h1>
      </div>
    </div>
  );
}

// === Navbar ===
function Nav({ onNav, user, onLogout, onLogin, onSignup }) {
  return (
    <div className="sticky top-0 z-50 border-b border-zinc-800 bg-black/40 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNav("home")}
        >
          <div className="h-7 w-7 grid place-items-center rounded-md bg-zinc-900 border border-zinc-800 font-bold">
            T
          </div>
          <span className="text-sm tracking-[0.25em] text-zinc-300">
            TEKKIN
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm text-zinc-400">
          <button onClick={() => onNav("home")}>Home</button>
          <button onClick={() => onNav("packs")}>Sample Packs</button>
          <button onClick={() => onNav("radio")}>Radio</button>
          <button onClick={() => onNav("spotlight")}>Spotlight</button>
          {user ? (
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onSignup}>
                <UserPlus className="w-4 h-4 mr-1" />
                Sign Up
              </Button>
              <Button onClick={onLogin}>
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// === Hero ===
function Hero({ onBrowse }: { onBrowse: () => void }) {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#0b0b0b] to-[#111]">
      <div className="max-w-6xl mx-auto px-4 relative">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold tracking-tight"
        >
          Minimal / Deep-Tech hub for artists & ravers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-4 max-w-2xl text-zinc-400"
        >
          News, sample packs, Tekkin Radio e un’area membri. Strumenti puliti,
          suono raw, vibrazione underground.
        </motion.p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={onBrowse}>
            <ShoppingBag className="w-4 h-4 mr-2" /> Browse Packs
          </Button>
          <Button variant="outline">
            <Radio className="w-4 h-4 mr-2" /> Ascolta Tekkin Radio
          </Button>
        </div>
      </div>
    </section>
  );
}

// === News ===
function News() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Newspaper className="h-5 w-5 text-zinc-400" />
        <h3 className="text-xl font-semibold">Ultime Notizie Tekkin</h3>
      </div>
      <NewsGrid categoria="produzione" />
      <NewsGrid categoria="promozione" />
      <NewsGrid categoria="eventi" />
    </section>
  );
}

// === Sample Pack con Stripe ===
function SamplePack() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="h-5 w-5 text-zinc-400" />
        <h3 className="text-xl font-semibold">Sample Pack</h3>
      </div>

      <Card className="grid md:grid-cols-2 overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-zinc-950 to-zinc-900 flex items-center justify-center">
          <img
            src="/products/show-me-your.png"
            alt="Show Me Your Project"
            className="w-full max-w-sm rounded-lg border border-zinc-800 shadow"
          />
        </div>
        <div className="p-6">
          <h4 className="text-2xl font-semibold">SHOW ME YOUR (Ableton Project)</h4>
          <p className="text-zinc-400 mt-3">
            Complete Ableton project with arranged sections, mixbus, and stems.
            Kick, Bass, Tops, Perc, Vocals, FX are neatly labeled and color-coded.
          </p>
          <ul className="mt-4 text-sm text-zinc-300 grid gap-2 list-disc ml-5">
            <li>Ableton Live project (.als)</li>
            <li>WAV 24-bit 44.1 kHz stems</li>
            <li>Royalty-free for released tracks</li>
            <li>Color-coded minimal / deep-tech racks</li>
            <li>CPU-friendly (native first)</li>
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xl">€24,99</span>
            <Button
              onClick={async () => {
                try {
                  const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity: 1 }),
                  });
                  if (!res.ok) throw new Error(await res.text());
                  const { url } = await res.json();
                  if (url) window.location.href = url;
                } catch (e) {
                  alert("Checkout error: " + e.message);
                }
              }}
            >
              Procedi al checkout
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}

// === Footer ===
function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 grid place-items-center rounded-md bg-zinc-900 border border-zinc-800 font-bold">
            T
          </div>
          <span>© {new Date().getFullYear()} TEKKIN. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white">
            Instagram
          </a>
          <a href="#" className="hover:text-white">
            SoundCloud
          </a>
          <a href="#" className="hover:text-white flex items-center gap-1">
            <Github className="h-4 w-4" /> Repo
          </a>
        </div>
      </div>
    </footer>
  );
}

// === MAIN APP ===
export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    })();
  }, []);

  if (showSplash)
    return (
      <AnimatePresence>
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <Splash onDone={() => setShowSplash(false)} />
        </motion.div>
      </AnimatePresence>
    );

  return (
    <div className="bg-[#0b0b0b] text-zinc-200 min-h-screen">
      <Nav
        onNav={setView}
        user={user}
        onLogout={async () => await supabase.auth.signOut()}
        onLogin={() => alert("Apri login modal")}
        onSignup={() => alert("Apri signup modal")}
      />
      <main>
        {view === "home" && (
          <>
            <Hero onBrowse={() => setView("packs")} />
            <News />
            <SamplePack />
            <TekkinSpotlight />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
