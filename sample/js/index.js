function Selection() {
      this._init_();
}
Selection.prototype = {
      constructor: Selection,
      _init_: function () {
            var selection;
            if (window.getSelection)
                  selection = window.getSelection();
            else if (document.selection && document.selection.type !== "Control")
                  selection = document.selection;
            this.sel = selection;
      },
      markSelected: function () {
            var selection = this.sel;
            if (!selection.isCollapsed || selection.rangeCount !== 1) return undefined;
            var aNode = selection.anchorNode;
            $(".verse-ink-selected").removeClass("verse-ink-selected");
            if (aNode.nodeType === 3) {
                  $(aNode.parentNode).addClass("verse-ink-selected");
            } else if ($(aNode).is('br')) {
                  $(aNode.parentNode).addClass("verse-ink-selected");
            } else {
                  $(aNode).addClass("verse-ink-selected");
            }
      },
      saveCusor: function () {
            var selectedBlock = $('.verse-ink-selected').parents(".markdown-block");
            if (selectedBlock.length === 0) {
                  selectedBlock = $('.verse-ink-selected.markdown-block');
                  //var coffset=getCaretCharacterOffsetWithin(selectedBlock[0])
                  if (selectedBlock.length === 0) {
                        selectedBlock = $(this.sel.anchorNode);
                  }
            }
            this.cblockid = (selectedBlock.attr("verse_ink_blockid"));
            //console.log($('.verse-ink-selected').parents(".markdown-block").length)
            this.coffset = this.getCaretCharacterOffsetWithin(selectedBlock[0]);
      },
      getCaretCharacterOffsetWithin: function (element) {
            var caretOffset = 0;
            var doc = element.ownerDocument || element.document;
            var win = doc.defaultView || doc.parentWindow;
            var sel = this.sel;
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                  var range = win.getSelection().getRangeAt(0);
                  var preCaretRange = range.cloneRange();
                  preCaretRange.selectNodeContents(element);
                  preCaretRange.setEnd(range.endContainer, range.endOffset);
                  caretOffset = preCaretRange.toString().length;
                  //console.log(':' + caretOffset);
            }

            return caretOffset;
      },
      setCaretOffsetWithin: function (currentObj, currentOffset, targetOffset) {
            if (targetOffset <= currentOffset + currentObj.text().length) {//inside this element

                  if (currentObj.contents().length === 0) {//this is a text node
                        this.setCusorPosInEl(currentObj[0], targetOffset - currentOffset);
                        return -1;
                  }
                  else {//this contains childs
                        var tmpadd = 0;
                        var offset = currentOffset;
                        for (i = 0; i < currentObj.contents().length; i++) {// recursively trying all the childs
                              tmpadd = this.setCaretOffsetWithin($(currentObj.contents()[i]), offset, targetOffset);
                              if (tmpadd < 0) {// found the node
                                    return -1;
                              }
                              else {//not in this one
                                    offset += tmpadd;
                              }

                        }
                        console.log("you are in the Neverland");//should never be executed
                  }
            }
            else {//the caret should be in some element after this one
                  return currentObj.text().length;
            }
      },
      restoreCusor: function (rarea) {
            var childs = rarea.children();
            buildBlockSerials(childs);
            for (i = 0; i < childs.length; i++) {
                  if ($(childs[i]).attr("verse_ink_blockid") === this.cblockid) {
                        this.setCaretOffsetWithin($(childs[i]), 0, Math.min(this.coffset,$(childs[i]).text().length));
                        break;
                  }
            }
      },      //inside a markup span

      setCusorPosInEl: function (el, offset) {
            //patch the firefox
            if ($(el).is('br')) {
                  el = el.parentNode;
            }

            var range = document.createRange();
            var sel = this.sel;
            range.setStart(el, offset);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
      }

};

