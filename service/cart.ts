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
    'https://mart2door.com/customer-api/cart',
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
