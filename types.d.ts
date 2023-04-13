// shoutout to Coding Garden for types.d.ts and auth handler w/ callbacks
import type {
  Session as OGSession,
  DefaultSession,
  User as OGUser
} from "@auth/sveltekit/node_modules/@auth/core/types";

// TODO: change package to "@auth/core/types" when fixed. above fixes a bug!

declare module "@auth/sveltekit/node_modules/@auth/core/types" {
  interface Session extends OGSession {
    user?: {
      id : string,
    } & DefaultSession["user"],
  }
}
