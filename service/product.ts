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
  full_description: string;
  regular_price: string;
  product_images: ProductImage[];
  product_variations: ProductVariations[];
  reviews: Review[];
  stars: number;
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
export interface ReviewUser {
  first_name: string;
  last_name: string;
}

export interface Review {
  product: number;
  stars: number;
  comment: string;
  user: ReviewUser;
  created_at: string;
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
