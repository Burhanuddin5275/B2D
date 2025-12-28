export interface Country {
  country: string;
}
export interface CityItem {
  city: string;
}
export const fetchCountries = async (
  token?: string
): Promise<Country[]> => {
  try {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `token ${token}`; // ✅ your backend format
    }

    const response = await fetch(
      'https://mart2door.com/api/get-locations/country',
      {
        method: 'GET',
        headers,
      }
    );

    const json = await response.json();
    console.log('Country API response:', json);

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error('Country API error:', error);
    return [];
  }
};
export interface StateItem {
  state: string;
}

export const fetchStates = async (
  token: string,
  country: string
): Promise<StateItem[]> => {
  try {
    const response = await fetch(
      'https://mart2door.com/api/get-locations/state',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`, // ✅ as per your backend
        },
        body: JSON.stringify({
          country: country,
        }),
      }
    );

    const json = await response.json();
    console.log('State API response:', json);

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error('State API error:', error);
    return [];
  }
};
export const fetchCities = async (token: string, state: string): Promise<CityItem[]> => {
  try {
    const response = await fetch('https://mart2door.com/api/get-locations/city', {
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
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error('City API error:', error);
    return [];
  }
};