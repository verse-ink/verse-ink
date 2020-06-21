function render_strikethrough(state, inline_token, markup) {
    switch (inline_token.type) {
        case 's_open':
            state.open_markup(state.text.length, markup.length);
            state.enable_style('STRIKETHROUGH');
            state.text = state.text + markup;
            break;
        case 's_close':
            state.end_markup(markup.length);
            state.disable_style();
            state.text = state.text + markup;
            break;
        default:
    }
}

const trigger_types = ['s_open', 's_close'];
export default {
    render_fn: render_strikethrough,
    trigger_types: trigger_types
};