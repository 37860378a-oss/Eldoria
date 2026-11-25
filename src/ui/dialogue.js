export function createDialogue(player, actors, hud) {
  const panel = document.querySelector("#dialogue");
  const name = document.querySelector("#dialogue-name");
  const text = document.querySelector("#dialogue-text");
  const hint = document.querySelector("#interaction-hint");
  const close = document.querySelector("#dialogue-close");
  let current = null;
  let line = 0;

  function closeDialogue() {
    current = null;
    panel?.classList.remove("visible");
  }

  function openDialogue(actor) {
    current = actor;
    line = 0;
    name.textContent = actor.name;
    text.textContent = actor.dialogue[line];
    panel.classList.add("visible");
  }

  function advance() {
    if (!current) return;
    line++;
    if (line >= current.dialogue.length) {
      closeDialogue();
      hud.notify("Maelis: Que la luz guíe tus pasos.");
      return;
    }
    text.textContent = current.dialogue[line];
  }

  function onKeyDown(event) {
    if (event.code === "Escape" && current) {
      closeDialogue();
      event.preventDefault();
      return;
    }
    if (event.code !== "KeyE" || !player.started) return;
    event.preventDefault();
    if (current) { advance(); return; }
    const actor = actors.nearest(player.getPosition());
    if (actor) openDialogue(actor);
  }

  window.addEventListener("keydown", onKeyDown);
  close?.addEventListener("click", closeDialogue);
  panel?.addEventListener("click", event => {
    if (event.target === panel) closeDialogue();
  });

  return {
    update() {
      if (current) return;
      const actor = actors.nearest(player.getPosition());
      if (hint) {
        hint.textContent = actor ? "E · Hablar con " + actor.name.split(",")[0] : "";
        hint.classList.toggle("visible", !!actor);
      }
    }
  };
}
