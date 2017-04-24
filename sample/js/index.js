function replaceAll(str, match, rep) {
    var target = str;
    return target.replace(new RegExp(match, 'g'), rep);
}

function HTML2raw(source) {
    source = replaceAll(source, "<div></div>", "\n");
    //source = replaceAll(source, "</", "</");
    source = replaceAll(source, "</div>", "");
    source = replaceAll(source, "<div>", "\n");
    source = replaceAll(source, "<br>", "\n");
    //var parser = new DOMParser;
    //source=$(parser.parseFromString('<!doctype html><body>' +source,'text/html').body);
    source = _.unescape(source);
    //source = replaceAll(source, "&gt;", ">");
    //source = replaceAll(source, "&amp;", "&");
    //source = replaceAll(source, "&nbsp;", " ");
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
    var md = window.markdownit(defaults).use(window.markdownitMathblock).use(window.markdownitFootnote).use(window.markdownitFootnote1).use(window.markdownitDeflist).use(window.markdownitCheckbox);
    return md;
}

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
    function updateArea(r){
        var rhtml = r.html();
        var rtext = rhtml.replace(/<[^<>]+>/g, '');
        var rendered = md.render(rtext);
        var renderedWithoutClass = rendered.replace(/[ ]*class=\"[^\"]*\"[ ]*/g, '');
        var rhtmlWithoutNbspAndClass = rhtml.replace(/[ ]*class=\"[^\"]*\"[ ]*/g, '').replace(/&nbsp;/g, '\xa0');
        if (renderedWithoutClass=== rhtmlWithoutNbspAndClass) {
            console.log("don't need be rebuilt");
        } else {
            console.log("need to be rebuilt");
            var caretIndex = getCaretCharacterOffsetWithin(r[0]);
            r.html(rendered);
            setCaretOffset(r, 0, caretIndex);
        }
    }
    setChangeListener(document.querySelector("#rarea"), function () {
        var r = $('#rarea');
        updateArea(r);
        autoToggleMarkups();
    });
}


function autoToggleMarkups() {
    var selection;
    if (window.getSelection)
        selection = window.getSelection();
    else if (document.selection && document.selection.type != "Control")
        selection = document.selection;
    if (!selection.isCollapsed || selection.rangeCount !== 1) return undefined;
    var aNode = selection.anchorNode;
    //parents detection
    if ($(aNode.parentNode).is("#sarea") || $(aNode.parentNode).parents("#sarea").length > 0) {
        return 0;
    }

    //inside
    $(".verse-ink-selected").removeClass("verse-ink-selected");
    $(aNode.parentNode).addClass("verse-ink-selected");
    $(".markdown-markup-show").not(".verse-ink-selected").removeClass("markdown-markup-show");
    if ($(".verse-ink-selected").hasClass("markdown-markup")) {
        var selected= $(".verse-ink-selected");
        selected.addClass("markdown-markup-show");
        var classes = selected[0].classList;
        for (i = 0; i < classes.length; i++) {
            if (classes[i].search('_open') !== -1) {
                var tmpclass = classes[i];
                tmpclass = '.' + tmpclass.replace('open', 'close');
                var tmpnode = $(".verse-ink-selected");
                tmpnode.nextAll(tmpclass).first().addClass('markdown-markup-show');
                break;
            }
            else if (classes[i].search('_close') !== -1) {
                var tmpclass = classes[i];
                tmpclass = '.' + tmpclass.replace('close', 'open');
                var tmpnode = $(".verse-ink-selected");
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

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
            console.log(':' + caretOffset);
        }
    } else if ((sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

function setCaretOffset(currentObj, currentOffset, targetOffset) {

    if (targetOffset <= currentOffset + currentObj.text().length) {//inside this element

        if (currentObj.contents().length === 0) {//this is a text node
            //setCaretPosition(currentObj[0],targetOffset-currentOffset);
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(currentObj[0], targetOffset - currentOffset);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            console.log(targetOffset - currentOffset);
            return -1;
        }
        else {//this contains childs
            var tmpadd = 0;
            var offset = currentOffset;
            for (i = 0; i < currentObj.contents().length; i++) {// recursively trying all the childs
                tmpadd = setCaretOffset($(currentObj.contents()[i]), offset, targetOffset);
                if (tmpadd < 0) {// found the node
                    return -1;
                }
                else {//not in this one
                    offset += tmpadd;
                }

            }
            console.log("you are in the Neverland");//show never be executed
        }
    }
    else {//the caret should be in some element after this one
        return currentObj.text().length;
    }
}

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