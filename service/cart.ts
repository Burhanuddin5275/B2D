import { API_URL } from "@/url/Api_Url";

export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  store: {
    id: number;
    name: string;
  };
  product: {
    id: number;
    name: string;
    slug: string;
    product_images: {
      id: number;
      image: string;
    }[];
  };
  variation: {
    id: number;
    name: string;
    image: string;
  } | null;
}
export const fetchCart = async (token: string): Promise<CartItem[]> => {
  const res = await fetch(
    `${API_URL}customer-api/cart`,
    {
      method: 'GET',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/json',
      },
    }
  );

  const json = await res.json();
  return json.data;
};


/* ================= ADD / UPDATE CART ================= */
export const addOrUpdateCart = async (
  token: string,
  payload: {
    id?: number;
    product: number;
    quantity: number;
    variation?: number;
  }
) => {
  const response = await fetch(`${API_URL}customer-api/cart`, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw json;
  }

  return json;
};

/* ================= REMOVE FROM CART ================= */
export const removeFromCartApi = async (
  token: string,
  cartItemId: number
) => {
  const response = await fetch(
    `${API_URL}customer-api/remove-cart/${cartItemId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/json',
      },
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw json;
  }

  return json;
};
