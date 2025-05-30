chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ block: false, mouseBlock: false });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-keyboard-block") {
    chrome.storage.local.get(["block", "mouseBlock"], (data) => {
      const newState = !data.block;
      chrome.storage.local.set({ block: newState });

      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (
            !tab.id ||
            !tab.url ||
            tab.url.startsWith("chrome://") ||
            tab.url.startsWith("chrome-extension://") ||
            tab.url.startsWith("about:") ||
            tab.url.startsWith("edge://")
            ) return;

          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
          }, () => {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: (keyboardState, mouseState) => {
                window.dispatchEvent(new CustomEvent("TOGGLE_KEYBOARD_BLOCK", { detail: keyboardState }));
                window.dispatchEvent(new CustomEvent("TOGGLE_MOUSE_BLOCK", { detail: mouseState }));
              },
              args: [newState, data.mouseBlock]
            });
          });
        });
      });

      // Show notification (requires permissions)
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Keyboard Blocker",
        message: newState ? "Keyboard input blocked" : "Keyboard input unblocked"
      });
    });
  }
});
