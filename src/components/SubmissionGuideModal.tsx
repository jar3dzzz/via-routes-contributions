"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { X, MapPin, Route, Send, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SubmissionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
}

export default function SubmissionGuideModal({
  isOpen,
  onClose,
  captchaToken,
  setCaptchaToken,
}: SubmissionGuideModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const renderTimer = setTimeout(() => {
        setShouldRender(true);
      }, 0);
      const animateTimer = setTimeout(() => setAnimate(true), 10);
      return () => {
        clearTimeout(renderTimer);
        clearTimeout(animateTimer);
      };
    } else {
      const animateTimer = setTimeout(() => {
        setAnimate(false);
      }, 0);
      const renderTimer = setTimeout(() => setShouldRender(false), 300);
      return () => {
        clearTimeout(animateTimer);
        clearTimeout(renderTimer);
      };
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 transition-all duration-300 ${
        animate ? "opacity-100 backdrop-blur-md" : "opacity-0 backdrop-blur-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative overflow-hidden transition-all duration-300 flex flex-col gap-6 ${
          animate ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 dark:bg-blue-950/50 rounded-lg text-blue-600 dark:text-blue-400">
                <Route className="w-5 h-5" />
              </span>
              Guía del Colaborador
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Aprende cómo trazar y compartir una ruta en tres sencillos pasos.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Cerrar guía"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4">
          {/* Step 1 */}
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-500 animate-bounce" />
                Colocar Puntos de Ruta
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Haz clic directamente en el mapa para colocar marcadores. Necesitas al menos <strong>2 puntos</strong> (punto de partida y de llegada) para definir una ruta.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Route className="w-4 h-4 text-indigo-500" />
                Proporcionar Detalles
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                En el panel derecho, dale un nombre a tu ruta (ej., &quot;Línea 3 Local&quot;), una descripción del trayecto y selecciona el tipo de transporte.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-green-500" />
                Verificar y Enviar
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Completa la verificación de seguridad a continuación, luego cierra esta guía y haz clic en <strong>Enviar Ruta</strong> para publicarla.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5 flex flex-col items-center gap-3">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Verificación de Seguridad
          </span>
          <div className="min-h-[65px] w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onSuccess={(token) => setCaptchaToken(token)}
                options={{ theme: "auto" }}
              />
            ) : (
              <div className="text-xs text-red-500 p-2 border border-red-200 rounded">
                Falta NEXT_PUBLIC_TURNSTILE_SITE_KEY.
              </div>
            )}
          </div>

          {captchaToken && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-1.5 rounded-full border border-green-200/50 dark:border-green-900/30 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span>Verificación completa. Ya puedes cerrar la guía y realizar el envío.</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 px-4 rounded-xl font-medium shadow-md transition-all duration-300 ${
            captchaToken
              ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-[0.98]"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
          }`}
          disabled={!captchaToken}
        >
          {captchaToken ? "¡Entendido, a trazar!" : "Por favor, completa la verificación primero"}
        </button>
      </div>
    </div>
  );
}
