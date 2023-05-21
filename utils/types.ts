export type Category = {
  id: number;
  name: string;
};

export type Subcategory = {
  id: number;
  name: string;
  category: Category;
};

export type Store = {
  id: number;
  name: string;
};

export type Brand = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  units: string;
  description: string;
  imgUrl: string;
  lastUpdate: string;
  subcategory: Subcategory;
};

export type Item = {
  id: number;
  product: number;
  name: string;
  url: string;
  imageUrl: string;
  price: number;
  pricePerUnit: number;
  quantity: number;
  brand: Brand;
  store: Store;
};

export type Suggestion = {
  name: string;
  description: string;
  units: string;
  subcategory: Subcategory;
  exampleUrl?: string;
  imgUrl?: string;
};
