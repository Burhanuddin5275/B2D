import { API_URL } from "@/url/Api_Url";

// /service/profile.ts
export interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

export const getProfile = async (token: string): Promise<ProfileData> => {
  const response = await fetch(`${API_URL}customer-api/auth/profile`, {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/json',
    },
  });

  const data = await response.json();
 console.log('profile',data)
  return data.data;
};

export const updateProfile = async (
  token: string,
  profile: { first_name: string; last_name: string; email: string; avatar?: string | null }
) => {
  const formData = new FormData();
  formData.append('first_name', profile.first_name);
  formData.append('last_name', profile.last_name);
  formData.append('email', profile.email);

  if (profile.avatar) {
    const fileExt = profile.avatar.split('.').pop() || 'jpg';
    formData.append('avatar', {
      uri: profile.avatar,
      name: `avatar.${fileExt}`,
      type: `image/${fileExt}`,
    } as any);
  }

  const response = await fetch(`${API_URL}customer-api/auth/profile`, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
    },
    body: formData,
  });

  const contentType = response.headers.get('content-type');
  let data: any = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.error('Non-JSON response:', text);
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Profile update failed');
  }

  return data;
};
export const logoutApi = async (token: string | null) => {
  if (!token) return;

  try {
    await fetch(`${API_URL}customer-api/auth/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
    });
  } catch (error) {
    // We intentionally swallow the error
    // because logout should still proceed locally
    console.error('Logout API failed:', error);
  }
};