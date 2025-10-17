// /supabase/functions/fetch_instagram_stories/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Legge le variabili d’ambiente impostate su Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("🔁 Tekkin Spotlight | fetch_instagram_stories avviato");

type Story = {
  artist: string;
  venue: string;
  city?: string;
  date?: string;
  story_url: string;
  caption?: string;
  posted_by?: string;
  audio_title?: string;
};

Deno.serve(async (req) => {
  try {
    // 1️⃣ Leggiamo tutti gli artisti da Supabase
    const { data: artists } = await supabase.from("spotlight_artists").select("*");
    if (!artists?.length) return new Response("No artists found", { status: 200 });

    const allStories: Story[] = [];

    for (const artist of artists) {
      console.log(`🔍 Ricerca stories per ${artist.name}`);

      // 2️⃣ Simuliamo chiamata Instagram Graph API (qui andrà il fetch reale)
      // TODO: sostituire con Instagram API (hashtag search / mentions)
      const stories = [
        {
          artist: artist.name,
          venue: "Defected Croatia",
          city: "Tisno",
          date: "2025-10-30",
          story_url: `https://instagram.com/stories/${artist.instagram_handle}/123`,
          caption: `${artist.name} live @ Defected Croatia 💥`,
          posted_by: "@defectedrecords",
          audio_title: "Davide Marsala - Groove 079",
        },
      ];

      // 3️⃣ Salviamo su Supabase
      const { error } = await supabase.from("spotlight_stories").insert(stories);
      if (error) console.error("❌ Errore salvataggio stories:", error);
      else console.log(`✅ Salvate ${stories.length} stories per ${artist.name}`);

      allStories.push(...stories);
    }

    return new Response(
      JSON.stringify({ success: true, saved: allStories.length }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Errore generale:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
