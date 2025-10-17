// scripts/import_events.ts
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Dati reali (puoi aggiornarli quando vuoi)
const EVENTS = [
  {
    artist: "Cloonee",
    date: "2025-11-02",
    venue: "Space Miami",
    city: "Miami",
    country: "USA",
    url: "https://ra.co/events/1938143",
    source: "manual",
  },
  {
    artist: "Marco Carola",
    date: "2025-11-16",
    venue: "Music On",
    city: "Ibiza",
    country: "Spain",
    url: "https://ra.co/events/1938011",
    source: "manual",
  },
  {
    artist: "Manda Moor",
    date: "2025-11-22",
    venue: "Defected Malta",
    city: "Valletta",
    country: "Malta",
    url: "https://ra.co/events/1939001",
    source: "manual",
  },
  {
    artist: "Joseph Capriati",
    date: "2025-11-30",
    venue: "Cocoricò",
    city: "Riccione",
    country: "Italy",
    url: "https://ra.co/events/1941101",
    source: "manual",
  },
  {
    artist: "Ilario Alicante",
    date: "2025-12-07",
    venue: "Amnesia Milano",
    city: "Milan",
    country: "Italy",
    url: "https://ra.co/events/1942003",
    source: "manual",
  },
];

async function main() {
  console.log("💽 Import Tekkin Spotlight Events...");

  for (const ev of EVENTS) {
    const { data: existing } = await supabase
      .from("spotlight_events")
      .select("id")
      .eq("artist", ev.artist)
      .eq("date", ev.date)
      .maybeSingle();

    if (existing) {
      console.log(`⏩ Già presente: ${ev.artist} - ${ev.date}`);
      continue;
    }

    const { error } = await supabase.from("spotlight_events").insert(ev);
    if (error) {
      console.error(`❌ Errore inserendo ${ev.artist}:`, error.message);
    } else {
      console.log(`✅ Aggiunto: ${ev.artist} - ${ev.venue}`);
    }
  }

  console.log("🎉 Spotlight aggiornato con successo!");
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
