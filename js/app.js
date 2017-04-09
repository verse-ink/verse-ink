var simplemde = new SimpleMDE({
  autosave: {
    enabled: true,
    uniqueId: "vi-1-textarea",
    delay: 1000,
  },
  element: document.getElementById("vi-1-textarea"),
  forceSync: true,
  indentWithTabs: true,
  placeholder: "Start typing or drop a file here...",
  spellChecker: false,
  tabSize: 4,
  toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "table", "horizontal-rule", "|", "preview"],
});
