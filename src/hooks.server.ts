import { sequence } from "@sveltejs/kit/hooks";
import { type Handle, redirect } from "@sveltejs/kit";
import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import Discord from "@auth/core/providers/discord";
import { GITHUB_ID, GITHUB_SECRET, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET} from "$env/static/private"

export const auth : Handle = SvelteKitAuth({
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
    Discord({ clientId: DISCORD_CLIENT_ID, clientSecret: DISCORD_CLIENT_SECRET }),
  ],
})

export const routing : Handle =  async ({ event, resolve }) => {
  const is_dashboard = event.url.pathname.startsWith("/dashboard");
  const session = await event.locals.getSession();
  if (is_dashboard && !(session)) { throw redirect(308, "/"); }
  return resolve(event);
}

export const handle = sequence(auth, routing);
