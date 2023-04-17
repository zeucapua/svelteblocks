import { prisma } from "$lib/prisma";
import { error } from "@sveltejs/kit";
import { LIVEBLOCKS_SECRET_KEY } from "$env/static/private";

export async function load({ locals, cookies, url }) {
  const session = await locals.getSession();
  const user = session.user; 

  const params = url.searchParams;
  const room_id = params.get("id");

  // for now only allow authed Users
  // TODO: implement Guest flow
  if ( !(room_id && user.id) ) { throw error(403, "Invalid search params"); }

  const room_response = await fetch(`https://api.liveblocks.io/v2/rooms/${room_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
    }
  });

  if (room_response.status === 200) {
    const storage_response = await fetch(`https://api.liveblocks.io/v2/rooms/${room_id}/storage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LIVEBLOCKS_SECRET_KEY}`,
      }
    });
    const storage_data = await storage_response.json();

    return { room_id, username: user?.name || "", storage: storage_data.data };
  }
  else {
    // return initial data from database
    const room = await prisma.room.findUnique({
      where: { id: room_id }
    });

    return { room_id, username: user?.name || "", storage: { fabric: room?.fabric || "" } }
  }


}
