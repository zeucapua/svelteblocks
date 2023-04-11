<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { signIn, signOut } from "@auth/sveltekit/client";

  let session = $page.data.session || {};
  $: user = $page.data.session?.user;
  let room_id : string;
  let username : string = user?.name || "";

  function enterRoom() { goto(`/room?id=${room_id}&username=${username}`); }

</script>

{#if Object.keys(session).length}
  <input type="text" placeholder="Room ID" bind:value={room_id} /> 
  <input type="text" placeholder="Username" bind:value={username} />
  <button on:click={enterRoom}>Enter Room</button>
  <button on:click={() => signOut()} class="button">Sign out</button>
{:else}
  <button on:click={() => signIn("github")}>Sign In with Github</button>
  <button on:click={() => signIn("discord")}>Sign In with Discord</button>
{/if}


