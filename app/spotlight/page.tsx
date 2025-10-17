"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, RefreshCcw } from "lucide-react";

/** ---------- UTIL DATE (Europe/Rome) ---------- */
const TZ = "Europe/Rome";

// prova a parse-are più formati comuni
function parseDateRome(input: string | Date): Date | null {
  if (input instanceof Date) return input;
  if (!input) return null;

  // ISO pieno o YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(input)) {
    // se non ha orario, aggiungo mezzogiorno in Europe/Rome per evitare slittamenti
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return new Date(`${input}T12:00:00`);
    }
    return new Date(input);
  }

  // DD/MM/YYYY
  const dmY = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(input);
  if (dmY) {
    const [_, dd, mm, yyyy] = dmY;
    return new Date(`${yyyy}-${mm}-${dd}T12:00:00`);
  }

  // fallback best-effort
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

function toLocaleDateRome(d: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function isSameDayRome(a: Date, b: Date) {
  const A = new Date(a); const B = new Date(b);
  // normalizzo all’inizio giorno Roma
  const Akey = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(A);
  const Bkey = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(B);
  return Akey === Bkey;
}

function addDaysRome(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

/** ---------- PAGE ---------- */
export default function SpotlightPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNextWeek, setShowNextWeek] = useState(false);

  useEffect(() => {
    fetch("/api/spotlight")
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && Array.isArray(d.data)) setEvents(d.data);
        else setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  /** date “oggi” in Rome */
  const todayRome = useMemo(() => {
    const now = new Date();
    // taglio ore per i confronti settimanali
    return new Date(
      new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
        .format(now) + "T12:00:00"
    );
  }, []);

  /** split sezioni */
  const { live, upcomingThisWeek, upcomingNextWeek, pastWeek } = useMemo(() => {
    const live: any[] = [];
    const upcoming: any[] = [];
    const past: any[] = [];

    for (const ev of events) {
      const d = parseDateRome(ev.date);
      if (!d) continue;

      if (isSameDayRome(d, todayRome)) {
        live.push(ev);
      } else if (d > todayRome) {
        upcoming.push(ev);
      } else {
        past.push(ev);
      }
    }

    // ordini
    live.sort((a: any, b: any) => parseDateRome(a.date)!.getTime() - parseDateRome(b.date)!.getTime());
    upcoming.sort((a: any, b: any) => parseDateRome(a.date)!.getTime() - parseDateRome(b.date)!.getTime());
    past.sort((a: any, b: any) => parseDateRome(b.date)!.getTime() - parseDateRome(a.date)!.getTime());

    const endThisWeek = addDaysRome(todayRome, 7);
    const endNextWeek = addDaysRome(todayRome, 14);

    const upcomingThisWeek = upcoming.filter((e) => {
      const d = parseDateRome(e.date)!;
      return d <= endThisWeek;
    });

    const upcomingNextWeek = upcoming.filter((e) => {
      const d = parseDateRome(e.date)!;
      return d > endThisWeek && d <= endNextWeek;
    });

    const pastWeek = past.filter((e) => {
      const d = parseDateRome(e.date)!;
      return d >= addDaysRome(todayRome, -7);
    });

    return { live, upcomingThisWeek, upcomingNextWeek, pastWeek };
  }, [events, todayRome]);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center text-neutral-400">
        Loading Spotlight...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* HEADER COMPACT */}
      <div className="px-6 md:px-10 pt-8 pb-6 border-b border-[#1a1a1a] bg-[#0C0C0C] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-[#9b5cff] to-[#5c8dff] text-transparent bg-clip-text">
              Tekkin Spotlight
            </span>
          </h1>
          <button
            onClick={() => location.reload()}
            className="inline-flex items-center gap-2 text-xs md:text-sm border border-[#2a2a2a] hover:border-[#7c4dff] rounded-full px-3 py-1.5 text-neutral-300 hover:bg-[#7c4dff]/10 transition"
            title="Refresh"
          >
            <RefreshCcw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-14">
        {/* LIVE NOW */}
        <Section title="Live Now">
          {live.length === 0 ? (
            <Empty note="Nessun evento in corso al momento." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {live.map((ev) => (
                <EventCard key={ev.id || ev.artist + ev.date} ev={ev} badge="LIVE" />
              ))}
            </div>
          )}
        </Section>

        {/* UPCOMING — questa settimana (+ toggle settimana prossima) */}
        <Section title="Upcoming Events (this week)">
          {upcomingThisWeek.length === 0 ? (
            <Empty note="Nessun evento in arrivo entro una settimana." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingThisWeek.map((ev) => (
                <EventCard key={ev.id || ev.artist + ev.date} ev={ev} />
              ))}
            </div>
          )}

          {/* Toggle next week */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowNextWeek((s) => !s)}
              className="text-sm text-[#9b5cff] hover:text-white inline-flex items-center gap-1"
            >
              {showNextWeek ? <>Hide next week <ChevronUp size={16} /></> : <>Show next week <ChevronDown size={16} /></>}
            </button>
          </div>

          {showNextWeek && (
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingNextWeek.length === 0 ? (
                <Empty note="Nessun evento nella settimana successiva." />
              ) : (
                upcomingNextWeek.map((ev) => (
                  <EventCard key={ev.id || ev.artist + ev.date} ev={ev} />
                ))
              )}
            </div>
          )}
        </Section>

        {/* PAST — ultima settimana con archivi salvati */}
        <Section title="Past Events (last 7 days)">
          {pastWeek.length === 0 ? (
            <Empty note="Nessun evento archiviato nell'ultima settimana." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastWeek.map((ev) => (
                <EventCard key={ev.id || ev.artist + ev.date} ev={ev} archived />
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

/** ---------- UI SUB-COMPONENTS ---------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg md:text-xl font-semibold tracking-wide bg-gradient-to-r from-[#9b5cff] to-[#5c8dff] text-transparent bg-clip-text">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Empty({ note }: { note: string }) {
  return (
    <div className="flex items-center justify-center py-12 text-sm text-neutral-500 border border-dashed border-[#1a1a1a] rounded-xl bg-[#0c0c0c]/40">
      {note}
    </div>
  );
}

function EventCard({
  ev,
  badge,
  archived,
}: {
  ev: any;
  badge?: "LIVE";
  archived?: boolean;
}) {
  const d = parseDateRome(ev.date);
  const dateTxt = d ? toLocaleDateRome(d) : "—";
  const href = `/spotlight/${encodeURIComponent(ev.artist)}`;

  return (
    <Link
      href={href}
      className={`group block rounded-2xl overflow-hidden border ${
        archived ? "border-[#242424]" : "border-[#1e1e1e]"
      } bg-gradient-to-b from-[#0c0c0c] to-[#050505] hover:border-[#7c4dff]/50 transition duration-300`}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={
            ev.instagramProfile ||
            ev.thumbnail ||
            "https://tekkin-assets.s3.eu-central-1.amazonaws.com/spotlight-placeholder.jpg"
          }
          alt={ev.artist}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        {/* Badge LIVE */}
        {badge && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-[#9b5cff]/30 border border-[#9b5cff]/40 text-[11px] font-semibold rounded-full text-[#d7b3ff]">
            {badge}
          </div>
        )}

        {/* Event links */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {ev.url && (
            <a
              href={ev.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#9b5cff] hover:text-white underline"
              onClick={(e) => e.stopPropagation()}
            >
              Event ↗
            </a>
          )}
          {ev.bandsintown && (
            <a
              href={ev.bandsintown}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#5c8dff] hover:text-white underline"
              onClick={(e) => e.stopPropagation()}
            >
              Bandsintown ↗
            </a>
          )}
        </div>

        {/* Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base font-semibold">{ev.artist}</h3>
          <p className="text-[12px] text-neutral-300 leading-tight">
            {ev.venue || "—"} • {dateTxt}
          </p>
        </div>
      </div>
    </Link>
  );
}
