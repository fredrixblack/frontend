import axios from "axios";
 
export async function shortenUrl(originalUrl: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log(apiUrl);
const secretKey = process.env.SECRET_API_KEY;
console.log(secretKey);
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/shorten`, { original_url: originalUrl });
  return response.data;
}

export async function getUrls() {
  // Placeholder: VM1 doesn't have this endpoint yet
  return [];
}