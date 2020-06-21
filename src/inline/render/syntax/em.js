function render_em(state, inline_token, markup) {
    switch (inline_token.type) {
        case 'em_open':
            state.open_markup(state.text.length, markup.length);
            state.enable_style('ITALIC');
            state.text = state.text + markup;
            break;
        case 'em_close':
            state.end_markup(markup.length);
            state.disable_style();
            state.text = state.text + markup;
            break;
        default:
    }
}

const trigger_types = ['em_open', 'em_close'];
export default {
    render_fn: render_em,
    trigger_types: trigger_types
};