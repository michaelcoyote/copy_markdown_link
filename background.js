// Create a context menu for page link
chrome.contextMenus.create({
  id: "copy_markdown_link_page",
  title: "Link for this Page",
  contexts: ["page", "tab"],
});

// context menu item for list of links for all tabs in a window
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


// Listener for when the context menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy_markdown_link_page") {
    // Format the page title and URL into a Markdown link
    const markdownLink = `[${tab.title}](${tab.url})`;

    // The 'copy' command requires a DOM element.
    // We can create a temporary textarea element to hold the text.
    const textarea = document.createElement("textarea");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    textarea.textContent = markdownLink;
    document.body.appendChild(textarea);
    textarea.select();

    try {
      // Use the document.execCommand for broader browser compatibility
      document.execCommand('copy');
      console.log('Markdown link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }

    // Clean up the temporary element
    document.body.removeChild(textarea);
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy_markdown_all_tabs") {
    chrome.tabs.query({currentWindow: true}, (tabs) => {
      const markdownLinks = tabs.map((tab) => `- [${tab.title}](${tab.url})`).join('\n');
      navigator.clipboard.writeText(markdownLinks);
      console.log('Markdown links copied to clipboard!');
    });
  }
});

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
      const markdownLinks = tabs.map((tab) => `- [${tab.title}](${tab.url})`).join('\n');
      navigator.clipboard.writeText(markdownLinks);
      console.log('Markdown links copied to clipboard!');
    });
  }
});

