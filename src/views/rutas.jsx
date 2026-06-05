"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Map as MapIcon } from "lucide-react";

import { Waypoint } from "@/app/actions/createRoute";
import { getRoutes } from "@/app/actions/getRoutes";
import MapWrapper from "@/components/mapping/MapWrapper";
export default function MapRoutes() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [routes, setRoutes] = useState();
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [selectedRoute,setSelectedRoute] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      const { data, error } = await getRoutes();
      console.log(data,'ola');
      if (error) {
        console.error("Error al obtener rutas:", error);
      } else {
        setRoutes(data);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-76px)] lg:h-[calc(100vh-76px)] mt-[76px] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        {/* Map Section */}
        <div className="flex-1 lg:w-2/3 h-1/2 lg:h-full p-4 relative z-0">
          <MapWrapper waypoints={selectedRoute} setWaypoints={setSelectedRoute} mappingTool={false} />
        </div>
        {/* Form Section */}
        <div className="w-full lg:w-1/3 h-1/2 lg:h-full flex-shrink-0 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)] flex flex-col bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <MapIcon className="w-6 h-6 text-blue-500" />
              Estatus de Rutas
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Lista de rutas y su estado de mapeo en el sistema.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 transition-all">
              <button
                onClick={() => setIsListExpanded(!isListExpanded)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                  <MapIcon   className="w-5 h-5 text-blue-500" /> 
                  Rutas Registradas ({routes ? Object.values(routes).flat().length : 0})
                </span>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 text-zinc-400 transition-transform ${isListExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {isListExpanded && (
                <div className="p-4 pt-0 border-t border-zinc-200 dark:border-zinc-800 mt-2 bg-white dark:bg-zinc-950 flex flex-col gap-4 max-h-[60vh] overflow-y-auto overflow-x-hidden">
                  {!routes ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : Object.keys(routes).length === 0 ? (
                    <p className="text-zinc-500 text-center py-4 text-sm">No hay rutas disponibles.</p>
                  ) : (
                    Object.entries(routes).map(([transportId, groupRoutes]) => (
                      <div key={transportId} className="flex flex-col gap-2">
                        <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1 border-b border-zinc-100 dark:border-zinc-800 pb-1">
                          Medio de Transporte: {transportId}
                        </h3>
                        {groupRoutes.map((route, idx) => {
                          const isMapeado = route.mapeado;
                          return (
                            <div 
                              key={idx} 
                              onClick={() => {
                                if (!isMapeado) {
                                  navigate('/maping', { state: { routeName: route.nombre || route.name } });
                                  return;
                                }
                                try {
                                  let wp = route.waypoints;
                                  if (typeof wp === 'string') {
                                    wp = JSON.parse(wp);
                                  }
                                  
                                  if (Array.isArray(wp)) {
                                    const formattedWaypoints = wp.map(p => ({
                                      latitude: Number(p.latitude ?? p.lat),
                                      longitude: Number(p.longitude ?? p.lng)
                                    }));
                                    setSelectedRoute(formattedWaypoints);
                                    console.log("Mapped Waypoints:", formattedWaypoints);
                                  }
                                } catch (e) {
                                  console.error("Error parsing waypoints", e);
                                }
                              }}
                              className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isMapeado ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                                <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200 truncate pr-2">{route.nombre || route.name || 'Sin nombre'}</span>
                              </div>
                              {isMapeado ? (
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                                  Mapeado
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                                  No Mapeado
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
