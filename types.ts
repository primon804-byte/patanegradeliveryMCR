
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
  rentTonel?: boolean; // R$ 30.00
  mugsQuantity?: 24 | 36 | 48 | null;
  mugsPrice?: number; // 30, 40, 50
  moreCups?: boolean; // Flag to request quota for extra cups
  
  // Internal Control Flag
  isUpsell?: boolean; 
}

export interface CalculatorResult {
  totalLiters: number;
  recommendedKegs: string[]; // IDs of products
}

export type ViewState = 'home' | 'menu' | 'calculator' | 'cart' | 'contact';
