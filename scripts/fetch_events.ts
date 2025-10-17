// scripts/fetch_events.ts
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

const ARTISTS = [
  { name: "Cloonee", id: "11087885" },
  { name: "Marco Carola", id: "97134" },
  { name: "Manda Moor", id: "15486359" },
  { name: "Joseph Capriati", id: "379225" },
  { name: "Ilario Alicante", id: "247339" },
];

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type EventItem = {
  artist: string;
  artist_id: string;
  date?: string;
  venue?: string;
  city?: string;
  country?: string;
  url?: string;
  raw?: any;
};

// ---- parsing del JSON-LD dai siti Bandsintown ----
async function harvestFromJsonLd(page: import("playwright").Page): Promise<EventItem[]> {
  const jsons = await page.$$eval('script[type="application/ld+json"]', (nodes: Element[]) =>
    nodes
      .map((n: Element) => {
        try {
          return JSON.parse(n.textContent || "{}");
        } catch {
          return null;
        }
      })
      .filter(Boolean)
  );

  const flat = (arr: any[]): any[] =>
    arr.flat ? arr.flat(Infinity) : ([] as any[]).concat(...arr);

  const all = flat(jsons as any);
  const events: any[] = [];

  const pushEvent = (e: any) => {
    if (e && (e["@type"] === "Event" || (Array.isArray(e["@type"]) && e["@type"].includes("Event")))) {
      events.push(e);
    }
  };

  for (const block of all) {
    if (Array.isArray(block)) block.forEach(pushEvent);
    else if (block["@graph"]) (block["@graph"] as any[]).forEach(pushEvent);
    else pushEvent(block);
  }

  return events.map(e => {
    const loc = e.location || {};
    const addr = loc.address || {};
    return {
      artist: "",
      artist_id: "",
      date: e.startDate || e.endDate,
      venue: loc.name,
      city: addr.addressLocality || addr.addressRegion,
      country: addr.addressCountry,
      url: e.url,
      raw: e,
    } as EventItem;
  });
}

// ---- scarica eventi artista ----
async function fetchArtistEvents(artist: { name: string; id: string }): Promise<EventItem[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  });

  const url = `https://www.bandsintown.com/a/${artist.id}?came_from=api`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  // 1. prova JSON-LD
  let items = await harvestFromJsonLd(page);

  // 2. fallback: prova variabili globali
  if (!items.length) {
    const windowData = await page.evaluate(() => {
      const anyWin = window as any;
      return anyWin.__NEXT_DATA__ || anyWin.__data || null;
    });
    if (windowData) {
      const tryEvents = (o: any): any[] => {
        if (!o) return [];
        const results: any[] = [];

        const visit = (x: any) => {
          if (!x) return;
          if (Array.isArray(x)) {
            x.forEach(visit);
          } else if (typeof x === "object") {
            const eventsArr = Array.isArray(x.events)
              ? x.events
              : Array.isArray(x.calendar?.events)
              ? x.calendar.events
              : null;
            if (eventsArr) results.push(...eventsArr);
            Object.values(x).forEach(visit);
          }
        };

        visit(o);
        return results;
      };

      const ev = tryEvents(windowData);
      items = ev.map((e: any) => ({
        artist: "",
        artist_id: "",
        date: e.datetime || e.startDate,
        venue: e.venue?.name,
        city: e.venue?.city,
        country: e.venue?.country,
        url: e.url || e.uri,
        raw: e,
      }));
    }
  }

  await browser.close();

  // aggiungi nome e id artista
  return items.map(i => ({ ...i, artist: artist.name, artist_id: artist.id }));
}

// ---- MAIN ----
async function main() {
  const all: EventItem[] = [];

  for (const a of ARTISTS) {
    try {
      const ev = await fetchArtistEvents(a);
      console.log(`✅ ${a.name}: trovati ${ev.length} eventi`);
      all.push(...ev);
    } catch (e) {
      console.error(`❌ errore ${a.name}`, e);
    }
  }

  if (!all.length) {
    console.warn("⚠️ Nessun evento trovato.");
    return;
  }

  // format dati per Supabase
  const rows = all.map(e => {
    const raw = e.raw || {};
    const rawVenue = raw.venue || raw.location || {};
    let rawDate =
      e.date ||
      raw.datetime ||
      raw.startDate ||
      raw.end_time ||
      raw.start_time ||
      raw.date ||
      raw.day ||
      null;

    if (rawDate && typeof rawDate === "string" && /^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
      rawDate = new Date(rawDate).toISOString();
    } else {
      rawDate = null;
    }

    return {
      source: "bandsintown",
      artist: e.artist,
      artist_id: e.artist_id,
      date: rawDate,
      venue: e.venue || rawVenue.name || "Unknown Venue",
      city: e.city || rawVenue.city || null,
      country: e.country || rawVenue.country || null,
      url: e.url || raw.url || null,
      raw: raw,
    };
  });

  console.log(`🧩 Pre-insert: ${rows.length} eventi trovati totali`);
  const validRows = rows.filter(r => r.venue);
  console.log(`📦 Pronti per l'inserimento: ${validRows.length}`);

  if (!validRows.length) {
    console.warn("⚠️ Nessun evento valido da salvare (manca venue).");
    return;
  }

  const { error } = await supabase.from("spotlight_events").insert(validRows);
  if (error) console.error("❌ Supabase insert error:", error);
  else console.log(`💾 Salvati ${validRows.length} eventi in spotlight_events`);
}

main().catch(err => {
  console.error("❌ Fatal:", err);
  process.exit(1);
});
