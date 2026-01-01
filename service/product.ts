import { API_URL } from "@/url/Api_Url";
import { Category } from "./category";


export interface Store {
  id: number;
  name: string;
  // Add other store properties as needed
}

export interface Product {
  id: number;
  name: string;
  description: string;
  regular_price: string;
  product_images: ProductImage[];
  product_variations: ProductVariations[];
  image: string | null;
  category_name: Category;
  store_name: Store; // Updated to be an object with a name property
}
export interface ProductImage {
  id: number;
  image: string;
}
export interface ProductVariations {
  id: number;
  name: string;
  price: string;
  unit_quantity:string;
  image:string;
  stock:number
}
interface ProductApiResponse {
  status: boolean;
  message: string;
  data: Product[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(
      `${API_URL}customer-api/get-products`
    );
    const json: ProductApiResponse = await res.json();

    return json.status ? json.data : [];
  } catch (error) {
    console.error("Product API error:", error);
    return [];
  }
};
