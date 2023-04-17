import { LIVEBLOCKS_SECRET_KEY } from "$env/static/private";
export async function load() {
  const response = await fetch("https://api.liveblocks.io/v2/rooms", {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LIVEBLOCKS_SECRET_KEY}`
    }
  });
  const rooms = await response.json();
}
