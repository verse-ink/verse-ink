import React from "react";

function hide_markup_strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
        (m) => m.getEntity()
            && (contentState.getEntity(m.getEntity()).type === 'hidden markup')
           &&(contentState.getEntity(m.getEntity()).data.hidden)
        , callback);
}

const HiddenMarkup = (props) => {
    return (
        <span data-offset-key={props.offsetKey} style={{fontSize: 0}}>
      {props.children}
    </span>
    );
};

export class HiddenMarkupDecorator{
    constructor() {
        this.strategy= hide_markup_strategy;
        this.component = HiddenMarkup;
    }
}