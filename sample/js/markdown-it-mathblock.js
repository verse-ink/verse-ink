/*! markdown-it-footnote 3.0.1 https://github.com//markdown-it/markdown-it-footnote @license MIT */
(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f()
  } else if (typeof define === "function" && define.amd) {
    define([], f)
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window
    } else if (typeof global !== "undefined") {
      g = global
    } else if (typeof self !== "undefined") {
      g = self
    } else {
      g = this
    }
    g.markdownitMathblock = f()
  }
})(function () {
  var define, module, exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f
        }
        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];
          return s(n ? n : e)
        }, l, l.exports, e, t, n, r)
      }
      return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
  })({
    1: [function (require, module, exports) {
      // Process footnotes
      //
      'use strict';

      ////////////////////////////////////////////////////////////////////////////////
      // Renderer partials

      module.exports = function math_inline(md) {
        function mathblock(state, silent) {
          var start, max, marker, matchStart, matchEnd, token,
            pos = state.pos,
            ch = state.src.charCodeAt(pos);
          if (ch !== 0x24 /* $ */ ) {
            return false;
          }
          start = pos;
          pos++;
          max = state.posMax;
          while (pos < max && state.src.charCodeAt(pos) === 0x24 /* $ */ ) {
            pos++;
          }

          marker = state.src.slice(start, pos);
          console.log(marker);
          matchStart = matchEnd = pos;

          while ((matchStart = state.src.indexOf(marker, matchEnd)) !== -1) {
            matchEnd = matchStart + 1;

            while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x24 /* $ */ ) {
              matchEnd++;
            }

            if (matchEnd - matchStart === marker.length) {
              if (!silent) {
                token = state.push('text', '', 0);
                token.markup = marker;
                token.content = marker + state.src.slice(pos, matchStart)
                  .replace(/\\/g, '\\') + marker;
              }
              state.pos = matchEnd;
              return true;
            }
          }

          if (!silent) {
            state.pending += marker;
          }
          state.pos += marker.length;
          return true;
        }
        md.inline.ruler.after('escape', 'math_inline', mathblock);
      };

}, {}]
  }, {}, [1])(1)
});
