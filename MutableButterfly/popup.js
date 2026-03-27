// popup.js
chrome.windows.create({
  url: "converter.html", // This is your main app page
  type: "popup",         // This makes it look like a standalone widget
  width: 400,
  height: 600
});

// Now that the big window is opening, the tiny popup can die peacefully.
window.close();