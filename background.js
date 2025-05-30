// Set initial state when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ block: false });
});

// Listen for keyboard shortcut defined in manifest.json
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-keyboard-block") {
    // Toggle the current block state from storage
    chrome.storage.local.get("block", (data) => {
      const newState = !data.block;

      // Save new state
      chrome.storage.local.set({ block: newState });

      // Inject content.js and send the new block state to the current tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;

        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            files: ["content.js"]
          },
          () => {
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              func: (state) => {
                window.dispatchEvent(
                  new CustomEvent("TOGGLE_KEYBOARD_BLOCK", { detail: state })
                );
              },
              args: [newState]
            });
          }
        );
      });
    });
  }
});
