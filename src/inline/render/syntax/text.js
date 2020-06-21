function render_text(state, inline_token, markup) {

    //skip empty state.text
    if (inline_token.content.length === 0) return;
    state.text = state.text + inline_token.content;
    //apply style
    for (let i = 0; i < state.enabledStyles.length; i++) {
        const style = state.enabledStyles[i];
        state.styles.push({
            "offset": state.text.length - inline_token.content.length,
            "length": inline_token.content.length,
            "style": style
        });
    }

}

const trigger_types = ['text'];
export default {
    render_fn: render_text,
    trigger_types: trigger_types
};