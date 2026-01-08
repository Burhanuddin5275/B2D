import { API_URL } from "@/url/Api_Url";

export interface User {
  first_name: string;
  last_name: string;
}

export interface ProductReview {
  order: number | null;
  product: number;
  stars: number;
  comment: string;
  user: User;
}

export interface ReviewApiResponse {
  status: boolean;
  message: string;
  data: ProductReview[];
}

export const reviewApi = async (token: string, payload:any) => {
  const res = await fetch(`${API_URL}customer-api/product-review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${token}`,
    },
    body: JSON.stringify({
     order:payload.order,
     product: payload.product,
     stars: payload.stars,
     comment: payload.comment
    }),
  });

  const response = await res.json();
  console.log('Review response:', response);
  return response;


};
export const fetchReview = async (token: string): Promise<ProductReview[]> => {
  try {
    const response = await fetch(`${API_URL}customer-api/product-review`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`, 
      },
    });

    const result = await response.json();
    console.log('Review API response:', result);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching review:', error);
    throw error;
  }
};