"use client";

import { useEffect, useRef, useState } from "react";
import { Waypoint } from "@/app/actions/createRoute";

interface MapProps {
  waypoints: Waypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBDMouePKj87yhZ5iwg5ZNzgeZP-Ogien4";

let scriptLoadingPromise: Promise<void> | null = null;

function loadGoogleMapsScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();

  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoadingPromise = null;
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

const lightMapStyles = [
  {
    featureType: "all",
    elementType: "geometry.fill",
    stylers: [{ weight: "2.00" }],
  },
  {
    featureType: "all",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e0e0e0" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [{ color: "#fefefe" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffe0b2" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e0f2f1" }]
  }
];

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#18181b" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a1a1aa" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#18181b" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#3f3f46" }] },
  { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#09090b" }] },
  { featureType: "landscape.natural", elementType: "geometry.fill", stylers: [{ color: "#09090b" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#18181b" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#71717a" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#27272a" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#3f3f46" }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#3f3f46" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#52525b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#09090b" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3b82f6" }] }
];

export default function Map({ waypoints, setWaypoints }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const [travelMode, setTravelMode] = useState<"DRIVING" | "WALKING" | "SNAPPED">("DRIVING");
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [isRouting, setIsRouting] = useState(false);

  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Load Google Maps API Script
  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setScriptLoaded(true))
      .catch(() => {
        setScriptError(true);
      });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || map) return;

    const defaultCenter = { lat: 17.976116, lng: -92.963802 };
    const center = waypoints.length > 0 ? waypoints[waypoints.length - 1] : defaultCenter;

    const isDark = document.documentElement.classList.contains("dark");

    const mapInstance = new window.google.maps.Map(containerRef.current, {
      center: center,
      zoom: 16,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      styles: isDark ? darkMapStyles : lightMapStyles,
    });

    setMap(mapInstance);
  }, [scriptLoaded, map, waypoints]);

  // Sync Dark/Light Mode styles dynamically
  useEffect(() => {
    if (!map) return;

    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      map.setOptions({ styles: isDark ? darkMapStyles : lightMapStyles });
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [map]);

  // Handle map click events to add waypoints
  useEffect(() => {
    if (!map) return;

    const clickListener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setWaypoints((prev) => [...prev, { lat, lng }]);
      }
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, setWaypoints]);

