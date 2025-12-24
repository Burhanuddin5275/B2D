
export interface image {
  store: number;
 store_logo:string;

}
export interface Store {
  id: number;
  name: string;
  description: string;
  images?: image | null;
  status: number; 
  created_at: string;
  updated_at: string;
}

export interface StoreApiResponse {
  status: boolean;
  message: string;
  data: Store[];
}

export const fetchStores = async (): Promise<Store[]> => {
  try {
    const response = await fetch("https://mart2door.com/customer-api/get-stores");
    const json: StoreApiResponse = await response.json();

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
