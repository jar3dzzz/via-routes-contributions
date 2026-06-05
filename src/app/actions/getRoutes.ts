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
  name: string;
  description: string;
  transportType: string;
  waypoints: Waypoint[];
  captchaToken: string;
}

interface Route {
  route_id: number;
  name: string;
  description: string;
  transport_type: string;
  contributor_ip: string;
  created_at: string;
  updated_at: string;
}

export async function getRoutes() {
  try {
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
    const { data: routes, error: routeError } = await supabase
      .from("RUTAS")
      .select("*")

    if (routeError) {
      console.error("Supabase Route Error:", routeError);
      return { success: false, error: "Failed to save route to database." };
    }

    // Group routes by id_mediotransporte
    const groupedRoutes = routes.reduce((acc: any, route: any) => {
      const key = route.id_mediotransporte || 'Otro';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(route);
      return acc;
    }, {});

    return { success: true, data: groupedRoutes };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("Route Creation Error:", err);
    return { success: false, error: errorMsg };
  }
}
