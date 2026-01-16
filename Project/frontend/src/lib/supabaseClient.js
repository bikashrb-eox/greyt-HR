import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// DEV DEBUG: verify env vars are loaded and look reasonable
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase env vars missing:", { supabaseUrl, hasAnonKey: !!supabaseAnonKey });
} else {
  // Log only a prefix of the anon key to avoid leaking the full key
  console.info("Supabase config:", { supabaseUrl, supabaseAnonKeyPrefix: supabaseAnonKey.slice(0, 10) });
}

if (typeof supabaseAnonKey === "string" && !supabaseAnonKey.startsWith("sb_")) {
  console.warn("Supabase anon key may be incorrect (doesn't start with 'sb_'). Ensure you're using the anon/public key from Supabase.");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
