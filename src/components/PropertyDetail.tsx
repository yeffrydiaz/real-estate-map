"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Property } from "@/lib/types";
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/data";
import MortgageCalculator from "./MortgageCalculator";
import VirtualTour from "./VirtualTour";

interface PropertyDetailProps {
  property: Property;
  onClose: () => void;
}

type Tab = "details" | "mortgage" | "tour";

export default function PropertyDetail({
  property,
  onClose,
}: PropertyDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const isForRent = property.status === "for_rent";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(
                  property.status
                )}`}
              >
                {getStatusLabel(property.status)}
              </span>
              <span className="capitalize text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {property.property_type.replace("_", " ")}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1 truncate">
              {property.address}
            </h2>
            <p className="text-sm text-gray-500">
              {property.city}, {property.state} {property.zip}
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {formatPrice(property.price, property.status)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 px-6 mt-3 pb-3 border-b border-gray-100">
          <Stat icon="🛏" value={property.bedrooms} label="Beds" />
          <Stat icon="🚿" value={property.bathrooms} label="Baths" />
          <Stat
            icon="📐"
            value={`${property.sqft.toLocaleString()} sqft`}
            label="Area"
          />
          {property.lot_size && (
            <Stat
              icon="🌿"
              value={`${property.lot_size.toLocaleString()} sqft`}
              label="Lot"
            />
          )}
          <Stat icon="🏗" value={property.year_built} label="Built" />
          <Stat icon="🚗" value={property.parking} label="Parking" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {(["details", "mortgage", "tour"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 mr-6 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "mortgage"
                ? "Mortgage Calc"
                : tab === "tour"
                ? "Virtual Tour"
                : "Details"}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {activeTab === "details" && (
            <div className="space-y-5">
              {/* Image Gallery */}
              {property.images.length > 0 && (
                <div className="space-y-2">
                  <div className="relative h-52 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={property.images[activeImageIndex]}
                      alt={`${property.address} photo ${activeImageIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="640px"
                    />
                  </div>
                  {property.images.length > 1 && (
                    <div className="flex gap-2">
                      {property.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImageIndex(i)}
                          className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                            i === activeImageIndex
                              ? "border-emerald-500"
                              : "border-transparent"
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  About This Property
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Features & Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors">
                  {isForRent ? "Apply Now" : "Schedule Showing"}
                </button>
                <button className="flex-1 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-sm font-semibold py-3 rounded-xl transition-colors">
                  Contact Agent
                </button>
              </div>
            </div>
          )}

          {activeTab === "mortgage" && (
            <MortgageCalculator defaultHomePrice={isForRent ? 500000 : property.price} />
          )}

          {activeTab === "tour" && <VirtualTour property={property} />}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-base">{icon}</span>
      <span className="text-xs font-semibold text-gray-800">{value}</span>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
}