///////////////////
function purifyHTML(html) {
      return html.replace(/<span class="verse-ink-newline-holder[^"]*">(<br>)*<\/span>/g, "")
            .replace(/(<\/span>){0,1}<span class="verse-ink-caret"><\/span>(<span[^>]*>){0,1}/g,'')
            .replace(/[ ]*(class|verse_ink_blockid)=\"[^\"]*\"[ ]*/g, '')
            .replace(/(&nbsp;| |\xa0)/g, '$nbsp;');
}
function replaceAll(str, match, rep) {
      return str.replace(new RegExp(match, 'g'), rep);
}

function html2text(html) {
      var rtext = html.replace(/<span class="verse-ink-newline-holder[^"]*">(<br>)*<\/span>/g, "awstreytcvghbjk6d5rytfyuvgb")
            .replace(/<span class="verse-ink-caret"><\/span>/g, "esxfcgsercvghbgybujnkijm")
            .replace(/<br(\/)?>/g, "")
            .replace(/<\/\w><(p|div|pre)[^>]+>/g, "\n")
            .replace(/<[^<>]+>/g, '')//dropping all the tags
            .replace(/( |&nbsp;|\xa0)/g, "&nbsp;")// replacing common spaces
            .replace(/awstreytcvghbjk6d5rytfyuvgb/g, '<span class="verse-ink-newline-holder"><br><\/span>')
            .replace(/esxfcgsercvghbgybujnkijm/g, '<span class="verse-ink-caret"><\/span>');
      rtext = _.unescape(rtext);
      return rtext;
}
function blocks2source(blocks) {
      var result = "";
      for (i = 0; i < blocks.length; i++) {
            var html = $(blocks[i]).html();
            var text = html2text(html);
            result += (text + "\n\n");
      }
      return result;
}
function HTML2raw(source) {
      source = replaceAll(source, "<div></div>", "\n");
      source = replaceAll(source, "</div>", "");
      source = replaceAll(source, "<div>", "\n");
      source = replaceAll(source, "<br>", "\n");
      source = _.unescape(source);
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
      var options = {
            theme: 'simple'
      };
      c.drawSVG(tmp, options);
      var result = tmp.innerHTML;
      tmp.innerHTML = "";
      return result;
}

function buildBlockSerials(objBlocks) {
      objBlocks.addClass("markdown-block");
      if (!objBlocks) {
            return;
      }
      for (i = 0; i < objBlocks.length; i++) {
            $(objBlocks[i]).attr('verse_ink_blockid', i);
      }
}
//should be run after change
function dirtyCheck(objBlocks) {
      if (!objBlocks) {
            return false;
      }
      var dirty = false;
      $('.verse-ink-dirty').removeClass("verse-ink-dirty");
      for (i = 1; i < objBlocks.length; i++) {
            if ($(objBlocks[i]).attr('verse_ink_blockid') === $(objBlocks[i - 1]).attr('verse_ink_blockid')) {
                  $(objBlocks[i]).addClass("verse-ink-dirty");
                  dirty = true;
            }
      }
      return dirty;
}

function addingNewLineHolders(blocks) {
      blocks.each(function () {
            if ($(this).text().length === 0 && $(this).html().search("newline-holder") === -1) {
                  //var offset=getCaretCharacterOffsetWithin($("#rarea")[0]);
                  $(this).children('br').remove();
                  $(this).append('<span class="verse-ink-newline-holder"><br><\/span>');
            }
      });
}

function removingNewLineHolders() {
      holders = $('.verse-ink-newline-holder').each(function () {
            if ($(this).parent().text().length !== 0 && !($(this).hasClass('verse-ink-selected'))) {//if there's no need to hold the line
                  text = $(this).parent().text();
                  $(this).parent().text(text);
                  $(this).remove();
            }
            if ($(this).parent().children(".verse-ink-newline-holder").length > 1) {//preventing more than one holders
                  $(this).remove();
            }
      });
}

function movingCusorIntoholders(s) {
      //move the cusor into a span tag in new-line
      var contentEls = $(s.sel.anchorNode).contents(".verse-ink-newline-holder");
      if (contentEls.length > 0) {
            s.setCusorPosInEl(contentEls[0], 0);
      }
}
///////////////////////////////////////////////
function mdinit() {
      var defaults = {
            html: true, // Enable HTML tags in source
            xhtmlOut: false, // Use '/' to close single tags (<br />)
            breaks: false, // Convert '\n' in paragraphs into <br>
            langPrefix: 'language-', // CSS language prefix for fenced blocks
            linkify: false, // autoconvert URL-like texts to links
            typographer: true, // Enable smartypants and other sweet transforms
            _highlight: true,
            _strict: false,
            _view: 'html', // html / src / debug
            highlight: function (str, lang) {
                  if (lang && hljs.getLanguage(lang)) {
                        try {
                              return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + '</code></pre>';
                        } catch (__) {
                        }
                  } else if (lang && (lang === "flowchart" || lang === "flow")) {
                        try {
                              result = drawFlowCHart(str);
                              return result;
                        } catch (__) {
                        }
                  } else if (lang && (lang === "sequence")) {
                        try {
                              result = drawSequenceDiagram(str);
                              return result;
                        } catch (__) {
                        }
                  }
                  return ''; // use external default escaping
            }
      };
      //var deflist=require("markdown-it-deflist");
      return window.markdownit(defaults);
      //.use(window.markdownitMathblock).use(window.markdownitFootnote).use(window.markdownitFootnote).use(window.markdownitDeflist).use(window.markdownitCheckbox);
}

function insertNewline(s) {
      var selectedBlock = $(s.sel.anchorNode).parents('.markdown-block');
      if (selectedBlock.length === 0) {
            selectedBlock = $(s.sel.anchorNode);
      }
      var el = $('<p class="markdown-paragraph markdown-block" verse_ink_blockid="-1"><span class="verse-ink-newline-holder"><br></span></p>')
            .insertAfter(selectedBlock);
      s.setCusorPosInEl(el.children()[0], 0);
}

function addMarkdownElListeners(s) {

      $('#rarea').find('img').click(function () {
            s.setCusorPosInEl($(this).prev()[0],1);
            autoToggleMarkups(s);
      });

      $('#rarea').find('hr').click(function () {
            s.setCusorPosInEl($(this).prev()[0],1);
            autoToggleMarkups(s);
      });
}

function autoToggleMarkups(s) {
      s.markSelected();
      var   selection = s.sel,
            aNode = selection.anchorNode,
            selected = $('.verse-ink-selected'),
            classes,
            tmpclass,
            tmpnode,
            nextNode;

      if (!selection.isCollapsed || selection.rangeCount !== 1) return undefined;

      // todo 封装进对象
      if ($(aNode.parentNode).is("#sarea") || $(aNode.parentNode).parents("#sarea").length > 0) {
            return 0;
      }

      //cleaning up (shoud be done here)
      $('.markdown-markup-show').not('.verse-ink-selected').removeClass('markdown-markup-show');

      //inside a markup span
      if (selected.hasClass('markdown-markup')) {
            selected.addClass('markdown-markup-show');
            classes = selected[0].classList;
            for (i = 0; i < classes.length; i++) {
                  if (classes[i].search('_open') !== -1) {
                        tmpclass = classes[i];
                        tmpclass = '.' + tmpclass.replace('open', 'close');
                        tmpnode = selected;
                        tmpnode.nextAll(tmpclass).first().addClass('markdown-markup-show');
                        break;
                  }
                  else if (classes[i].search('_close') !== -1) {
                        tmpclass = classes[i];
                        tmpclass = '.' + tmpclass.replace('close', 'open');
                        tmpnode = selected;
                        tmpnode.prevAll(tmpclass).first().addClass('markdown-markup-show');
                        break;
                  }
            }
      }

      //previous
      if (selection.anchorOffset === 0) {
            if ($(aNode.parentNode).prev().hasClass("markdown-markup")) {
                  nextNode = $(aNode.parentNode).prev();
                  classes = nextNode[0].classList;
                  for (i = 0; i < classes.length; i++) {
                        if (classes[i].search('_close') !== -1) {
                              tmpclass = classes[i];
                              tmpclass = '.' + tmpclass.replace('close', 'open');
                              tmpnode = $(nextNode);
                              tmpnode.prevAll(tmpclass).first().addClass('markdown-markup-show');
                              break;
                        }
                  }
                  $(aNode.parentNode).prev().addClass('markdown-markup-show');
            }
      }

      // escaped char
      if (selection.anchorOffset === 1) {
            $(aNode.parentElement).prev(".escapeBackslash").addClass('markdown-markup-show');
      }

      //next
      if (selection.anchorOffset === selection.anchorNode.length) {
            if ($(aNode.parentNode).next().hasClass("markdown-markup")) {
                  nextNode = $(aNode.parentNode).next();
                  classes = nextNode[0].classList;
                  for (i = 0; i < classes.length; i++) {
                        if (classes[i].search('_open') !== -1) {
                              tmpclass = classes[i];
                              tmpclass = '.' + tmpclass.replace('open', 'close');
                              tmpnode = $(nextNode);
                              tmpnode.nextAll(tmpclass).first().addClass('markdown-markup-show');
                              break;
                        }
                  }
                  $(aNode.parentNode).next().addClass('markdown-markup-show');
            }

      }

      //inside a textnode of strong,code,...
      $(aNode).parents("strong,code,em,u,s,a").each(function () {
            $(this).next().addClass("markdown-markup-show");
            $(this).prev().addClass("markdown-markup-show");
      });
      return true;
}

function handleSelection(s) {
// rules for selection based change before rendering
      movingCusorIntoholders(s);
      //rules for hr
      if ($(s.sel.anchorNode.parentNode).is('.markdown-markup-hr')){
            if ($(s.sel.anchorNode.parentNode).parent().next().length===0){
                  //console.log("shouldInsert");
                  var selectedBlock = $(s.sel.anchorNode).parents('.markdown-block');
                  if (selectedBlock.length === 0) {
                        selectedBlock = $(s.sel.anchorNode);
                  }
                  var el = $('<p class="markdown-paragraph markdown-block" verse_ink_blockid="-1"><span class="verse-ink-newline-holder"><br></span></p>')
                        .insertAfter(selectedBlock);
            }

      }

      if ($(s.sel.anchorNode).is('div .markdown-block')){

            if ($(s.sel.anchorNode).children('hr').length===0) return;
            // get down from top
            if (s.sel.anchorOffset===1){
                  var el=$(s.sel.anchorNode).next().children()[0];
                  s.setCusorPosInEl(el,0);
            }
            //get up
            if (s.sel.anchorOffset===2){
                  var el=$(s.sel.anchorNode).children().first().contents()[0];
                  var len=$(el).text().length;
                  s.setCusorPosInEl(el,len);
            }
      }
      // fixing the firefox
      if ($(s.sel.anchorNode.parentNode).is('div .markdown-block')){

            if ($(s.sel.anchorNode.parentNode).children('hr').length===0) return;
            // get down from top
                  var el=$(s.sel.anchorNode.parentNode).next().children()[0];
                  s.setCusorPosInEl(el,0);
      }
}

function optimizedRender(r, s) {
      var source,
            rhtml,
            rtext,
            rendered,
            renderedWithoutClass,
            rhtmlWithoutNbspAndClass;

      if (window.kill === 1)return;

      //pre-render DOM and selection operation
      var blocks = r.children();
      buildBlockSerials(blocks);
      s.markSelected();

      //hold the empty lines
      addingNewLineHolders(blocks);
      removingNewLineHolders();
      //DOM and selection change based on cusor pos
      handleSelection(s);


      s.saveCusor();


      source = blocks2source(r.children());
      rhtml = replaceAll(r.html(), "<br>", "");
      rtext = source;
      rendered = md.render(rtext);
      renderedWithoutClass = purifyHTML(rendered);
      rhtmlWithoutNbspAndClass = purifyHTML(rhtml);

      if (renderedWithoutClass === rhtmlWithoutNbspAndClass) {
            console.log("don't need to be rebuilt");
      } else {
            console.log("have to be rebuilt");
            r.html(rendered);
            //restorec(s);
            s.restoreCusor(r);
      }


      //caret.remove();
      buildBlockSerials(blocks);
      addMarkdownElListeners(s);
}

function savec(){
      pasteHtmlAtCaret('<span class="verse-ink-caret"></span>');
}

function restorec(s){
      var caret=$('.verse-ink-caret').first();


}

function pasteHtmlAtCaret(html) {
      var sel, range;
      if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (!sel.isCollapsed)return;
            if (sel.getRangeAt && sel.rangeCount) {
                  range = sel.getRangeAt(0);
                  range.deleteContents();
                  // Range.createContextualFragment() would be useful here but is
                  // non-standard and not supported in all browsers (IE9, for one)
                  var el = document.createElement("div");
                  el.innerHTML = html;
                  var frag = document.createDocumentFragment(), node, lastNode;
                  while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                  }
                  range.insertNode(frag);

                  // Preserve the selection
                  if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                  }
            }
      } else if (document.selection && document.selection.type !== "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
      }
}

