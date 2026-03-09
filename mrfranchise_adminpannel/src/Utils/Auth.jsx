
export const getAuthToken = () => localStorage.getItem('token');

export const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};