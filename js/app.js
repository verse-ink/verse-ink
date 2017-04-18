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

function replaceAll(str, match, rep) {
  tmparr = str.split(match);
  result = "";
  i = 0;
  for (; i < tmparr.length - 1; i++) {
    result += tmparr[i] + rep;
  }
  result += tmparr[i];
  return result;
};

function HTML2raw(source) {
  source = replaceAll(source, "<div></div>", "\n");
  //source = replaceAll(source, "</", "</");
  source = replaceAll(source, "</div>", "");
  source = replaceAll(source, "<div>", "\n")
  source = replaceAll(source, "<br>", "\n");
  //var parser = new DOMParser;
  //source=$(parser.parseFromString('<!doctype html><body>' +source,'text/html').body);
  source = _.unescape(source);
  //source = replaceAll(source, "&gt;", ">");
  //source = replaceAll(source, "&amp;", "&");
  source = replaceAll(source, "&nbsp;", " ");
  return source;
}

var defaults = {
  html: true, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />)
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-', // CSS language prefix for fenced blocks
  linkify: true, // autoconvert URL-like texts to links
  typographer: true, // Enable smartypants and other sweet transforms
  breaks: true, // options below are for demo only
  _highlight: true,
  _strict: false,
  _view: 'html', // html / src / debug
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + '</code></pre>';
      } catch (__) {}
    } else if (lang && (lang === "flowchart" || lang === "flow")) {
      try {
        result = drawFlowCHart(str);
        return result;
      } catch (__) {}
    } else if (lang && (lang === "sequence")) {
      try {
        result = drawSequenceDiagram(str);
        return result;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
};

var source = simplemde.value();
var md = window.markdownit(defaults);
$(document).ready(function () {
  $("a").click(function () {
    console.log(source);
    source = HTML2raw(source);
    console.log(source);
    $(".vi-2-preview>div").html(md.render(source));
  });
  $("#vi-theme-orange-dot").click(function () {
    $(".vi-2-preview>div").removeClass();
    $(".vi-2-preview>div").addClass("vit-orange-dot");
    $
  });
  $("#vi-theme-manuscript").click(function () {
    $(".vi-2-preview>div").removeClass();
    $(".vi-2-preview>div").addClass("vit-manuscript");
    $
  });
  $("#vi-theme-serif").click(function () {
    $(".vi-2-preview>div").removeClass();
    $(".vi-2-preview>div").addClass("vit-serif");
    $
  });
});
$("body").click(function () {
  var wordCount = source.match(/(\w+)/g).length;
  var readingSpeed = $("#vi-3-reading-speed").val();
  var readingTime = wordCount / readingSpeed;
  $(".vi-3-reading-time").text(moment.duration(readingTime, "minutes").humanize(true));
});

$("#vi-3-reading-speed").on('input', function () {
  var wordCount = source.match(/(\w+)/g).length;
  var readingSpeed = $("#vi-3-reading-speed").val();
  var readingTime = wordCount / readingSpeed;
  $(".vi-3-reading-time").text(moment.duration(readingTime, "minutes").humanize(true));
});
new Clipboard('button');

clipboard.on('success', function (e) {
  e.clearSelection();
  $('#vi-3-email-copied').modal('show');
});
