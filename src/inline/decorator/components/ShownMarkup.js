import React from "react";

//todo should be in style map
function show_markup_strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
        (m) => m.getEntity()
            && (contentState.getEntity(m.getEntity()).type === 'hidden markup')
            && !(contentState.getEntity(m.getEntity()).data.hidden)
        , callback);
}

const ShownMarkup = (props) => {
    return (
        <span data-offset-key={props.offsetKey} style={{color: 'gray', backgroundColor:'#eeeeee'}}>
      {props.children}
    </span>
    );
};

export class ShownMarkupDecorator{
    constructor() {
        this.strategy= show_markup_strategy;
        this.component = ShownMarkup;
    }
}