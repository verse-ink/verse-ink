import React from "react";

function link_strategy(contentBlock, callback, contentState) {
    const text = contentBlock.getText();
    for (let i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) !== 91) continue;
        const m = contentBlock.getEntityAt(i);
        if (m && contentState.getEntity(m).getData().linkInfo) {
            callback(contentState.getEntity(m).getData().linkInfo.left, contentState.getEntity(m).getData().linkInfo.right);
        }

    }
}

const Link = (props) => {
    const contentState = props.contentState;
    const block = contentState.getBlockForKey(props.blockKey);
    for (let i = props.start; i >= 0; i--) {
        const entity = block.getEntityAt(i);
        if (!entity) continue;
        const entityData = (contentState.getEntity(entity).getData());
        if (entityData.linkInfo) {
            return (
                <a href={entityData.linkInfo.href} title={entityData.linkInfo.title || ""}>
                    {props.children}
                </a>
            );
        }
    }
};

export class LinkDecorator{
    constructor() {
        this.strategy= link_strategy;
        this.component = Link;
    }
}
