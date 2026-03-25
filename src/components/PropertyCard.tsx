"use client";

import Image from "next/image";
import { Property } from "@/lib/types";
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/data";

interface PropertyCardProps {
  property: Property;
  isSelected: boolean;
  onClick: (property: Property) => void;
}

export default function PropertyCard({
  property,
  isSelected,
  onClick,
}: PropertyCardProps) {
  return (
    <button
      onClick={() => onClick(property)}
      className={`w-full text-left rounded-xl overflow-hidden border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
        isSelected
          ? "border-emerald-500 shadow-md ring-2 ring-emerald-500"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100">
        {property.images.length > 0 ? (
          <Image
            src={property.images[0]}
            alt={property.address}
            fill
            className="object-cover"
            sizes="(max-width: 400px) 100vw, 400px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🏠</span>
          </div>
        )}
        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
            property.status
          )}`}
        >
          {getStatusLabel(property.status)}
        </span>
        <span className="absolute top-2 right-2 text-xs font-bold bg-white/90 text-gray-900 px-2 py-1 rounded-full shadow">
          {formatPrice(property.price, property.status)}
        </span>
      </div>

      {/* Details */}
      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm truncate">
          {property.address}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {property.city}, {property.state} {property.zip}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <BedIcon /> {property.bedrooms} bd
          </span>
          <span className="flex items-center gap-1">
            <BathIcon /> {property.bathrooms} ba
          </span>
          <span className="flex items-center gap-1">
            <RulerIcon /> {property.sqft.toLocaleString()} sqft
          </span>
        </div>
        <div className="mt-2">
          <span className="capitalize text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {property.property_type.replace("_", " ")}
          </span>
        </div>
      </div>
    </button>
  );
}

function BedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M3 12v7M21 12v7M3 12h18M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5H3z" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M9 6a3 3 0 0 1 6 0v2H9V6zM3 10h18v4a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-4z" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M21 3H3v18l18-18zM3 3l18 18" />
    </svg>
  );
}
