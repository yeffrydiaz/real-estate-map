"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Property } from "@/lib/types";
import { MOCK_PROPERTIES } from "@/lib/data";
import PropertySidebar from "@/components/PropertySidebar";
import PropertyDetail from "@/components/PropertyDetail";

// Dynamically import the map to avoid SSR issues with mapbox-gl
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500">Loading map…</span>
      </div>
    </div>
  ),
});

export default function Home() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  function handlePropertySelect(property: Property) {
    setSelectedProperty(property);
  }

  function handleModalClose() {
    setSelectedProperty(null);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Navigation Bar */}
      <header className="flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏡</span>
          <span className="font-bold text-gray-900 text-base">
            Real Estate Map
          </span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="hidden sm:inline">
            {MOCK_PROPERTIES.length} properties listed
          </span>
          <span className="bg-emerald-100 text-emerald-700 font-medium px-2.5 py-1 rounded-full">
            Miami, FL
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
          <a href="#" className="hover:text-emerald-600 transition-colors">
            Buy
          </a>
          <a href="#" className="hover:text-emerald-600 transition-colors">
            Rent
          </a>
          <a href="#" className="hover:text-emerald-600 transition-colors">
            Sell
          </a>
        </nav>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          Sign In
        </button>
      </header>

      {/* Main Content: Sidebar + Map */}
      <main className="flex flex-1 overflow-hidden">
        {/* Property Sidebar */}
        <PropertySidebar
          properties={MOCK_PROPERTIES}
          selectedPropertyId={selectedProperty?.id ?? null}
          onPropertySelect={handlePropertySelect}
        />

        {/* Map */}
        <div className="flex-1 relative">
          <MapComponent
            properties={MOCK_PROPERTIES}
            selectedPropertyId={selectedProperty?.id ?? null}
            onPropertySelect={handlePropertySelect}
          />

          {/* Map Legend */}
          <div className="absolute bottom-8 right-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 text-xs space-y-1.5 z-10">
            <p className="font-semibold text-gray-700 text-[11px] uppercase tracking-wide mb-1">
              Legend
            </p>
            <LegendItem color="#10b981" label="For Sale" />
            <LegendItem color="#3b82f6" label="For Rent" />
            <LegendItem color="#f59e0b" label="Pending" />
            <LegendItem color="#6b7280" label="Sold" />
            <div className="border-t border-gray-200 pt-1.5 mt-1">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                  style={{ background: "#10b981" }}
                >
                  3
                </div>
                <span className="text-gray-500">Cluster</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail
          key={selectedProperty.id}
          property={selectedProperty}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-3 h-3 rounded-full border-2 border-white shadow"
        style={{ background: color }}
      />
      <span className="text-gray-500">{label}</span>
    </div>
  );
}
