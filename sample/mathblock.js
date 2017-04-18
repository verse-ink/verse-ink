// Parse backticks

'use strict';

module.exports = function mathblock(state, silent) {
  var start, max, marker, matchStart, matchEnd, token,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);
  if (ch !== 0x24/* $ */) { return false; }
  start = pos;
  pos++;
  max = state.posMax;
  while (pos < max && state.src.charCodeAt(pos) === 0x24/* $ */) { pos++; }

  marker = state.src.slice(start, pos);
  console.log(marker);
  matchStart = matchEnd = pos;

  while ((matchStart = state.src.indexOf(marker, matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x24/* $ */) { matchEnd++; }

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        token         = state.push('text', '', 0);
        token.markup  = marker;
        token.content = marker + state.src.slice(pos, matchStart)
                                 .replace(/\\/g, '\\') + marker;
      }
      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) { state.pending += marker; }
  state.pos += marker.length;
  return true;
};
