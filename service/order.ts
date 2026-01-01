import { API_URL } from "@/url/Api_Url";

// /services/orderApi.ts
export interface OrderStatus {
  status: string;
  cancel_reason: string | null;
  reason_detail: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  status: OrderStatus[];
  order_no: string;
  coupon: string | null;
  coupon_price: string;
  sub_total_price: string;
  shipping_price: string;
  total_price: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  schedule_order: string;
  created_at: string;
  updated_at: string;
  delivery_type: string;
  delivery_instructions: string;
  driver_tip: string;
  flat_charge: string;
  delivery_image: string | null;
}

export interface OrdersResponse {
  status: boolean;
  message: string;
  data: Order[];
}
// /services/orderDetailApi.ts
export interface ProductImage {
  id: number;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  product_images: ProductImage[];
}

export interface OrderItem {
  id: number;
  product: Product;
  variation: any | null;
  quantity: number;
  price: string;
  total: string;
  created_at: string;
  updated_at: string;
  order: number;
}

export interface Shipping {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  store_order: number;
}

export interface OrderStatus {
  status: string;
  cancel_reason: string | null;
  reason_detail: string | null;
  created_at: string;
}

export interface OrderDetail {
  id: number;
  order_items: OrderItem[];
  shipping: Shipping;
  status: OrderStatus[];
  order_no: string;
  coupon: string | null;
  coupon_price: string;
  sub_total_price: string;
  shipping_price: string;
  total_price: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  schedule_order: string;
  created_at: string;
  updated_at: string;
  delivery_type: string;
  delivery_instructions: string;
  driver_tip: string;
  flat_charge: string;
  delivery_image: string | null;
}

export interface OrderDetailResponse {
  status: boolean;
  message: string;
  data: OrderDetail;
}
export const fetchOrders = async (token: string): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}customer-api/my-orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`, 
      },
    });

    const result = await response.json();
    console.log('Orders API response:', result);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// /service/orderService.ts
export const fetchOrderById = async (orderId: string, token: string) => {
  try {
    const res = await fetch(`${API_URL}customer-api/my-orders/${orderId}`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    const data = await res.json();
    if (data.status) return data.data;
    return null;
  } catch (error) {
    console.error('Fetch order error:', error);
    return null;
  }
};

export const placeOrderApi = async (token: string, orderData: any) => {
  const res = await fetch(`${API_URL}customer-api/place-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || 'Failed to place order');
  }

  return json;
};