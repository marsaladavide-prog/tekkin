"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, ExternalLink, Instagram } from "lucide-react";

/**
 * Tekkin Spotlight
 * Versione v1: UI completa con dati mock + struttura estendibile per API reali.
 * Non tocca Supabase. Nessun side-effect. Sicuro da inserire in produzione.
 */

export type SpotlightStory = {
  id: string;
  author: string;          // es. @user123
  url: string;             // link alla storia/post
  caption?: string;
  timestamp?: string;      // ISO o data leggibile
};

export type SpotlightGig = {
  id: string;
  artist: string;
  date: string;            // es. "2025-10-19"
  venue: string;           // es. "Space Miami"
  city?: string;
  country?: string;
  instagramVenueTag?: string; // es. @spacemiami
  stories: SpotlightStory[];
};

export type SpotlightProps = {
  artists?: string[]; // se non passi nulla usa default
  gigs?: SpotlightGig[]; // opzionale, per override dall'esterno
};

const DEFAULT_ARTISTS = [
  "Yaya",
  "Cloonee",
  "Ilario Alicante",
  "Marco Carola",
  "Joseph Capriati",
  "Manda Moor",
];

// Mock iniziale. In Fase 2 li popoleremo via API.
const MOCK_GIGS: SpotlightGig[] = [
  {
    id: "g1",
    artist: "Cloonee",
    date: "2025-10-19",
    venue: "Space Miami",
    city: "Miami",
    country: "USA",
    instagramVenueTag: "@spacemiami",
    stories: [
      { id: "s1", author: "@club_shooter", url: "https://instagram.com/", caption: "Cloonee destroyed the terrace" },
      { id: "s2", author: "@miami_night", url: "https://instagram.com/", caption: "Crowd going off" },
    ],
  },
  {
    id: "g2",
    artist: "Marco Carola",
    date: "2025-10-26",
    venue: "Music On Madrid",
    city: "Madrid",
    country: "ES",
    instagramVenueTag: "@musiconofficial",
    stories: [
      { id: "s3", author: "@techhouse_madrid", url: "https://instagram.com/", caption: "Legend" },
    ],
  },
  {
    id: "g3",
    artist: "Manda Moor",
    date: "2025-10-30",
    venue: "Defected Croatia",
    city: "Tisno",
    country: "HR",
    instagramVenueTag: "@defectedrecords",
    stories: [],
  },
];

const chipClass =
  "inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition";

export default function TekkinSpotlight({ artists, gigs }: SpotlightProps) {
  const [query, setQuery] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<string>("all");

  const artistList = useMemo(() => artists?.length ? artists : DEFAULT_ARTISTS, [artists]);
  const data = useMemo(() => gigs?.length ? gigs : MOCK_GIGS, [gigs]);

  const filtered = useMemo(() => {
    return data
      .filter(g =>
        (selectedArtist === "all" || g.artist === selectedArtist) &&
        (query.trim() === "" ||
          g.venue.toLowerCase().includes(query.toLowerCase()) ||
          g.city?.toLowerCase().includes(query.toLowerCase()) ||
          g.artist.toLowerCase().includes(query.toLowerCase()))
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data, selectedArtist, query]);

  return (
    <section id="spotlight" className="mx-auto max-w-6xl px-4 py-16">
      {/* Header */}
      <div className="mb-8 relative overflow-hidden rounded-2xl border border-zinc-800">
        {/* background dinamico blu/viola */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 350px at 20% 0%, rgba(67,255,210,0.08), transparent), radial-gradient(900px 350px at 80% 100%, rgba(139,92,246,0.12), transparent)",
          }}
          animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.02, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative p-6 md:p-8 bg-[#121212]/70 backdrop-blur">
          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-semibold"
          >
            Tekkin Spotlight
          </motion.h3>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">
            Raccogliamo ogni settimana date e menzioni dei locali dove suonano gli artisti seguiti.
            Qui vedi venue, data e storie Instagram collegate.
          </p>

          {/* Controls */}
          <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedArtist("all")}
                className={`${chipClass} ${selectedArtist === "all" ? "ring-1 ring-[#43FFD2]/40" : ""}`}
              >
                Tutti
              </button>
              {artistList.map(a => (
                <button
                  key={a}
                  onClick={() => setSelectedArtist(a)}
                  className={`${chipClass} ${selectedArtist === a ? "ring-1 ring-[#43FFD2]/40" : ""}`}
                >
                  {a}
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cerca venue o città"
              className="h-9 w-full md:w-64 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm outline-none focus:ring-1 focus:ring-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(g => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-zinc-800 bg-[#121212] overflow-hidden"
          >
            {/* header card */}
            <div className="p-4 border-b border-zinc-800 bg-gradient-to-r from-zinc-950 to-zinc-900">
              <div className="text-sm text-zinc-400">Artist</div>
              <div className="text-lg font-semibold">{g.artist}</div>
            </div>

            {/* info */}
            <div className="p-4 grid gap-3">
              <div className="flex items-center text-sm text-zinc-300">
                <Calendar className="h-4 w-4 mr-2 text-[#43FFD2]" /> {g.date}
              </div>
              <div className="flex items-center text-sm text-zinc-300">
                <MapPin className="h-4 w-4 mr-2 text-[#43FFD2]" />
                <span>
                  {g.venue}
                  {g.city ? `, ${g.city}` : ""} {g.country ? ` (${g.country})` : ""}
                </span>
              </div>
              {g.instagramVenueTag && (
                <a
                  href={`https://instagram.com/${g.instagramVenueTag.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#43FFD2] hover:underline"
                >
                  <Instagram className="h-4 w-4" />
                  {g.instagramVenueTag}
                </a>
              )}

              {/* Stories */}
              <div className="mt-2">
                <div className="text-xs text-zinc-400 mb-2">Stories e menzioni</div>
                {g.stories.length === 0 && (
                  <div className="text-xs text-zinc-500">Nessuna storia raccolta per ora</div>
                )}
                <div className="grid gap-2">
                  {g.stories.map(s => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-md border border-zinc-800 hover:bg-zinc-900/60 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm text-zinc-200">{s.author}</div>
                        {s.caption && (
                          <div className="truncate text-xs text-zinc-500">{s.caption}</div>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
