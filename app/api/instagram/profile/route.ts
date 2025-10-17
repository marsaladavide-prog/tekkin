import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const token = process.env.IG_ACCESS_TOKEN;
    const businessId = process.env.IG_BUSINESS_ID;

    if (!token || !businessId) {
      return NextResponse.json(
        { success: false, error: "Missing IG credentials" },
        { status: 400 }
      );
    }

    // 🔹 Step 1: prendi l’account Instagram collegato alla pagina Business
    const accountsRes = await fetch(
      `https://graph.facebook.com/v21.0/${businessId}?fields=instagram_business_account&access_token=${token}`
    );
    const accounts = await accountsRes.json();

    const igAccountId = accounts?.instagram_business_account?.id;
    if (!igAccountId) {
      return NextResponse.json(
        { success: false, error: "No connected Instagram account found" },
        { status: 400 }
      );
    }

    // 🔹 Step 2: prendi le info del profilo collegato
    const profileRes = await fetch(
      `https://graph.facebook.com/v21.0/${igAccountId}?fields=username,profile_picture_url,followers_count,media_count&access_token=${token}`
    );
    const profile = await profileRes.json();

    return NextResponse.json({ success: true, data: profile });
  } catch (err: any) {
    console.error("IG API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
