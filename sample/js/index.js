function replaceAll(str, match, rep) {
    //var target = str;
    //return target.replace(new RegExp(match, 'g'), rep);


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
    //var parser = new DOMParser;
    //source=$(parser.parseFromString('<!doctype html><body>' +source,'text/html').body);
    source = _.unescape(source);
    //source = replaceAll(source, "&gt;", ">");
    //source = replaceAll(source, "&amp;", "&");
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
    var options = {
        theme: 'simple'
    };
    c.drawSVG(tmp, options);
    //c.drawSVG(document.querySelector("#tmp");
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

//当前节点前后第一个 *a*bccccccccc
//父节点如果不是span，前后
//当前节点如果是markup
//
function autoToggleMarkups() {
    var selection;
    if (window.getSelection)
        selection = window.getSelection();
    else if (document.selection && document.selection.type != "Control")
        selection = document.selection;
    if (!selection.isCollapsed || selection.rangeCount !== 1) return undefined;
    var aNode = selection.anchorNode;

    //parents detection
    if ($(aNode.parentNode).is("#sarea")||$(aNode.parentNode).parents("#sarea").length>0 ){return 0;}


    //inside
    $(".verse-ink-selected").removeClass("verse-ink-selected");
    $(aNode.parentNode).addClass("verse-ink-selected");
    $(".markdown-markup-show").not(".verse-ink-selected").removeClass("markdown-markup-show");

    if ($(".verse-ink-selected").hasClass("markdown-markup")) {
        var classes = $(".verse-ink-selected")[0].classList;
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
    $(aNode.parentElement).parents("strong , code , em, u").each(function(){
        $(this).next().addClass("markdown-markup-show");
        $(this).prev().addClass("markdown-markup-show");
    });
    return true;
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
        //console.log("1\n");
    });
});

setInterval(autoToggleMarkups, 300);