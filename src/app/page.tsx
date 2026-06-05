"use client";

import RouteCreator from "@/components/mapping/RouteCreator";
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';
import { LandingPage } from '@/components/landing/LandingPage';
import { AboutUsScreen } from '@/views/AboutUsScreen';
import MapRoutes from '@/views/rutas';
import dynamic from 'next/dynamic';

const ClientRouter = dynamic(
  () =>
    Promise.resolve(() => (
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsScreen />} />
          <Route path="/maping" element={<RouteCreator />} />
          <Route path="/rutas" element={<MapRoutes />} />
        </Routes>
      </HashRouter>
    )),
  { ssr: false }
);

export default function Home() {
  return <ClientRouter />;
}