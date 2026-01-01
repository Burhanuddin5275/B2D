import { API_URL } from '@/url/Api_Url';
export interface WishlistItem {
  wishlist_id: number;
  product_id: number;
}

export const addToWishlistApi = async (token: string, productId: number) => {
  const res = await fetch(`${API_URL}customer-api/add-wishlist/${productId}`, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
  });

  if (!res.ok) throw new Error('Failed to add wishlist item');

  const data = await res.json();
  return data.data; // should return the newly created wishlist item with id
};


export const removeFromWishlistApi = async (token: string, wishlistId: number) => {
  const res = await fetch(`${API_URL}customer-api/remove-wishlist/${wishlistId}`, {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to remove wishlist item');
  }

  return true;
};

export const getFromWishlistApi = async (token: string) => {
  const res = await fetch(`${API_URL}customer-api/wishlist`, {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to get wishlist items');
  }

  const data = await res.json();
  return data;
};

