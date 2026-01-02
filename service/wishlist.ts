import { API_URL } from '@/url/Api_Url';
export const addToWishlistApi = async (
  token: string,
  payload: {
    product: number;
    variation?: number;
  }
) => {
  const res = await fetch(`${API_URL}customer-api/wishlist`, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload), // ✅ variation omitted if undefined
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error('Wishlist API returned HTML:', text);
    throw new Error('Invalid API response');
  }

  if (!res.ok) {
    throw new Error(data.message || 'Failed to add wishlist');
  }

  return data?.data ?? data; // flexible return
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

