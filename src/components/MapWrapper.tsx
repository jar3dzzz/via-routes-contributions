"use client";

import dynamic from "next/dynamic";
import { Waypoint } from "@/app/actions/createRoute";

// Dynamically import the Map component, disabling SSR
const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex flex-col items-center text-gray-500">
        <svg className="w-8 h-8 animate-spin mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-medium">Cargando Mapa...</span>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  waypoints: Waypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <DynamicMap {...props} />;
}
