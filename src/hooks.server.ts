import { sequence } from "@sveltejs/kit/hooks";
import { type Handle, redirect } from "@sveltejs/kit";
import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import Discord from "@auth/core/providers/discord";
import { GITHUB_ID, GITHUB_SECRET, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET} from "$env/static/private"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "$lib/prisma";

// shoutout Coding Garden on Youtube for types.d.ts and this auth handler w/ callbacks
export const auth = (async (...args) => { 
  const [{ event }] = args;
  return SvelteKitAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
      // TODO: Github uses "expires_at" and Google/Discord uses "expires_in" for Prisma Schema
      // Find solution to allow for both!
      //GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
      Discord({ clientId: DISCORD_CLIENT_ID, clientSecret: DISCORD_CLIENT_SECRET }),
    ],
    callbacks: {
      async session({ user, session }) {
         session.user = {
           id: user.id,
           name: user.name,
           image: user.image,
         };

         event.locals.session = session
         return session
      }
    }
  })(...args);
}) satisfies Handle;

export const routing : Handle =  async ({ event, resolve }) => {
  const is_dashboard = event.url.pathname.startsWith("/dashboard");
  const session = await event.locals.getSession();
  if (is_dashboard && !(session)) { throw redirect(308, "/"); }
  return resolve(event);
}

export const cookie_handler : Handle = async ({ event, resolve }) => {
  const session = await event.locals.getSession();
  const user = session?.user;
  if (user) { event.cookies.set("user_id", user.id); }
  return resolve(event);
}

export const handle = sequence(auth, routing, cookie_handler);
