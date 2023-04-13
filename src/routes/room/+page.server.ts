import { error } from "@sveltejs/kit";
import { LIVEBLOCKS_SECRET_KEY } from "$env/static/private";

export async function load({ locals, cookies, url }) {
  const session = await locals.getSession();
  const user = session.user; 

  const params = url.searchParams;
  const room_id = params.get("id");
  const user_id = cookies.get("user_id");

  if ( !(room_id && user_id) ) { throw error(403, "Invalid search params"); }

  const response = await fetch(`https://api.liveblocks.io/v2/rooms/${room_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
    }
  });

  if (response.status === 200) {
    // if room exists in the Liveblocks server
    const data = await response.json();
    console.log({data});
  }
  else {
    // return initial data from database
  }


  return { room_id, username: user.name || "" };
}
