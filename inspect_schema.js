const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://sgdpvtsirtwfhnuqttst.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnZHB2dHNpcnR3ZmhudXF0dHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzcwMTksImV4cCI6MjA5NTY1MzAxOX0.hf0NSV1kLbyjU9PGB1VtNemhIFKmeroZmLG7I8TYOZc";

const supabase = createClient(supabaseUrl, key);

async function testInsert() {
  console.log("Attempting to insert test route...");
  const { data: route, error: routeError } = await supabase
    .from("tb_routes")
    .insert({
      name: "Test Route",
      description: "Test Description",
      transport_type: "bus",
      contributor_ip: "127.0.0.1"
    })
    .select("route_id")
    .single();

  if (routeError) {
    console.error("Route Insertion Failed:", routeError);
    return;
  }
  
  console.log("Route Insertion Succeeded. route_id:", route.route_id);

  console.log("Attempting to insert test waypoint...");
  const { data: waypoint, error: waypointError } = await supabase
    .from("tb_waypoints")
    .insert({
      route_id: route.route_id,
      latitude: 19.4326,
      longitude: -99.1332,
      step_order: 1
    })
    .select("waypoints_id")
    .single();

  if (waypointError) {
    console.error("Waypoint Insertion Failed:", waypointError);
  } else {
    console.log("Waypoint Insertion Succeeded. waypoints_id:", waypoint.waypoints_id);
  }

  // Cleanup
  console.log("Cleaning up test data...");
  const { error: deleteWpError } = await supabase
    .from("tb_waypoints")
    .delete()
    .eq("route_id", route.route_id);
  console.log("Waypoint delete:", { deleteWpError });

  const { error: deleteRouteError } = await supabase
    .from("tb_routes")
    .delete()
    .eq("route_id", route.route_id);
  console.log("Route delete:", { deleteRouteError });
}

testInsert().catch(console.error);
