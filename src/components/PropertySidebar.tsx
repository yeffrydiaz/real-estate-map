"use client";

import { useMemo, useState } from "react";
import { Property, PropertyFilters } from "@/lib/types";
import PropertyCard from "./PropertyCard";

const DEFAULT_FILTERS: PropertyFilters = {
  minPrice: 0,
  maxPrice: 10_000_000,
  bedrooms: null,
  bathrooms: null,
  propertyType: "all",
  status: "all",
  minSqft: 0,
  maxSqft: 10_000,
};

interface PropertySidebarProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onPropertySelect: (property: Property) => void;
  onFiltersChange?: (filters: PropertyFilters) => void;
}

export default function PropertySidebar({
  properties,
  selectedPropertyId,
  onPropertySelect,
  onFiltersChange,
}: PropertySidebarProps) {
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (
        filters.status !== "all" &&
        p.status !== filters.status
      )
        return false;
      if (
        filters.propertyType !== "all" &&
        p.property_type !== filters.propertyType
      )
        return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice)
        return false;
      if (filters.bedrooms !== null && p.bedrooms < filters.bedrooms)
        return false;
      if (filters.bathrooms !== null && p.bathrooms < filters.bathrooms)
        return false;
      if (p.sqft < filters.minSqft || p.sqft > filters.maxSqft) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.address.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.zip.includes(q)
        );
      }

      return true;
    });
  }, [properties, filters, searchQuery]);

  function updateFilter<K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFiltersChange?.(next);
  }

  return (
    <aside className="flex flex-col w-80 h-full bg-white border-r border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">
            Properties{" "}
            <span className="text-sm font-normal text-gray-400">
              ({filteredProperties.length})
            </span>
          </h2>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
              showFilters
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <FilterIcon />
            Filters
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search address, city, zip…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 space-y-3 text-sm">
          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                updateFilter(
                  "status",
                  e.target.value as PropertyFilters["status"]
                )
              }
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="all">All</option>
              <option value="for_sale">For Sale</option>
              <option value="for_rent">For Rent</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) =>
                updateFilter(
                  "propertyType",
                  e.target.value as PropertyFilters["propertyType"]
                )
              }
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="all">All Types</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* Min Bedrooms */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Min Bedrooms
            </label>
            <select
              value={filters.bedrooms ?? ""}
              onChange={(e) =>
                updateFilter(
                  "bedrooms",
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setFilters(DEFAULT_FILTERS);
              onFiltersChange?.(DEFAULT_FILTERS);
            }}
            className="w-full text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Property List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm">No properties match your criteria</p>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSelected={property.id === selectedPropertyId}
              onClick={onPropertySelect}
            />
          ))
        )}
      </div>
    </aside>
  );
}

function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M22 3H2l8 9.46V19l4 2V12.46L22 3z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
