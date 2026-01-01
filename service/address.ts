import { API_URL } from "@/url/Api_Url";

export interface Country {
  country: string;
}
export interface StateItem {
  state: string;
  country: string;
}

export interface CityItem {
  city: string;
  state: string;
}
export interface Address {
  id: number;
  address_name: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
  is_default: boolean;
}

export const fetchCountries = async (
  token?: string
): Promise<Country[]> => {

    const response = await fetch(
      `${API_URL}api/get-locations/country`,
      {
        method: 'GET',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/json',
        },
      }
    );

    const json = await response.json();
    console.log('Country API response:', json);

    return json.data;
};

export const fetchStates = async (
  token: string,
  country: string
): Promise<StateItem[]> => {

    const response = await fetch(
      `${API_URL}api/get-locations/state`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`, 
        },
        body: JSON.stringify({
          country: country,
        }),
      }
    );

    const json = await response.json();
    console.log('State API response:', json);
    return json.data;
};


export const fetchCities = async (token: string, state: string): Promise<CityItem[]> => {
    const response = await fetch(`${API_URL}api/get-locations/city`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`
      },
      body: JSON.stringify({
        state
      }),
    });
    const json = await response.json();
    console.log('City API response:', json);
   return json.data;
};

// service/address.ts
export const fetchAddresses = async (token: string) => {
  const response = await fetch(
    `${API_URL}customer-api/addresses`,
    {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json',
      },
    }
  );

  const result = await response.json();
  return result;
};
export const deleteAddress = async (token: string, addressId: number): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(
      `${API_URL}customer-api/remove-address/${addressId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete address');
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};