// Create a context menu item
chrome.contextMenus.create({
  id: "copy_markdown_link",
  title: "Copy Markdown Link",
  contexts: ["page"],
});

// Listener for when the context menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy_markdown_link") {
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

