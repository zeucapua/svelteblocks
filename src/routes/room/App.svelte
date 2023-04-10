<script lang="ts">
  import Cursor from "./Cursor.svelte";
  import { onDestroy } from "svelte";
  import type { Room } from "@liveblocks/client";

  export let room : Room;
  let others = room.getOthers();

  const unsubscribeFromOthers = room.subscribe(
    "others",
    (otherUsers) => { others = otherUsers; }
  );

  function handleMouseMove(event : PointerEvent) {
    room.updatePresence({ 
      cursor: { x: Math.round(event.clientX), y: Math.round(event.clientY) } 
    });
  }

  function handleMouseLeave() { room.updatePresence({ cursor: null }); }

  onDestroy(() => { unsubscribeFromOthers(); })

  const COLORS = [
    "#E57373",
    "#9575CD",
    "#4FC3F7",
    "#81C784",
    "#FFF176",
    "#FF8A65",
    "#F06292",
    "#7986CB",
  ];
</script>


<main on:pointermove|preventDefault={handleMouseMove} on:pointerleave={handleMouseLeave}>
  {#if others}
    {#each [...others] as { connectionId, presence } (connectionId)}
      {#if presence?.cursor}
        <Cursor username={presence.username} color={COLORS[connectionId % COLORS.length]} x={presence.cursor.x} y={presence.cursor.y} />
      {/if}
    {/each}
  {/if}
</main>

<style>
  main {
    display: flex;
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    touch-action: none;
  }
</style>