  // Calculate route path
  const calculateRoute = async (points: Waypoint[], mode: "DRIVING" | "WALKING" | "SNAPPED") => {
    if (points.length < 2) {
      return points;
    }

    if (mode === "SNAPPED") {
      const chunkSize = 100;
      let allSnappedPoints: google.maps.LatLngLiteral[] = [];

      for (let i = 0; i < points.length; i += chunkSize) {
        const chunk = points.slice(i, i + chunkSize);
        const pathValues = chunk.map((p) => `${p.lat},${p.lng}`).join("|");

        try {
          const response = await fetch(
            `https://roads.googleapis.com/v1/snapToRoads?path=${pathValues}&interpolate=true&key=${GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();

          if (data.snappedPoints) {
            const snappedChunk = data.snappedPoints.map((point: { location: { latitude: number; longitude: number } }) => ({
              lat: point.location.latitude,
              lng: point.location.longitude,
            }));
            allSnappedPoints = [...allSnappedPoints, ...snappedChunk];
          }
        } catch (error) {
          console.error("Error snapping to roads:", error);
        }
      }

      if (allSnappedPoints.length > 0) {
        return allSnappedPoints;
      }
      return points;
    }

    return new Promise<google.maps.LatLngLiteral[]>((resolve) => {
      const directionsService = new window.google.maps.DirectionsService();

      const origin = points[0];
      const destination = points[points.length - 1];
      const intermediatePoints = points.slice(1, -1);
      const waypointsList = intermediatePoints.map((p) => ({
        location: new window.google.maps.LatLng(p.lat, p.lng),
        stopover: true,
      }));

      directionsService.route(
        {
          origin: new window.google.maps.LatLng(origin.lat, origin.lng),
          destination: new window.google.maps.LatLng(destination.lat, destination.lng),
          waypoints: waypointsList,
          travelMode: window.google.maps.TravelMode[mode],
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result && result.routes.length > 0) {
            const path = result.routes[0].overview_path.map((p) => ({
              lat: p.lat(),
              lng: p.lng(),
            }));
            resolve(path);
          } else {
            console.error(`Directions request failed due to ${status}`);
            resolve(points);
          }
        }
      );
    });
  };

  // Recalculate route path when waypoints or travelMode changes
  useEffect(() => {
    if (!map) return;

    let active = true;

    const fetchRoute = async () => {
      if (waypoints.length < 2) {
        // Run asynchronously to satisfy set-state-in-effect lint rule
        await Promise.resolve();
        if (active) setRoutePath(waypoints);
        return;
      }

      if (active) setIsRouting(true);
      try {
        const path = await calculateRoute(waypoints, travelMode);
        if (active) setRoutePath(path);
      } finally {
        if (active) setIsRouting(false);
      }
    };

    fetchRoute();

    return () => {
      active = false;
    };
  }, [map, waypoints, travelMode]);

  // Update Markers when waypoints change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Create markers for each waypoint
    waypoints.forEach((wp, i) => {
      const isStart = i === 0;
      const isEnd = i === waypoints.length - 1;

      let strokeColor = "#3b82f6";
      let fillColor = "white";

      if (isStart) {
        strokeColor = "#10b981";
        fillColor = "#10b981";
      } else if (isEnd) {
        strokeColor = "#ef4444";
        fillColor = "#ef4444";
      }

      const marker = new window.google.maps.Marker({
        position: wp,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: fillColor,
          fillOpacity: 1.0,
          strokeColor: strokeColor,
          strokeWeight: 2,
          scale: 6,
        },
        title: isStart ? "Punto de salida" : isEnd ? "Punto de llegada" : `Punto ${i + 1}`,
      });

      markersRef.current.push(marker);
    });

    // Center map on the last waypoint if it was added
    if (waypoints.length > 0) {
      const lastWp = waypoints[waypoints.length - 1];
      map.panTo(lastWp);
    }
  }, [map, waypoints]);

  // Update Polyline when routePath changes
  useEffect(() => {
    if (!map) return;

    // Clear existing polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // Create polyline connecting routePath
    if (routePath.length > 1) {
      polylineRef.current = new window.google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: "#3b82f6",
        strokeOpacity: isRouting ? 0.4 : 0.8,
        strokeWeight: 4,
        map: map,
      });
    }
  }, [map, routePath, isRouting]);

  if (scriptError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl border border-red-200 dark:border-red-800">
        <span className="text-sm font-medium">Error al cargar Google Maps</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl shadow-inner border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900">
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: "350px" }} />

      {/* Route Mode Selector */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2 max-w-[380px]">
        <div className="flex items-center justify-between gap-2.5">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap flex items-center gap-1.5">
            {isRouting ? (
              <svg className="w-3.5 h-3.5 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            )}
            Modo de Ruta:
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setTravelMode("DRIVING")}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                travelMode === "DRIVING"
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-800/50"
              }`}
            >
              <span>🚗</span>
              <span>Auto</span>
            </button>
            <button
              type="button"
              onClick={() => setTravelMode("WALKING")}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                travelMode === "WALKING"
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-800/50"
              }`}
            >
              <span>🚶</span>
              <span>Caminando</span>
            </button>
            <button
              type="button"
              onClick={() => setTravelMode("SNAPPED")}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                travelMode === "SNAPPED"
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-800/50"
              }`}
            >
              <span>🛣️</span>
              <span>Snapped</span>
            </button>
          </div>
        </div>
        <p className="text-[10px] leading-normal text-zinc-500 dark:text-zinc-400 border-t border-zinc-150/40 dark:border-zinc-900 pt-1.5">
          ℹ️ <strong className="font-medium text-zinc-600 dark:text-zinc-300">Nota:</strong> El transporte público a veces no sigue las reglas viales estándar de Google Maps (vías en contraflujo o carriles exclusivos). Si la ruta no sigue el trazado deseado, prueba a alternar el modo o usa <span className="font-semibold text-blue-600 dark:text-blue-400">Snapped</span> para trazar directamente por las calles sin restricciones de sentido.
        </p>
      </div>

      {/* Overlay to show instructions */}
      {waypoints.length === 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md z-10 text-sm font-medium animate-pulse text-gray-700 dark:text-gray-300">
          Haz clic en el mapa para añadir el primer punto de ruta
        </div>
      )}
    </div>
  );
}
