export function createHud(player, world) {
  const status = document.querySelector("#status-text");
  const coordinates = document.querySelector("#coordinates");
  const toast = document.querySelector("#toast");
  let lastToast = 0;
  const location = document.querySelector("#current-region");
  let previousRegion = "";
  return {
    setStatus(value) { status.textContent = value; },
    update() {
      const p = player.getPosition();
      coordinates.textContent = `X ${Math.round(p.x)} · Z ${Math.round(p.z)}`;
      const region = world.regionAt?.(p.x, p.z);
      if (region && region !== previousRegion) { previousRegion = region; if (location) location.textContent = region; }
    },
    notify(message) {
      toast.textContent = message;
      toast.classList.add("visible");
      clearTimeout(lastToast);
      lastToast = setTimeout(() => toast.classList.remove("visible"), 2400);
    }
  };
}
