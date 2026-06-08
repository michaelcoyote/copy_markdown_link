// background.js - three functions to create context menu items and
// three listeners to handle click events


// Context items
// All menu items have page and tab contexts.
//
// page link
chrome.contextMenus.create({
  id: "copy_markdown_link_page",
  title: "Link for this Page",
  contexts: ["page", "tab"],
});
// list of links for all tabs in a window
chrome.contextMenus.create({
  id: "copy_markdown_all_tabs",
  title: "Links for All Tabs in Window",
  contexts: ["page", "tab"],
});
// group tabs
chrome.contextMenus.create({
  id: "copy_markdown_group_tabs",
  title: "Links for Tab Group",
  contexts: ["page", "tab"],
  enabled: false,
});

// Helper functions
//
// Write to clipboard
//  handle promise from navigator.clipboard.writeText()
function writeToClipboard(text) {
  try{
    navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to write to clipboard: ", err);
  }
}
// Link Functions
//
// Format markdown link
function formatLink(tab) {
  return `[${tab.title}](${tab.url})`;
}
// Single tab
function copyMarkdownLinkForTab(tab) {
  // Format the page title and URL into a Markdown link
  return writeToClipboard(formatLink(tab));
}
// Multiple tabs
function copyMarkdownLinksForMultipleTabs(tabs) {
  console.debug(`Copying links to clipboard for ${tabs.length} tabs`);
  return writeToClipboard(tabs.map((tab) => `- ${formatLink(tab)}`).join("\n"));
}

// Listeners
//
// Command listeners
//
// Keyboard Shortcut Page Link
chrome.commands.onCommand.addListener((command, tab) => {
  switch (command) {
    case "copy_markdown_link_page_kbd":
      console.debug("KBD command: copy_markdown_link_page_kbd");
      copyMarkdownLinkForTab(tab);
      break;
    case "copy_markdown_all_tabs_kbd":
      console.debug("KBD command: copy_markdown_all_tabs_kbd");
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        copyMarkdownLinksForMultipleTabs(tabs);
      });
      break;
    case "copy_markdown_group_tabs_kbd":
      if(tab.groupId !== -1) {
        console.debug("KBD command: copy_markdown_group_tabs_kbd");
        chrome.tabs.query({currentWindow: true, groupId: tab.groupId}, (tabs) => {
          copyMarkdownLinksForMultipleTabs(tabs);
        });
      } else {
        console.log("No group selected");
        return;
      }
      break;
  }
});
//
// Menu listeners
//
// Page Link
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy_markdown_link_page") {
    copyMarkdownLinkForTab(tab);
  }
});
// All Tabs
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy_markdown_all_tabs") {
    chrome.tabs.query({currentWindow: true}, (tabs) => {
      copyMarkdownLinksForMultipleTabs(tabs);
    });
  }
});
// Group Tabs
chrome.contextMenus.onShown.addListener((info, tab) => {
  const enabled = tab.groupId !== -1;
  chrome.contextMenus.update("copy_markdown_group_tabs", {enabled});
  chrome.contextMenus.refresh();
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy_markdown_group_tabs") {
    const groupId = tab.groupId;
    console.log(`Group ID:  ${groupId}`);
    if (groupId === -1) {
      // Handle ungrouped case or notify the user
      console.log("No group selected");
      return;
    }
    chrome.tabs.query({currentWindow: true, groupId}, (tabs) => {
      copyMarkdownLinksForMultipleTabs(tabs);
    });
  }
});

