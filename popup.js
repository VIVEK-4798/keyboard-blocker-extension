// === Keyboard Toggle ===
document.getElementById("toggle").addEventListener("click", () => {
  chrome.storage.local.get(["block", "mouseBlock"], ({ block, mouseBlock }) => {
    const newState = !block;
    chrome.storage.local.set({ block: newState }, () => {
      updateButtonState("toggle", newState, "Keyboard");
      showToast(newState ? "Keyboard Blocked" : "Keyboard Unblocked");
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"]
      }, () => {
        chrome.scripting.executeScript({
          target: { tabId },
          func: (state) => {
            window.dispatchEvent(new CustomEvent("TOGGLE_KEYBOARD_BLOCK", { detail: state }));
            window.dispatchEvent(new CustomEvent("TOGGLE_MOUSE_BLOCK", { detail: state })); 
          },
          args: [newState]
        });
      });
    });
  });
});

// === Mouse Toggle ===
document.getElementById("mouseToggle").addEventListener("click", () => {
  chrome.storage.local.get("mouseBlock", ({ mouseBlock }) => {
    const newState = !mouseBlock;
    chrome.storage.local.set({ mouseBlock: newState }, () => {
      updateButtonState("mouseToggle", newState, "Mouse");
      showToast(newState ? "Mouse Blocked" : "Mouse Unblocked");
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"]
      }, () => {
        chrome.scripting.executeScript({
          target: { tabId },
          func: (state) => {
            window.dispatchEvent(new CustomEvent("TOGGLE_MOUSE_BLOCK", { detail: state }));
          },
          args: [newState]
        });
      });
    });
  });
});

// === Dark Mode Toggle ===
document.getElementById("darkToggle").addEventListener("click", () => {
  const body = document.body;
  const isDark = body.classList.toggle("dark");
  chrome.storage.local.set({ darkMode: isDark });
});

// === Help Popup ===
document.getElementById("helpBtn").addEventListener("click", () => {
  alert("Use toggles to block keyboard or mousex input.\nUse dark mode for low-light viewing.\nShortcut: Ctrl + Shift + K");
});

// === Init States on Load ===
chrome.storage.local.get(["block", "mouseBlock", "darkMode"], ({ block, mouseBlock, darkMode }) => {
  updateButtonState("toggle", block, "Keyboard Blocker");
  updateButtonState("mouseToggle", mouseBlock, "Mouse Blocker");
  if (darkMode) document.body.classList.add("dark");
});

// === Helper: Button State ===
function updateButtonState(id, enabled, label) {
  const btn = document.getElementById(id);
  btn.textContent = enabled ? `Disable ${label}` : `Enable ${label}`;
  btn.className = enabled ? "enabled" : "disabled";
}

// === Helper: Toast ===
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
    background: #333; color: #fff; padding: 8px 16px;
    border-radius: 8px; font-size: 12px; z-index: 9999;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
