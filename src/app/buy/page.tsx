"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Property } from "@/lib/types";
import { MOCK_PROPERTIES } from "@/lib/data";
import PropertySidebar from "@/components/PropertySidebar";
import PropertyDetail from "@/components/PropertyDetail";
import Header from "@/components/Header";

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

const FOR_SALE_PROPERTIES = MOCK_PROPERTIES.filter(
  (p) => p.status === "for_sale"
);

export default function BuyPage() {
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
      <Header />

      {/* Page title strip */}
      <div className="flex-shrink-0 bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center gap-3">
        <span className="text-emerald-700 font-semibold text-sm">
          🏠 Homes for Sale
        </span>
        <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
          {FOR_SALE_PROPERTIES.length} listings
        </span>
      </div>

      {/* Main Content: Sidebar + Map */}
      <main className="flex flex-1 overflow-hidden">
        <PropertySidebar
          properties={FOR_SALE_PROPERTIES}
          selectedPropertyId={selectedProperty?.id ?? null}
          onPropertySelect={handlePropertySelect}
        />

        <div className="flex-1 relative">
          <MapComponent
            properties={FOR_SALE_PROPERTIES}
            selectedPropertyId={selectedProperty?.id ?? null}
            onPropertySelect={handlePropertySelect}
          />

          <div className="absolute bottom-8 right-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 text-xs space-y-1.5 z-10">
            <p className="font-semibold text-gray-700 text-[11px] uppercase tracking-wide mb-1">
              Legend
            </p>
            <LegendItem color="#10b981" label="For Sale" />
            <LegendItem color="#f59e0b" label="Pending" />
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
