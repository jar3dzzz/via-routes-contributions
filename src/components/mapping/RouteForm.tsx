"use client";

import { useState, useEffect, useTransition } from "react";
import { useLocation } from "react-router-dom";
import { createRoute, Waypoint } from "@/app/actions/createRoute";
import { getTransportTypes } from "@/app/actions/getTransportTypes";
import { MapPin, Route, Send, Undo2, XCircle, ShieldCheck, ShieldAlert, Info } from "lucide-react";

interface RouteFormProps {
  waypoints: Waypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
  onOpenGuide: () => void;
}

export default function RouteForm({
  waypoints,
  setWaypoints,
  captchaToken,
  setCaptchaToken,
  onOpenGuide,
}: RouteFormProps) {
  const location = useLocation();
  const initialName = location.state?.routeName || "";
  const [nombre, setNombre] = useState(initialName);
  const [transportType, setTransportType] = useState<number | "">("");
  const [transportTypes, setTransportTypes] = useState<{ id_mediostransporte: number, nombre: string }[]>([]);

  useEffect(() => {
    async function fetchTypes() {
      const result = await getTransportTypes();
      if (result.success && result.data) {
        setTransportTypes(result.data);
        if (result.data.length > 0) {
          setTransportType(result.data[0].id_mediostransporte);
        }
      }
    }
    fetchTypes();
  }, []);
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (waypoints.length < 2) {
      setError("Por favor, añade al menos 2 puntos de ruta en el mapa.");
      return;
    }

    if (!captchaToken) {
      setError("Por favor, completa el captcha de seguridad.");
      return;
    }

    startTransition(async () => {
      const result = await createRoute({
        nombre,
        nombre_completo: nombre,
        id_mediotransporte: Number(transportType),
        waypoints,
        captchaToken,
      });

      if (result.success) {
        setSuccess(true);
        setNombre("");
        if (transportTypes.length > 0) {
          setTransportType(transportTypes[0].id_mediostransporte);
        }
        setWaypoints([]);
        setCaptchaToken(null);
      } else {
        setError(result.error || "Error al crear la ruta.");
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Route className="w-6 h-6 text-blue-500" />
          Crear Ruta
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Traza rutas de transporte público y compártelas con la comunidad.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Nombre de la Ruta
          </label>
          <input
            type="text"
            id="nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-zinc-100"
            placeholder="ej. Expreso Centro"
          />
        </div>



        <div>
          <label htmlFor="transportType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Tipo de Transporte
          </label>
          <select
            id="transportType"
            value={transportType}
            onChange={(e) => setTransportType(Number(e.target.value))}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-zinc-100"
          >
            {transportTypes.map((type) => (
              <option key={type.id_mediostransporte} value={type.id_mediostransporte}>
                {type.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Waypoints Summary */}
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-500" />
              Puntos de Ruta ({waypoints.length})
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setWaypoints((wp) => wp.slice(0, -1))}
                disabled={waypoints.length === 0}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-50 transition-colors"
                title="Deshacer último punto"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setWaypoints([])}
                disabled={waypoints.length === 0}
                className="text-zinc-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                title="Limpiar todo"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {waypoints.length < 2
              ? "Haz clic en el mapa para añadir al menos 2 puntos."
              : "Listo para guardar."}
          </div>
        </div>

        {/* Verification Status */}
        <div className="mt-auto pt-4 border-t border-zinc-150 dark:border-zinc-800">
          {captchaToken ? (
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-xl text-green-800 dark:text-green-300">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-green-500 animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">Seguridad Verificada</p>
                <p className="text-[10px] text-green-600 dark:text-green-400">Listo para enviar ruta</p>
              </div>
              <button
                type="button"
                onClick={onOpenGuide}
                className="text-[10px] font-semibold text-green-700 dark:text-green-400 hover:underline cursor-pointer"
              >
                Ver Pasos
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-zinc-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Verificación Requerida</p>
                  <p className="text-[10px] leading-normal text-zinc-500 dark:text-zinc-400">
                    Completa el captcha para habilitar el envío de la ruta.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenGuide}
                className="w-full mt-1 py-2 px-3 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-lg transition-colors border border-blue-100/50 dark:border-blue-900/30 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                Verificar y Ver Guía
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800/50">
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800/50">
            ¡Ruta creada con éxito!
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || waypoints.length < 2 || !captchaToken}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
        >
          {isPending ? (
            <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Send className="w-5 h-5" />
          )}
          {isPending ? "Guardando..." : "Enviar Ruta"}
        </button>
      </form>
    </div>
  );
}
