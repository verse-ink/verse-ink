function render_strong(state, inline_token, markup) {
    switch (inline_token.type) {
        case 'strong_open':
            state.open_markup(state.text.length, markup.length);
            state.enable_style('BOLD');
            state.text = state.text + markup;
            break;
        case 'strong_close':
            state.end_markup(markup.length);
            state.disable_style();
            state.text = state.text + markup;
            break;
        default:
    }
}

const trigger_types = ['strong_open', 'strong_close'];
export default {
    render_fn: render_strong,
    trigger_types: trigger_types
};