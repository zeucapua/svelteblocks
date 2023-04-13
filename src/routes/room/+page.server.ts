import { error } from "@sveltejs/kit";

export async function load({ locals, cookies, url }) {
  const session = await locals.getSession();
  const user = session.user; 

  const params = url.searchParams;
  const room_id = params.get("id");
  const user_id = cookies.get("user_id");

  if ( !(room_id && user_id) ) { throw error(403, "Invalid search params"); }

  return { room_id, username: user.name || "" };
}
