import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const { data, error } = await supabase
      .from("spotlight_events")
      .select("raw")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0)
      return NextResponse.json({ success: true, data: [] });

    const mapped = await Promise.all(
  data.map(async (row: any, index: number) => {
    try {
      const r = typeof row.raw === "string" ? JSON.parse(row.raw) : row.raw;

      const artist =
        r.ticketClickData?.userCreationData?.artistName ||
        r.artistName ||
        r.performerName ||
        r.name ||
        r.title?.replace(/Live|Event|Show|Tickets/gi, "").trim() ||
        "Unknown Artist";

      const city = r.location?.split(",")[0]?.trim() || "";
      const country = r.location?.split(",")[1]?.trim() || "";

      const uniqueKey = `${r.id || index}-${artist
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

      // ✅ 🔥 RICHIESTA AL TUO ENDPOINT INSTAGRAM
      const artistUsername = artist.toLowerCase().replace(/\s+/g, "");
      let instagramProfile = null;

      try {
        const igRes = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/instagram/profile?username=${artistUsername}`
        );
        const igData = await igRes.json();
        if (igData.success) instagramProfile = igData.data.profile_picture_url;
      } catch (err) {
        console.warn(`Instagram fetch failed for ${artist}`, err);
      }

      return {
        id: uniqueKey,
        artist,
        venue: r.venueName || "Unknown Venue",
        city,
        country,
        date: r.startsAt || null,
        url:
          r.callToActionRedirectUrl ||
          r.eventUrl ||
          r.nonPlusStreamingUrl ||
          null,
        bandsintown:
          r.eventUrl ||
          r.nonPlusStreamingUrl ||
          "https://www.bandsintown.com/",
        thumbnail:
          instagramProfile ||
          `https://tekkin-assets.s3.eu-central-1.amazonaws.com/${artist
            .toLowerCase()
            .replace(/\s+/g, "-")}-spotlight.jpg` ||
          "https://tekkin-assets.s3.eu-central-1.amazonaws.com/spotlight-placeholder.jpg",
      };
    } catch (err) {
      console.error("❌ JSON parse error", err);
      return null;
    }
  })
);


    return NextResponse.json({ success: true, data: mapped });
  } catch (err: any) {
    console.error("Spotlight fetch error:", err.message);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
