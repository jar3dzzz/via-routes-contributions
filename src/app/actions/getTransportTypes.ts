"use server";

import { createClient } from "@supabase/supabase-js";

export async function getTransportTypes() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: transportTypes, error } = await supabase
      .from("MEDIOSTRANSPORTE")
      .select("id_mediostransporte, nombre");

    if (error) {
      console.error("Supabase Transport Types Error:", error);
      return { success: false, error: "Failed to fetch transport types." };
    }

    return { success: true, data: transportTypes };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("Transport Types Fetch Error:", err);
    return { success: false, error: errorMsg };
  }
}
