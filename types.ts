
export enum BeerType {
  PILSEN = 'Pilsen',
  IPA = 'IPA',
  WEISS = 'Weiss',
  STOUT = 'Stout',
  LAGER = 'Puro Malte',
  SOUR = 'Sour',
  APA = 'APA',
  RED_ALE = 'Red Ale',
  DUNKEL = 'Dunkel',
  VIENNA = 'Vienna',
  AMBER = 'Amber'
}

export enum ProductCategory {
  GROWLER = 'Growlers',
  KEG30 = 'Barris 30L',
  KEG50 = 'Barris 50L'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type?: BeerType;
  category: ProductCategory;
  volumeLiters?: number; // e.g., 30, 50
  isPopular?: boolean;
  isChampion?: boolean; // New flag for Sales Champion
  abv?: number; // Alcohol by volume
  ibu?: number; // Bitterness
  pairing?: string; // Food pairing suggestions
}

export interface CartItem extends Product {
  quantity: number;
  // Extra options for Event Kegs
  rentTables?: boolean;
  rentUmbrellas?: boolean;
  cupsQuantity?: number | null; // 100 - 1000
}

export interface CalculatorResult {
  totalLiters: number;
  recommendedKegs: string[]; // IDs of products
}

export type ViewState = 'home' | 'menu' | 'calculator' | 'cart' | 'contact';
