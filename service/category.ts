
// categoryApi.ts

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
  status: number;
  parent: any; // You might want to define a proper type for parent
  subcategorize: any[];
  created_at: string;
  updated_at: string;
}

export interface CategoryApiResponse {
  status: boolean;
  message: string;
  data: Category[];
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch("https://mart2door.com/customer-api/get-categories");
    const json: CategoryApiResponse = await response.json();

    if (json.status) {
      return json.data;
    }

    console.warn("Category API error:", json.message);
    return [];
  } catch (error) {
    console.error("Network error:", error);
    return [];
  }
};
