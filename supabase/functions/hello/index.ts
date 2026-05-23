// Edge Function: hello
// Deploy with: supabase functions deploy hello
// URL: https://ojhfgfblwfvwnofoniuk.supabase.co/functions/v1/hello

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const now = new Date().toISOString()

  const payload = {
    message: "Hello from Supabase Edge Function! 🚀",
    status: "ok",
    function: "hello",
    timestamp: now,
    project: "ojhfgfblwfvwnofoniuk",
    deployedOn: "Coolify + Supabase Cloud",
  }

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  })
})
