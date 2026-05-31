"use client";

import { useState } from "react";
import MapWrapper from "./MapWrapper";
import RouteForm from "./RouteForm";
import SubmissionGuideModal from "./SubmissionGuideModal";
import { Waypoint } from "@/app/actions/createRoute";

export default function RouteCreator() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-64px)] lg:h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        {/* Map Section */}
        <div className="flex-1 lg:w-2/3 h-1/2 lg:h-full p-4 relative z-0">
          <MapWrapper waypoints={waypoints} setWaypoints={setWaypoints} />
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/3 h-1/2 lg:h-full flex-shrink-0 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)]">
          <RouteForm
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            captchaToken={captchaToken}
            setCaptchaToken={setCaptchaToken}
            onOpenGuide={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      <SubmissionGuideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        captchaToken={captchaToken}
        setCaptchaToken={setCaptchaToken}
      />
    </>
  );
}
