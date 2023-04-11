<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { signOut } from "@auth/sveltekit/client";

  let user = $page.data.session?.user;
  let room_id : string;
  let username : string = user?.name || "";

  function enterRoom() { goto(`/room?id=${room_id}&username=${username}`); }
  function signOutAccount() { signOut(); goto("/"); }
</script>

<p>{user?.name}</p>
<button on:click={signOutAccount}>Sign Out</button>

<input type="text" placeholder="Room ID" bind:value={room_id} />
<button on:click={enterRoom}>Enter Room</button>
