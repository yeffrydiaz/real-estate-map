import { createClient } from "@supabase/supabase-js";
import { Property } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function fetchProperties(): Promise<Property[] | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties:", error);
    return null;
  }

  return data as Property[];
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  return data as Property;
}

export async function fetchPropertiesInBounds(
  minLng: number,
  minLat: number,
  maxLng: number,
  maxLat: number
): Promise<Property[] | null> {
  if (!supabase) return null;

  // PostGIS ST_MakeEnvelope query via RPC
  const { data, error } = await supabase.rpc("properties_in_bounds", {
    min_lng: minLng,
    min_lat: minLat,
    max_lng: maxLng,
    max_lat: maxLat,
  });

  if (error) {
    console.error("Error fetching properties in bounds:", error);
    return null;
  }

  return data as Property[];
}
