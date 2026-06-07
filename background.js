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
  enabled: false
});


// Link Functions
//
// Single tab
function copyMarkdownLinkForTab(tab) {
    // Format the page title and URL into a Markdown link
    const markdownLink = `[${tab.title}](${tab.url})`;
    navigator.clipboard.writeText(markdownLink);
}
// All tabs
function copyMarkdownLinksForAllTabs() {
    const markdownLinks = tabs.map((tab) => `- [${tab.title}](${tab.url})`).join('\n');
    navigator.clipboard.writeText(markdownLinks);
    console.log('Markdown links copied to clipboard!');
}
// Group
function copyMarkdownLinksForGroup(tab) {
    const markdownLinks = tabs.map((tab) => `- [${tab.title}](${tab.url})`).join('\n');
    navigator.clipboard.writeText(markdownLinks);
    console.log('Markdown links copied to clipboard!');
}

// Listeners
//
// Page Link
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy_markdown_link_page") {
    copyMarkdownLinkForTab(tab);
  }
});
// Keyboard Shortcut Page Link
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "copy_markdown_link_page_kbd") {
    copyMarkdownLinkForTab(tab);
  }
});
// All Tabs
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy_markdown_all_tabs") {
    chrome.tabs.query({currentWindow: true}, (tabs) => {
      copyMarkdownLinksForAllTabs(tabs);
    });
  }
});
// Group Tabs
chrome.contextMenus.onShown.addListener(async (info, tab) => {
  const enabled = tab.groupId !== -1;
  await chrome.contextMenus.update("copy_markdown_group_tabs", {enabled});
  chrome.contextMenus.refresh();
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy_markdown_group_tabs") {
    const groupId = tab.groupId;
    console.log(`Group ID:  ${groupId}`);
    if (groupId === -1) {
      // Handle ungrouped case or notify the user
      console.log('No group selected');
      return;
      }
    chrome.tabs.query({currentWindow: true, groupId}, (tabs) => {
      copyMarkdownLinksForGroup(tab);
    });
  }
});

