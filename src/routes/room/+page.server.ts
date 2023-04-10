import { error } from "@sveltejs/kit";

export async function load({ cookies, url }) {
  const params = url.searchParams;
  const room_id = params.get("id");
  const username = params.get("username");

  if ( !(room_id && username) ) { throw error(403, "Invalid search params"); }

  cookies.set("username", username);
  return { room_id, username };
}
