import em from './syntax/em';
import text from './syntax/text';
import strong from './syntax/strong';
import strikethrough from "./syntax/strikethrough";
import link from "./syntax/link";
import code_inline from "./syntax/code-inline";
import escape from "./syntax/escape";
import image from "./syntax/image";

import {InlineState} from "./InlineState";

const ENABLED_SYNTAX = [em, text, strong, strikethrough, link, code_inline, escape, image];
const DISPATCH = {};
for (let i=0;i<ENABLED_SYNTAX.length;i++){
    const rule = ENABLED_SYNTAX[i];
    for (let j=0;j<rule.trigger_types.length;j++)
        DISPATCH[rule.trigger_types[j]]=rule.render_fn;
}

/**
 *
 * @param {Token} inline_node
 */
export const render_inline = (inline_node) => {

    const state = new InlineState();
    for (let i = 0; i < inline_node.children.length; i++) {
        const inline_token = inline_node.children[i];
        const markup = inline_token.markup;

        const render_fn = DISPATCH[inline_token.type];
        if (!render_fn) {console.log(inline_token);continue;}
        render_fn(state, inline_token, markup);
    }

    return state;
};