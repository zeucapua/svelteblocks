<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { signIn, signOut } from "@auth/sveltekit/client";

  let session = $page.data.session || {};
</script>

{#if Object.keys(session).length}
  <button on:click={() => goto("/dashboard")}>Dashboard</button>
  <button on:click={signOut}>Sign Out</button>
{:else}
  <button on:click={() => signIn("discord")}>Sign In with Discord</button>
{/if}


