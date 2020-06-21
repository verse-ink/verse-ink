function render_image(state, inline_token, markup) {
    state.entityMap[String(state.entityId)] = {
        "type": "hidden markup",
        "mutability": "MUTABLE",
        "data": {
            activeRange: [state.text.length, state.text.length + inline_token.content.length],
            imgInfo: {
                src: inline_token.attrs[0][1],
                alt: inline_token.attrs[1][1],
                title: inline_token.attrs.length > 2 ? inline_token.attrs[2][1] : ''
            }
        }
    };
    state.entityRanges.push({
        "offset": state.text.length,
        "length": inline_token.content.length,
        "key": String(state.entityId)
    });
    state.entityId++;
    state.text = state.text + inline_token.content;
    
}

const trigger_types = ['image'];
export default {
    render_fn: render_image,
    trigger_types: trigger_types
};