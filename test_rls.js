const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://sgdpvtsirtwfhnuqttst.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnZHB2dHNpcnR3ZmhudXF0dHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzcwMTksImV4cCI6MjA5NTY1MzAxOX0.hf0NSV1kLbyjU9PGB1VtNemhIFKmeroZmLG7I8TYOZc";

const supabase = createClient(supabaseUrl, key);

async function run() {
  const cases = [
    {
      desc: "Autobús, default is_verified",
      data: {
        name: "Test Route",
        description: "Test",
        transport_type: "Autobús",
        contributor_ip: "127.0.0.1"
      }
    },
    {
      desc: "Autobús, is_verified: false",
      data: {
        name: "Test Route",
        description: "Test",
        transport_type: "Autobús",
        contributor_ip: "127.0.0.1",
        is_verified: false
      }
    },
    {
      desc: "Autobús, no contributor_ip, is_verified: false",
      data: {
        name: "Test Route",
        description: "Test",
        transport_type: "Autobús",
        is_verified: false
      }
    },
    {
      desc: "Autobús, is_verified: true (should fail RLS if only admin can verify)",
      data: {
        name: "Test Route",
        description: "Test",
        transport_type: "Autobús",
        contributor_ip: "127.0.0.1",
        is_verified: true
      }
    }
  ];

  for (const c of cases) {
    const { data, error } = await supabase
      .from("tb_routes")
      .insert(c.data)
      .select("route_id")
      .single();
    
    console.log(`${c.desc}:`, { data, error });
    if (!error) {
      // clean up
      await supabase.from("tb_routes").delete().eq("route_id", data.route_id);
    }
  }
}

run().catch(console.error);
