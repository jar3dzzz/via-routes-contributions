"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

// Type definition for a Waypoint
export interface Waypoint {
  latitude: number;
  longitude: number;
}

// Ensure the types match the SQL schema
export interface RouteData {
  nombre: string;
  waypoints: Waypoint[];
  id_mediotransporte: number;
  captchaToken: string;
  nombre_completo: string;
}

export async function createRoute(data: RouteData) {
  try {
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      throw new Error("Missing Captcha Secret Key configuration");
    }

    const verifyEndpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const requestParams = new URLSearchParams();
    requestParams.append("secret", turnstileSecret);
    requestParams.append("response", data.captchaToken);

    const captchaRes = await fetch(verifyEndpoint, {
      method: "POST",
      body: requestParams,
    });
    const captchaOutcome = await captchaRes.json();


    if (!captchaOutcome.success) {
      return { success: false, error: "Captcha validation failed. Please try again." };
    }

    // 2. Initialize Supabase Admin Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_LANDING;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY_LANDING;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get contributor IP address
    const headersList = await headers();
    const contributorIp = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    
    const waypointsToInsert = data.waypoints.map((wp, index) => ({
      latitude: wp.latitude,
      longitude: wp.longitude,
    }));

    const { data: routeData, error: routeError } = await supabase
      .from("LANDING_ROUTES")
      .insert({
        nombre: data.nombre,
        nombre_completo: data.nombre_completo,
        id_mediotransporte: data.id_mediotransporte,
        waypoints: waypointsToInsert,
      })

    if (routeError) {
      console.error("Supabase Route Error:", routeError);
      return { success: false, error: "Failed to save route to database." };
    }

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("Route Creation Error:", err);
    return { success: false, error: errorMsg };
  }
}
