function render_code_inline(state, inline_token, markup) {
    state.styles.push({
        "offset": state.text.length + markup.length,
        "length": inline_token.content.length,
        "style": 'CODE'
    });
    state.open_markup(state.text.length, markup.length);
    state.text = state.text + markup + inline_token.content;
    state.end_markup(markup.length);
    state.text = state.text + markup;
}

const trigger_types = ['code_inline'];
export default {
    render_fn: render_code_inline,
    trigger_types: trigger_types
};