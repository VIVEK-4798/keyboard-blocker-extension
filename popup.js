document.getElementById("toggle").addEventListener("click", async () => {
  chrome.storage.local.get("block", ({ block }) => {
    const newState = !block;
    chrome.storage.local.set({ block: newState }, () => {
      document.getElementById("toggle").textContent = newState ? "Disable" : "Enable";
    });

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"]
        }, () => {
            // After injecting content.js, dispatch the event
            chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: (state) => {
                window.dispatchEvent(new CustomEvent("TOGGLE_KEYBOARD_BLOCK", { detail: state }));
            },
            args: [newState]
            });
        });
        });
  });
});

// Set button label on load
chrome.storage.local.get("block", ({ block }) => {
  document.getElementById("toggle").textContent = block ? "Disable" : "Enable";
});
