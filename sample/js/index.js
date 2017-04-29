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
        } else {
            $(aNode).addClass("verse-ink-selected");
        }
    },
    saveCusor: function () {
        this.markSelected();
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
                //setCaretPosition(currentObj[0],targetOffset-currentOffset);
                var range = document.createRange();
                var sel = this.sel;
                range.setStart(currentObj[0], targetOffset - currentOffset);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                //console.log(targetOffset - currentOffset);
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
                this.setCaretOffsetWithin($(childs[i]), 0, this.coffset);
                break;
            }
        }
    }

};

///////////////////
function purifyHTML(html) {
    return html.replace(/<span class="verse-ink-newline-holder"><\/span>/g, "")
        .replace(/[ ]*(class|verse_ink_blockid)=\"[^\"]*\"[ ]*/g, '')
        .replace(/(&nbsp;|[ ])/g, '\xa0');
}
function replaceAll(str, match, rep) {
    return str.replace(new RegExp(match, 'g'), rep);
}

function html2text(html) {
    var rtext = html.replace(/<span class="verse-ink-newline-holder[^"]*"><\/span>/g, "awstreytcvghbjk6d5rytfyuvgb")
        .replace(/<span class="verse-ink-caret"><\/span>/g, "esxfcgsercvghbgybujnkijm")
        .replace(/<\/\w><(p|div|pre)[^>]+>/g, "\n")
        .replace(/<[^<>]+>/g, '')//dropping all the tags
        .replace(/ /g, "&nbsp;")// replacing common spaces
        .replace(/awstreytcvghbjk6d5rytfyuvgb/g, '<span class="verse-ink-newline-holder"><\/span>')
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

function addingNewLineHolders(dirtys) {
    dirtys.each(function () {
        if ($(this).text().length === 0 && $(this).html().search("newline-holder") === -1) {
            //var offset=getCaretCharacterOffsetWithin($("#rarea")[0]);
            $(this).append('<span class="verse-ink-newline-holder"><\/span>');
        }
    });
}

function removingNewLineHolders() {
    holders = $('.verse-ink-newline-holder').each(function () {
        if ($(this).parent().text().length !== 0) {
            text = $(this).parent().text();
            $(this).parent().text(text);
            $(this).remove();

        }
    });
}
///////////////////////////////////////////////
function mdinit() {
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
    return window.markdownit(defaults).use(window.markdownitMathblock).use(window.markdownitFootnote).use(window.markdownitFootnote1).use(window.markdownitDeflist).use(window.markdownitCheckbox);
}

function autoToggleMarkups(s) {
    s.markSelected();
    var selection = s.sel;
    if (!selection.isCollapsed || selection.rangeCount !== 1) return undefined;
    var aNode = selection.anchorNode;
    //parents detection
    if ($(aNode.parentNode).is("#sarea") || $(aNode.parentNode).parents("#sarea").length > 0) {
        return 0;
    }
    //inside

    $(".markdown-markup-show").not(".verse-ink-selected").removeClass("markdown-markup-show");
    if ($(".verse-ink-selected").hasClass("markdown-markup")) {
        var classes, tmpclass, tmpnode;
        var selected = $(".verse-ink-selected");
        selected.addClass("markdown-markup-show");
        classes = selected[0].classList;
        for (i = 0; i < classes.length; i++) {
            if (classes[i].search('_open') !== -1) {
                tmpclass = classes[i];
                tmpclass = '.' + tmpclass.replace('open', 'close');
                tmpnode = $(".verse-ink-selected");
                tmpnode.nextAll(tmpclass).first().addClass('markdown-markup-show');
                break;
            }
            else if (classes[i].search('_close') !== -1) {
                tmpclass = classes[i];
                tmpclass = '.' + tmpclass.replace('close', 'open');
                tmpnode = $(".verse-ink-selected");
                tmpnode.prevAll(tmpclass).first().addClass('markdown-markup-show');
                break;
            }
        }
    }

    //previous
    if (selection.anchorOffset === 0) {
        if ($(aNode.parentNode).prev().hasClass("markdown-markup")) {
            $(aNode.parentNode).prev().addClass("markdown-markup-show");
        }
    }

    if (selection.anchorOffset === 1) {
        $(aNode.parentElement).prev(".escapeBackslash").addClass('markdown-markup-show');
    }

    //next
    if (selection.anchorOffset === selection.anchorNode.length) {
        if ($(aNode.parentNode).next().hasClass("markdown-markup")) {
            var nextNode = $(aNode.parentNode).next();
            var classes = nextNode[0].classList;
            for (i = 0; i < classes.length; i++) {
                if (classes[i].search('_open') !== -1) {
                    var tmpclass = classes[i];
                    tmpclass = '.' + tmpclass.replace('open', 'close');
                    var tmpnode = $(nextNode);
                    tmpnode.nextAll(tmpclass).first().addClass('markdown-markup-show');
                    break;
                }
            }
            $(aNode.parentNode).next().addClass('markdown-markup-show');
        }

    }

    //child
    $(aNode.parentElement).parents("strong , code , em, u").each(function () {
        $(this).next().addClass("markdown-markup-show");
        $(this).prev().addClass("markdown-markup-show");
    });
    return true;
}

function optimizedRender(r, s) {
    var source, rhtml, rtext, rendered, renderedWithoutClass, rhtmlWithoutNbspAndClass;
    var blocks = r.children();
    buildBlockSerials(blocks);
    s.saveCusor();
    addingNewLineHolders(blocks);
    removingNewLineHolders();
    source = blocks2source(blocks);
    rhtml = r.html();
    rtext = source;
    rendered = md.render(rtext);
    renderedWithoutClass = purifyHTML(rendered);
    rhtmlWithoutNbspAndClass = purifyHTML(rhtml);
    if (renderedWithoutClass === rhtmlWithoutNbspAndClass) {
        console.log("don't need be rebuilt");
    } else {
        console.log("need to be rebuilt");
        r.html(rendered);
        s.restoreCusor(r);
    }
    buildBlockSerials(blocks);
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


//should be run after rendering


function bindCusorListener() {
    function setChangeListener(div, listener) {
        div.addEventListener("blur", listener);
        div.addEventListener("keyup", listener);
        div.addEventListener("paste", listener);
        div.addEventListener("copy", listener);
        div.addEventListener("cut", listener);
        div.addEventListener("delete", listener);
        div.addEventListener("mouseup", listener);
    }

    setChangeListener(document.querySelector("#rarea"), function () {
        var r = $("#rarea");
        s = new Selection();
        optimizedRender(r, s);
        autoToggleMarkups(s);
    });
}


//the event listener for the source area
$("#sarea").bind("DOMNodeInserted DOMNodeRemoved DOMCharacterDataModified", function () {
    if (this.locked === 1) {
        return;
    }
    var source = $(this).html();
    source = HTML2raw(source);
    //console.log(source);
    $("#tarea").text(md.render(source));
    var rarea = $("#rarea");
    rarea.html(md.render(source));
    //MathJax.Hub.Queue(["Typeset", MathJax.Hub, rarea[0]]);
});
// past event listener
$(document).ready(function () {
    window.md = mdinit();
    bindCusorListener();
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
        //console.log("1\n");
    });
});