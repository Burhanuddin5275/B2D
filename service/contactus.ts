import { API_URL } from "@/url/Api_Url";

export const contactUsApi = async (token: string, message: string) => {
  const res = await fetch(`${API_URL}customer-api/contact-us`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${token}`,
    },
    body: JSON.stringify({
      message: message,
    }),
  });
console.log( JSON.stringify({
      message: message,
    }),)
  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || 'Failed to contact us');
  }

  return response;
};