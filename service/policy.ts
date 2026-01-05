import { API_URL } from "@/url/Api_Url";

export const fetchCustomerPolicy = async (title: string) => {
  try {
    const res = await fetch(
      `${API_URL}api/polices/customer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      }
    );

    const response = await res.json();

    return response;
  } catch (error) {
    console.error('Policy API Error:', error);
    throw error;
  }
};
