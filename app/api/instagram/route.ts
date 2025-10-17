import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = process.env.IG_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({ success: false, error: "Missing Instagram token" });
  }

  // Prendiamo eventuali parametri: ?user=... o ?tag=...
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("user");
  const tag = searchParams.get("tag");

  try {
    // BASE: contenuti del profilo Tekkin (collegato con token)
    let endpoint = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp,media_type,username&access_token=${token}`;
    let data: any = [];

    // Se viene richiesto un tag o utente specifico → filtriamo
    const res = await fetch(endpoint);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error?.message || "Instagram API error");
    }

    data = json.data || [];

    // Se è specificato un tag o artista → filtriamo
    if (username) {
      data = data.filter((p: any) =>
        p.caption?.toLowerCase().includes(username.toLowerCase())
      );
    }

    if (tag) {
      data = data.filter((p: any) =>
        p.caption?.toLowerCase().includes(`#${tag.toLowerCase()}`)
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Instagram API error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}
