"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Property, PropertyGeoJSONCollection, MapViewState } from "@/lib/types";
import { toGeoJSON } from "@/lib/data";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
const SOURCE_ID = "properties";

// Cluster paint & layout configuration
const CLUSTER_CIRCLE_PAINT: mapboxgl.CirclePaint = {
  "circle-color": [
    "step",
    ["get", "point_count"],
    "#10b981", // emerald-500 for small clusters
    10,
    "#f59e0b", // amber-500 for medium clusters
    50,
    "#ef4444", // red-500 for large clusters
  ],
  "circle-radius": [
    "step",
    ["get", "point_count"],
    20,
    10,
    28,
    50,
    36,
  ],
  "circle-stroke-width": 2,
  "circle-stroke-color": "#ffffff",
  "circle-opacity": 0.9,
};

const CLUSTER_LABEL_LAYOUT: mapboxgl.SymbolLayout = {
  "text-field": ["get", "point_count_abbreviated"],
  "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
  "text-size": 13,
};

const CLUSTER_LABEL_PAINT: mapboxgl.SymbolPaint = {
  "text-color": "#ffffff",
};

const UNCLUSTERED_POINT_PAINT: mapboxgl.CirclePaint = {
  "circle-color": [
    "match",
    ["get", "status"],
    "for_sale",
    "#10b981",
    "for_rent",
    "#3b82f6",
    "pending",
    "#f59e0b",
    "sold",
    "#6b7280",
    "#10b981",
  ],
  "circle-radius": 10,
  "circle-stroke-width": 2,
  "circle-stroke-color": "#ffffff",
};

interface MapComponentProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onPropertySelect: (property: Property) => void;
  onMapMove?: (viewState: MapViewState) => void;
  initialViewState?: MapViewState;
}

export default function MapComponent({
  properties,
  selectedPropertyId,
  onPropertySelect,
  onMapMove,
  initialViewState = {
    longitude: -80.1918,
    latitude: 25.7617,
    zoom: 11,
    pitch: 0,
    bearing: 0,
  },
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      console.warn(
        "No Mapbox token found. Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local"
      );
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      pitch: initialViewState.pitch ?? 0,
      bearing: initialViewState.bearing ?? 0,
      // Performance optimizations
      antialias: true,
      maxZoom: 20,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );
    map.addControl(new mapboxgl.ScaleControl(), "bottom-left");

    map.on("load", () => {
      setMapLoaded(true);
    });

    map.on("moveend", () => {
      if (onMapMove) {
        const center = map.getCenter();
        onMapMove({
          longitude: center.lng,
          latitude: center.lat,
          zoom: map.getZoom(),
          pitch: map.getPitch(),
          bearing: map.getBearing(),
        });
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add/update GeoJSON source and cluster layers when map loads or properties change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const geojson: PropertyGeoJSONCollection = toGeoJSON(properties);

    // Add or update source
    if (map.getSource(SOURCE_ID)) {
      (map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: geojson,
        // GeoJSON clustering — Mapbox handles this at the GL layer, maintaining 60fps
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Cluster circles
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        paint: CLUSTER_CIRCLE_PAINT,
      });

      // Cluster count labels
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        layout: CLUSTER_LABEL_LAYOUT,
        paint: CLUSTER_LABEL_PAINT,
      });

      // Individual unclustered points
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        paint: UNCLUSTERED_POINT_PAINT,
      });

      // Price label on unclustered points
      map.addLayer({
        id: "unclustered-label",
        type: "symbol",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        layout: {
          "text-field": [
            "case",
            [
              "any",
              ["==", ["get", "status"], "for_sale"],
              ["==", ["get", "status"], "pending"],
              ["==", ["get", "status"], "sold"],
            ],
            [
              "concat",
              "$",
              [
                "number-format",
                ["get", "price"],
                { "min-fraction-digits": 0, "max-fraction-digits": 0 },
              ],
            ],
            ["concat", "$", ["to-string", ["get", "price"]], "/mo"],
          ],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 10,
          "text-offset": [0, 1.8],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#1f2937",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      });

      // Click handler: zoom into cluster
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0]?.properties?.cluster_id;
        if (clusterId == null) return;

        (
          map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource
        ).getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          const geometry = features[0].geometry as GeoJSON.Point;
          map.easeTo({
            center: geometry.coordinates as [number, number],
            zoom: zoom ?? map.getZoom() + 2,
          });
        });
      });

      // Click handler: select individual property
      map.on("click", "unclustered-point", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const props = feature.properties as Property;
        onPropertySelect(props);

        // Show popup
        if (popupRef.current) popupRef.current.remove();
        const geometry = feature.geometry as GeoJSON.Point;
        popupRef.current = new mapboxgl.Popup({ offset: 20, closeButton: false })
          .setLngLat(geometry.coordinates as [number, number])
          .setHTML(
            `<div class="text-sm font-medium text-gray-900">${props.address}</div>
             <div class="text-xs text-gray-500">${props.city}, ${props.state}</div>`
          )
          .addTo(map);
      });

      // Cursor changes
      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }, [mapLoaded, properties, onPropertySelect]);

  // Highlight selected property
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (!map.getLayer("unclustered-point")) return;

    map.setPaintProperty("unclustered-point", "circle-stroke-width", [
      "case",
      ["==", ["get", "id"], selectedPropertyId ?? ""],
      4,
      2,
    ]);
    map.setPaintProperty("unclustered-point", "circle-stroke-color", [
      "case",
      ["==", ["get", "id"], selectedPropertyId ?? ""],
      "#2563eb",
      "#ffffff",
    ]);
  }, [selectedPropertyId, mapLoaded]);

  // Fly to selected property
  const flyToProperty = useCallback(
    (property: Property) => {
      const map = mapRef.current;
      if (!map) return;
      map.flyTo({
        center: [property.longitude, property.latitude],
        zoom: Math.max(map.getZoom(), 14),
        duration: 1200,
      });
    },
    []
  );

  // Fly when selection changes
  useEffect(() => {
    if (!selectedPropertyId) return;
    const property = properties.find((p) => p.id === selectedPropertyId);
    if (property) flyToProperty(property);
  }, [selectedPropertyId, properties, flyToProperty]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 max-w-md">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Mapbox Token Required
          </h3>
          <p className="text-sm text-gray-500">
            Add your{" "}
            <code className="bg-gray-200 px-1 rounded">
              NEXT_PUBLIC_MAPBOX_TOKEN
            </code>{" "}
            to{" "}
            <code className="bg-gray-200 px-1 rounded">.env.local</code> to
            display the interactive map.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Get a free token at{" "}
            <a
              href="https://account.mapbox.com"
              className="text-blue-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Loading map…</span>
          </div>
        </div>
      )}
    </div>
  );
}
