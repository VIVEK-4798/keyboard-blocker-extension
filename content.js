let isKeyboardBlocked = false;
let isMouseBlocked = false;

function keyBlocker(e) {
  if (isKeyboardBlocked) {
    if (document.activeElement) {
      document.activeElement.blur(); // unfocus input
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}

function mouseBlocker(e) {
  if (isMouseBlocked) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}

// Attach keyboard listeners
window.addEventListener("keydown", keyBlocker, true);
window.addEventListener("keypress", keyBlocker, true);
window.addEventListener("keyup", keyBlocker, true);

// Attach mouse listeners
window.addEventListener("mousedown", mouseBlocker, true);
window.addEventListener("mouseup", mouseBlocker, true);
window.addEventListener("click", mouseBlocker, true);
window.addEventListener("dblclick", mouseBlocker, true);

// Listen for toggle events
window.addEventListener("TOGGLE_KEYBOARD_BLOCK", (event) => {
  isKeyboardBlocked = event.detail;
});

window.addEventListener("TOGGLE_MOUSE_BLOCK", (event) => {
  isMouseBlocked = event.detail;
});
