function render_escape(state, inline_token, markup) {
    state.entityMap[String(state.entityId)] = {
        "type": "hidden markup",
        "mutability": "MUTABLE",
        "data": {
            activeRange: [state.text.length, state.text.length + 2]
        }
    };
    state.entityRanges.push({
        "offset": state.text.length,
        "length": 1,
        "key": String(state.entityId)
    });
    state.entityId++;
    state.text = state.text + markup + inline_token.content;
    for (let i = 0; i < state.enabledStyles.length; i++) {
        const style = state.enabledStyles[i];
        state.styles.push({
            "offset": state.text.length - inline_token.content.length,
            "length": inline_token.content.length,
            "style": style
        });
    }
}

const trigger_types = ['escape'];
export default {
    render_fn: render_escape,
    trigger_types: trigger_types
};