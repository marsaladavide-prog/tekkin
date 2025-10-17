"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaInstagram, FaSpotify, FaSoundcloud } from "react-icons/fa";

// Manteniamo tutti i tuoi import funzionali (Stripe, Supabase, Spotlight, ecc.)
import StripeCheckout from "@/components/StripeCheckout";
import TekkinSpotlight from "@/components/TekkinSpotlight";
import { createClient } from "@supabase/supabase-js";
import { loadStripe } from "@stripe/stripe-js";
import Footer from "@/components/Footer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function TekkinVisualPage() {
  const [showContent, setShowContent] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1800);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white">
      {/* --- Splash Intro --- */}
      {!showContent && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-6xl font-bold tracking-widest bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            TEKKIN
          </motion.h1>
        </motion.div>
      )}

      {/* --- Navbar --- */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className={`fixed top-0 z-40 w-full backdrop-blur-lg transition-all duration-500 ${
          scrollY > 50
            ? "bg-black/40 border-b border-white/10"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4 px-6">
          <motion.h1
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-xl font-semibold tracking-wider text-white"
          >
            T
          </motion.h1>
          <div className="space-x-6 text-sm">
            <Link href="#news" className="hover:text-blue-400">
              News
            </Link>
            <Link href="#packs" className="hover:text-blue-400">
              Packs
            </Link>
            <Link href="#membership" className="hover:text-blue-400">
              Membership
            </Link>
            <Link href="#radio" className="hover:text-blue-400">
              Radio
            </Link>
            <Link href="#spotlight" className="hover:text-blue-400">
              Spotlight
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* --- Hero --- */}
      {showContent && (
        <section
          id="hero"
          className="relative flex h-screen w-full items-center justify-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6 }}
            className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-700/5 to-black animate-pulse"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 1.2 }}
            className="z-10"
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              TEKKIN
            </h1>
            <p className="mt-4 text-gray-300 uppercase tracking-widest">
              Minimal / Deep-Tech Culture
            </p>
            <Link href="#spotlight">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="mt-8 rounded-full border border-blue-400 px-6 py-2 text-sm text-blue-300 transition hover:bg-blue-500/10"
              >
                Enter The Culture
              </motion.button>
            </Link>
          </motion.div>
        </section>
      )}

      {/* --- Spotlight Section --- */}
      <section id="spotlight" className="relative z-10 mx-auto max-w-6xl py-24 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-3xl font-semibold text-blue-400"
        >
          Tekkin Spotlight
        </motion.h2>
        <TekkinSpotlight />
      </section>

      {/* --- Packs (Stripe active) --- */}
      <section id="packs" className="mx-auto max-w-6xl py-24 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-3xl font-semibold text-purple-400"
        >
          Sample Packs
        </motion.h2>
        <StripeCheckout />
      </section>

      {/* --- Membership --- */}
      <section id="membership" className="mx-auto max-w-6xl py-24 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-3xl font-semibold text-blue-400"
        >
          Membership
        </motion.h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Join TEKKIN+ for exclusive packs, early releases, and community benefits.
        </p>
        <Link href="/membership">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-6 rounded-full border border-purple-400 px-8 py-2 text-sm text-purple-300 transition hover:bg-purple-500/10"
          >
            Join Now
          </motion.button>
        </Link>
      </section>

      {/* --- Radio --- */}
      <section id="radio" className="mx-auto max-w-6xl py-24 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-3xl font-semibold text-blue-400"
        >
          Tekkin Radio
        </motion.h2>
        <p className="text-gray-400 mb-10">Weekly curated minimal / deep-tech sets.</p>
        <div className="rounded-2xl bg-white/5 p-6 shadow-lg">
          <iframe
            className="w-full rounded-xl"
            height="180"
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4pUKG1kS0Ac"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          ></iframe>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-black/40 border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-sm text-gray-400 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} TEKKIN. All rights reserved.</p>
          <div className="flex gap-4 text-xl">
            <Link href="https://instagram.com/tekkinofficial" target="_blank" className="hover:text-pink-500">
              <FaInstagram />
            </Link>
            <Link href="https://soundcloud.com/tekkinofficial" target="_blank" className="hover:text-orange-400">
              <FaSoundcloud />
            </Link>
            <Link href="https://spotify.com" target="_blank" className="hover:text-green-400">
              <FaSpotify />
            </Link>
            <Link href="https://discord.gg/" target="_blank" className="hover:text-indigo-400">
              <FaDiscord />
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
