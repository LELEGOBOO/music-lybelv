import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS ayarları
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: CORS_HEADERS }
    );
  }

  try {
    const body = await req.json();

    const PROJECT_URL = Deno.env.get("PROJECT_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");

if (!PROJECT_URL || !SERVICE_ROLE_KEY) {
  return new Response(
    JSON.stringify({ success: false, error: "Server not configured" }),
    { status: 500, headers: CORS_HEADERS }
  );
}

const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY);

    // Kullanıcının IP adresi (otomatik)
    const forwarded = req.headers.get("x-forwarded-for") ?? "";
    const ipFromHeader = forwarded.split(",")[0].trim();
    const ip = ipFromHeader || (req.headers.get("x-real-ip") ?? "unknown");

    // Formdan gelen veriler
    const payload = {
      name: body.name ?? null,
      email: body.email ?? null,
      message: body.message ?? null,
      phone: body.phone ?? null,
      ip, // kullanıcıya sormuyoruz, backend’de ekliyoruz
    };

    // Supabase'e kaydet
    const { error } = await supabase.from("contacts").insert([payload]);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
});
