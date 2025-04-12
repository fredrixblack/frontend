import axios from "axios";
 

export async function register(username: string, password: string) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, { username, password });
  return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function login(username: string, password: string,registerMe:boolean) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { username, password });
  localStorage.setItem("token", response.data.token);
}

export function logout() {
  localStorage.removeItem("token");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}