import { prisma } from "$lib/prisma";
import { LIVEBLOCKS_SECRET_KEY } from "$env/static/private";

export async function POST({ locals, request }) {
  const { room_id, fabric } = await request.json();
  const session = await locals.getSession();
  const user_id = session.user.id;

  await prisma.user.update({
    where: { id: user_id },
    data: {
      rooms: {
        upsert: {
          where: { id: room_id },
          create: { id: room_id, fabric },
          update: { 
            fabric,
          }
        }
      }
    },
  });

  return new Response();
}


export async function DELETE({ request }) {
  console.log('DELETE');
  const { room_id } = await request.json();

  const response = await fetch(`https://api.liveblocks.io/v2/rooms/${room_id}`, {
    headers: { "Authorization": `Bearer ${LIVEBLOCKS_SECRET_KEY}` }
  });
  
  console.log({response});
  
  return new Response();
}
