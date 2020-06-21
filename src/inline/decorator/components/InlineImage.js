import React from "react";

function inline_image_strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((m) => m.getEntity()
        && (contentState.getEntity(m.getEntity()).type === 'hidden markup')
        && (contentState.getEntity(m.getEntity()).getData().imgInfo)
        , callback);
}

const makeInlineImage = (setSelection)=>(props) => {
    const contentState = props.contentState;
    const block = contentState.getBlockForKey(props.blockKey);
    const i = props.start;
    const entity = block.getEntityAt(i);
    const imgInfo = (contentState.getEntity(entity).getData()).imgInfo;
    return (
        <span data-offset-key={props.offsetKey} style={{fontSize: 0}}>
             <img src={imgInfo.src} alt={imgInfo.alt || "Image"} title={imgInfo.title} height={80} onClick={() => {
                 setSelection(props.blockKey, props.start+2);
             }}/>
            {props.children}

    </span>
    );
};

export class InlineImageDecorator {
    constructor(setSelection) {
        this.strategy = inline_image_strategy;
        this.component = makeInlineImage(setSelection);
    }
}
