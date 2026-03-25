export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  property_type: "house" | "condo" | "townhouse" | "apartment" | "land";
  status: "for_sale" | "for_rent" | "sold" | "pending";
  description: string;
  year_built: number;
  lot_size: number | null;
  parking: number;
  images: string[];
  features: string[];
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export type PropertyGeoJSON = GeoJSON.Feature<GeoJSON.Point, Property>;

export type PropertyGeoJSONCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  Property
>;

export interface MortgageCalculatorInputs {
  homePrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  propertyTax: number;
  homeInsurance: number;
  pmiRate: number;
}

export interface MortgageCalculatorResults {
  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  totalMonthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
  downPaymentAmount: number;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export type PropertyFilters = {
  minPrice: number;
  maxPrice: number;
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: Property["property_type"] | "all";
  status: Property["status"] | "all";
  minSqft: number;
  maxSqft: number;
};
