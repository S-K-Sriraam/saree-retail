import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://egcqtoibavhjvcdyzosw.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_leYxEdE8HaiBwLtTo5DT6Q_P58v7ly2";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let fileBuffer: Buffer;
    let mimeType = "image/jpeg";
    let extension = "jpg";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
      }

      mimeType = file.type || "image/jpeg";
      extension = mimeType.split("/")[1] || "jpg";
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      // JSON body with base64/dataUrl
      const body = await request.json();
      const rawData = body.dataUrl || body.image || body.base64;
      if (!rawData) {
        return NextResponse.json({ success: false, error: "No image data provided" }, { status: 400 });
      }

      if (rawData.startsWith("data:")) {
        const matches = rawData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          extension = mimeType.split("/")[1] || "jpg";
          fileBuffer = Buffer.from(matches[2], "base64");
        } else {
          fileBuffer = Buffer.from(rawData, "base64");
        }
      } else {
        fileBuffer = Buffer.from(rawData, "base64");
      }
    }

    // Clean extension
    if (extension === "jpeg") extension = "jpg";
    const filename = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

    // Upload to Supabase Storage bucket 'product-images'
    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/product-images/${filename}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": mimeType,
        "x-upsert": "true"
      },
      body: new Uint8Array(fileBuffer)
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Supabase Storage upload error:", uploadRes.status, errText);
      return NextResponse.json({ success: false, error: errText }, { status: 500 });
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
