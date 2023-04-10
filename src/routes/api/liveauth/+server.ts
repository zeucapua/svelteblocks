import { authorize } from "@liveblocks/node";
import { LIVEBLOCKS_SECRET_KEY } from "$env/static/private";

export async function POST({ cookies, request }) {
  const { room } = await request.json();

  const username = cookies.get("username");
  const userId = Math.floor(Math.random() * 100).toString();
  
  const response = await authorize({
    room: room,
    secret: LIVEBLOCKS_SECRET_KEY, 
    userId,
  });

  return new Response(response.body, { status: response.status });
}
