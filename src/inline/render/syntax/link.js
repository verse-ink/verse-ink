let linkInfo = null;

function render_link(state, inline_token, markup) {
    switch (inline_token.type) {
        case 'link_open':
            state.open_markup(state.text.length, markup.length);
            state.text = state.text + markup;
            linkInfo = {
                left: state.text.length,
                href: inline_token.attrs[0][1],
                title: inline_token.attrs.length > 1 ? inline_token.attrs[1][1] : '',
            };
            break;
        case 'link_close':
            linkInfo.right = state.text.length;
        {
            const start_point = state.openMarkups[state.openMarkups.length - 1];
            const end_point = [state.text.length, markup.length];
            state.entityMap[String(state.entityId)] = {
                "type": "hidden markup",
                "mutability": "MUTABLE",
                "data": {
                    activeRange: [start_point[0], end_point[0] + end_point[1]],
                    linkInfo: linkInfo,
                }
            };
            state.entityRanges.push({
                "offset": start_point[0],
                "length": start_point[1],
                "key": String(state.entityId)
            });
            state.entityRanges.push({
                "offset": end_point[0],
                "length": end_point[1],
                "key": String(state.entityId)
            });
            state.entityId++;
            state.openMarkups.pop();
        }

            state.text = state.text + markup;
            linkInfo = null;
            break;
        default:
    }
}

const trigger_types = ['link_open', 'link_close'];
export default {
    render_fn: render_link,
    trigger_types: trigger_types
};