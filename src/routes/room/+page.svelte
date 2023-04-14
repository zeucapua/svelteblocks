<script lang="ts">
  import App from "./App.svelte";
  import { onMount, onDestroy } from "svelte";
  import { createClient, type Client, type Room, LiveMap } from "@liveblocks/client";

  export let data;

  let client : Client;
  let room : Room;
  let room_id = data.room_id;
  let username = data.username;
  let storage = data.storage;
  
  type Presence = {
    username: string,
    cursor: { x : number, y : number } | null,
  }

  type Storage = {
    fabric : LiveMap<string, string>
  }

  onMount(() => {
    client = createClient({ authEndpoint: "/api/liveauth" });
    room = client.enter<Presence, Storage>(
      room_id, 
      {
        initialPresence: { username, cursor: null,  },
        initialStorage: { fabric: storage.fabric },
      }
    );
  });

  onDestroy(() => {
    if (client && room) {
      client.leave(room_id);
    }
  });

</script>

{#if room}
  <App {room} />
{/if}
