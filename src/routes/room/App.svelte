<script lang="ts">
  import Cursor from "./Cursor.svelte";
  import { fabric } from "fabric";
  import { onMount, onDestroy } from "svelte";
  import type { Room, LiveMap } from "@liveblocks/client";

  export let room : Room;
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

  let fabric_map : LiveMap<string, string>;
  let fabric_json : string = "";
  let canvas : fabric.Canvas;
  let others = room.getOthers();

  let is_drawing_mode : boolean;

  let unsubscribeFromFabric : Function;

  const unsubscribeFromOthers = room.subscribe(
    "others",
    (otherUsers) => { others = otherUsers; }
  );

  function addRect() {
    var rect = new fabric.Rect({
      fill: 'red',
      width: 20,
      height: 20,
      angle: 45
    });
    canvas.add(rect);
  }

  function addText() {
    let text = new fabric.IText("Hello World!", { left: 100, top: 100 });
    canvas.add(text);
  }

  function handleMouseMove(event : PointerEvent) {
    room.updatePresence({ 
      cursor: { x: Math.round(event.clientX), y: Math.round(event.clientY) } 
    });
  }

  function handleMouseLeave() { room.updatePresence({ cursor: null }); }

  function renderFabric() {
    if (canvas && fabric_json) {
      canvas.loadFromJSON(fabric_json);
    }
  }

  onMount( async() => {
    const { root } = await room.getStorage();
    fabric_map = root.get("fabric");

    canvas = new fabric.Canvas("fabric");

    // initial render 
    fabric_json = fabric_map.get("fabric") || ""; 
    renderFabric();
    canvas.renderAll();

    unsubscribeFromFabric = room.subscribe(fabric_map, () => {
      fabric_json = fabric_map.get("fabric") || "";
      renderFabric();
    });

    canvas.on("path:created", () => {
      fabric_map.set("fabric", JSON.stringify(canvas));
    });
    canvas.on("object:modified", () => {
      fabric_map.set("fabric", JSON.stringify(canvas));
    });
  });

  onDestroy(async () => { 
    const room_id = room.id;
    await fetch("/api/liveblocks", {
      method: "POST",
      body: JSON.stringify({ room_id, fabric: fabric_json }),
      headers: { "Content-Type": "application/json" }
    });

    unsubscribeFromFabric(); 
    unsubscribeFromOthers(); 
  })


  $: if (canvas) { canvas.isDrawingMode = is_drawing_mode; }
</script>


<main on:pointermove|preventDefault={handleMouseMove} on:pointerleave={handleMouseLeave}>
  <div id="toolbox">
    <button on:click={addRect}>Add Rectangle</button>
    <button on:click={addText}>Add Text</button>
    <label>
      Drawing Mode
      <input type="checkbox" bind:checked={is_drawing_mode} />
    </label>
  </div>
  <canvas id="fabric" width={800} height={800} style:border-style="solid" />
  {#if others}
    {#each [...others] as { connectionId, presence } (connectionId)}
      {#if presence?.cursor}
        <Cursor username={presence.username} color={COLORS[connectionId % COLORS.length]} x={presence.cursor.x} y={presence.cursor.y} />
      {/if}
    {/each}
  {/if}
</main>

<style>
  #toolbox {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
  }

  main {
    display: flex;
    flex-direction: column;
    padding: 0 auto;
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    touch-action: none;
  }
</style>
