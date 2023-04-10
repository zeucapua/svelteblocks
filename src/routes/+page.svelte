<script lang="ts">
  import { goto } from "$app/navigation";

  let room_id : string;
  let username : string;

  function enterRoom() { goto(`/room?id=${room_id}&username=${username}`); }
</script>

<input type="text" placeholder="Room ID" bind:value={room_id} />
<input type="text" placeholder="Username" bind:value={username} />
<button on:click={enterRoom}>Enter Room</button>
