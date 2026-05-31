"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

// Type definition for a Waypoint
export interface Waypoint {
  lat: number;
  lng: number;
}

// Ensure the types match the SQL schema
export interface RouteData {
  name: string;
  description: string;
  transportType: string;
  waypoints: Waypoint[];
  captchaToken: string;
}

export async function createRoute(data: RouteData) {
  try {
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      throw new Error("Missing Captcha Secret Key configuration");
    }

    console.log("DIAGNOSTIC: active TURNSTILE_SECRET_KEY:", {
      length: turnstileSecret.length,
      value: turnstileSecret,
      tokenPreview: data.captchaToken ? data.captchaToken.slice(0, 15) + "..." : null
    });

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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get contributor IP address
    const headersList = await headers();
    const contributorIp = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    // 3. Insert route into tb_routes
    const { data: routeData, error: routeError } = await supabase
      .from("tb_routes")
      .insert({
        name: data.name,
        description: data.description,
        transport_type: data.transportType,
        contributor_ip: contributorIp,
      })
      .select("route_id")
      .single();

    if (routeError) {
      console.error("Supabase Route Error:", routeError);
      return { success: false, error: "Failed to save route to database." };
    }

    const routeId = routeData.route_id;

    // 4. Insert waypoints into tb_waypoints
    const waypointsToInsert = data.waypoints.map((wp, index) => ({
      route_id: routeId,
      latitude: wp.lat,
      longitude: wp.lng,
      step_order: index + 1,
    }));

    const { error: waypointsError } = await supabase
      .from("tb_waypoints")
      .insert(waypointsToInsert);

    if (waypointsError) {
      console.error("Supabase Waypoints Error:", waypointsError);
      // Rollback route insertion to keep DB clean
      await supabase.from("tb_routes").delete().eq("route_id", routeId);
      return { success: false, error: "Failed to save route waypoints." };
    }

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("Route Creation Error:", err);
    return { success: false, error: errorMsg };
  }
}
