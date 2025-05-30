let isBlocked = false;

function keyBlocker(e) {
  if (isBlocked) {
    if (document.activeElement) {
      document.activeElement.blur();  // unfocus the input
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}


window.addEventListener("keydown", keyBlocker, true);
window.addEventListener("keypress", keyBlocker, true);
window.addEventListener("keyup", keyBlocker, true);

window.addEventListener("TOGGLE_KEYBOARD_BLOCK", (event) => {
  isBlocked = event.detail;
});