function bindCusorListener() {
      function setChangeListener(div, listener) {
            div.addEventListener("blur", listener);
            //div.addEventListener("DOMNodeInserted", listener);
            div.addEventListener("keyup", listener);
            div.addEventListener("copy", listener);
            div.addEventListener("cut", listener);
            div.addEventListener("delete", listener);
            div.addEventListener("mouseup", listener);
      }

      setChangeListener(document.querySelector("#rarea"), function () {

            var r = $("#rarea");
            if (r[0].locked === 1) {
                  return;
            }
            r[0].locked = 1;
            s = new Selection();

            optimizedRender(r, s);
            autoToggleMarkups(s);
            r[0].locked = 0;
      });
}

// the return key handler
function keyHandler() {
      $('#rarea').keydown(function (e) {
            s = new Selection();
            if (!s.sel.isCollapsed) return;

            //enter
            if (e.keyCode === 13) {
                  //inside a paragraph
                  if ($(s.sel.anchorNode).parents(".markdown-block").text().length === 0) {
                        insertNewline(s);
                        return false;
                  }
                  return true;
            }

            //backspace
            if (e.keyCode === 8) {
                  //inside a paragraph
                  var anode = s.sel.anchorNode,
                        offset = s.sel.anchorOffset,
                        imgEl,
                        spanEl,
                        selectedBlock = $(anode).parents('.markdown-block');

                  //quick deletion of images
                  if ($(anode).is('p') && $($(anode).children()[offset - 1]).is('img')) {
                        imgEl = $(anode).children()[offset - 1];
                        spanEl = $(anode).children()[offset - 2];
                        $(imgEl).remove();

                        //reusing the span node
                        $(spanEl).text("");
                        $(spanEl).removeClass('markdown-markup markdown-markup-open image').addClass('markdown-text');
                        s.setCusorPosInEl(spanEl, 0);

                        return false;
                  }

                  //fixing firefox bug by manually handle the backspace key
                  if (s.getCaretCharacterOffsetWithin(selectedBlock[0]) === 0 && selectedBlock.prev().length !== 0) {
                        var htmlToInsert = selectedBlock.html();

                        console.log('bug!!!');
                        var tmpels = $(htmlToInsert).insertAfter(selectedBlock.prev().children().last());
                        selectedBlock.remove();
                        s.setCusorPosInEl(tmpels[0], 0);
                        return false;
                  }
                  return true;
            }
      });
}

keyHandler();
//the event listener for the source area
$("#sarea").bind("DOMNodeInserted DOMNodeRemoved DOMCharacterDataModified", function () {
      if (this.locked === 1) {
            return;
      }
      var source = $(this).html();
      source = HTML2raw(source);
      //console.log(source);
      $("#tarea").text($(this).html());
      var rarea = $("#rarea");
      rarea.html(md.render(source));
      //MathJax.Hub.Queue(["Typeset", MathJax.Hub, rarea[0]]);
});
// past event listener
$(document).ready(function () {
      window.md = mdinit();
      bindCusorListener();
      var sourceArea = document.querySelector("#rarea");
      sourceArea.addEventListener("paste", function (e) {
            e.preventDefault();
            var text = e.clipboardData.getData("text/plain");
            var temp = document.querySelector("#tmp");
            temp.innerHTML = text;
            sourceArea.locked = 1;
            document.execCommand("insertHTML", false, replaceAll(temp.textContent, "\n", "<br>"));
            sourceArea.locked = 0;
            $(sourceArea).trigger("DOMNodeInserted");
      });
});

$("#rarea").bind("DOMNodeInserted", function () {

});