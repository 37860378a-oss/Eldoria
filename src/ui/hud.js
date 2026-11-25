export function createHud(player) {
  const status = document.querySelector("#status-text");
  const coordinates = document.querySelector("#coordinates");
  const toast = document.querySelector("#toast");
  let lastToast = 0;
  return {
    setStatus(value) { status.textContent = value; },
    update() {
      const p = player.getPosition();
      coordinates.textContent = `X ${Math.round(p.x)} · Z ${Math.round(p.z)}`;
    },
    notify(message) {
      toast.textContent = message;
      toast.classList.add("visible");
      clearTimeout(lastToast);
      lastToast = setTimeout(() => toast.classList.remove("visible"), 2400);
    }
  };
}
