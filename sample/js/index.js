 function replaceAll(str, match, rep) {
   tmparr = str.split(match);
   result = "";
   i = 0;
   for (; i < tmparr.length - 1; i++) {
     result += tmparr[i] + rep;
   }
   result += tmparr[i];
   return result;
 }

 function HTML2raw(source) {
   source = replaceAll(source, "<div></div>", "\n");
   //source = replaceAll(source, "</", "</");
   source = replaceAll(source, "</div>", "");
   source = replaceAll(source, "<div>", "\n")
   source = replaceAll(source, "<br>", "\n");
   source = replaceAll(source, "&gt;", ">");
   source = replaceAll(source, "&amp;", "&");
   source = replaceAll(source, "&nbsp;", " ");
   return source;
 }

 function drawFlowCHart(str) {
   var c = flowchart.parse(str);
   var tmp = document.querySelector("#tmp");
   c.drawSVG(tmp);
   var result = tmp.innerHTML;
   tmp.innerHTML = "";
   return result;
 }
 function drawSequenceDiagram(str) {
   var c = Diagram.parse(str);
   var tmp = document.querySelector("#tmp");
   var options = {theme: 'simple'};
   c.drawSVG(tmp,options);
   //c.drawSVG(document.querySelector("#tmp");
   var result = tmp.innerHTML;
   tmp.innerHTML = "";
   return result;
 }
 ///////////////////////////////////////////////
 //var hljs = require('highlight.js') // https://highlightjs.org/
 // to do http://liuhao.im/english/2015/11/10/the-sync-scroll-of-markdown-editor-in-javascript.html
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
     }
     else if (lang && (lang === "sequence")) {
       try {
         result = drawSequenceDiagram(str);
         return result;
       } catch (__) {}
     }
     return ''; // use external default escaping
   }
 };
 //var deflist=require("markdown-it-deflist");
 var md = window.markdownit(defaults)
   .use(window.markdownitFootnote)
   .use(window.markdownitDeflist)
   .use(window.markdownitMathjax)
   .use(window.markdownitCheckbox);
 ///////////////////////////////////////////////
 //$().onchange(function(){});
 $("#sarea").bind("DOMNodeInserted DOMNodeRemoved DOMCharacterDataModified", function () {
   if (this.locked === 1) {
     return;
   }
   var source = $(this).html();
   source = HTML2raw(source);
   console.log(source);
   $("#tarea").text(md.render(source));
   var rarea = $("#rarea");
   rarea.html(md.render(source));
   MathJax.Hub.Queue(["Typeset", MathJax.Hub, rarea[0]]);
 });
 $(document).ready(function () {
   var sourceArea = document.querySelector("#sarea");
   sourceArea.addEventListener("paste", function (e) {
     e.preventDefault();
     var text = e.clipboardData.getData("text/plain");
     var temp = document.querySelector("#tmp");
     temp.innerHTML = text;
     sourceArea.locked = 1;
     document.execCommand("insertHTML", false, replaceAll(temp.textContent, "\n", "<br>"));
     sourceArea.locked = 0;
     $(sourceArea).trigger("DOMNodeInserted");
     tmp.innerHTML = "";
     console.log("1\n");
   });
 });
