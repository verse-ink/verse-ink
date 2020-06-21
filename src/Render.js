import {render_inline} from "./inline/render";
import {CharacterMetadata, Entity} from "draft-js";
import {List, Map} from "immutable";

const md = require('./markdown-it')();

//todo do not rerender everything
export class BlockRender {
    entityMap = {};
    blocks = [];

    constructor(new_editor_state, old_editor_state) {
        this.new_editor_state = new_editor_state;
        this.new_content = new_editor_state.getCurrentContent().getBlocksAsArray();
        this.old_content = old_editor_state.getCurrentContent().getBlocksAsArray();
        this.focusKeys = new Set();
        this.focusKeys.add(new_editor_state.getSelection().getStartKey());
        this.focusKeys.add(new_editor_state.getSelection().getEndKey());
        this.focusKeys.add(old_editor_state.getSelection().getStartKey());
        this.focusKeys.add(old_editor_state.getSelection().getEndKey());
        this.dirtyCheck.bind(this);
        this.copyBlockFromNew.bind(this);
        this.renderBlock.bind(this);
    }

    dirtyCheck() {
        //dirty check
        let i = 0, j = this.new_content.length - 1, k = this.old_content.length - 1;
        while (i <= j && i <= k && this.new_content[i] === this.old_content[i]) i++;
        while (j >= 0 && k >= 0 && this.new_content[j] === this.old_content[k]) {
            j--;
            k--;
        }
        return {
            dirtyBegin: i,
            dirtyEnd: j + 1
        };
    }

    copyBlockFromNew(inx) {
        window.a=this.focusKeys;
        const currentBlock = this.focusKeys.has(this.new_content[inx].getKey()) ? this.new_content[inx].set('data',Math.random()) : this.new_content[inx];
        console.log(currentBlock.characterList);
        currentBlock.characterList&&currentBlock.characterList.forEach(i => {
            const e = i.getEntity();
            if (!e) return;
            this.entityMap[e] = this.new_editor_state.getCurrentContent().getEntity(e);
        });
        this.blocks.push(currentBlock);
    }

    renderBlock(block_id) {
        const block_key = this.new_content[block_id].getKey();
        const text = this.new_content[block_id].getText();
        const AST = md.parseInline(text, {});//parse
        const render_result = render_inline(AST[0]);

        //begin
        const charMetaDataList = (new Array(text.length)).fill(CharacterMetadata.create({entity: null}));
        render_result.styles.forEach(style => {
            for (let i = style.offset; i < style.length + style.offset; i++) {
                charMetaDataList[i] = CharacterMetadata.applyStyle(charMetaDataList[i], style.style);
            }
        });
        render_result.entityRanges.forEach(entity => {
            for (let i = entity.offset; i < entity.length + entity.offset; i++) {
                charMetaDataList[i] = CharacterMetadata.applyEntity(charMetaDataList[i], block_key + '-' + entity.key);
            }
        });
        const newBlock = this.new_content[block_id].set("characterList", new List(charMetaDataList));
        //console.log(newBlock)

        //end
        //add prefix to entity of each block
        for (let p in render_result.entityMap) {
            render_result.entityMap[p].data.blockKey = block_key;
            const e = render_result.entityMap[p];
            const key = Entity.__create(e.type, e.mutability, e.data || {});
            this.entityMap[block_key + '-' + p] = Entity.get(key);
        }
        this.blocks.push(newBlock);
    }

    render() {
        const dirtyCheckResult = this.dirtyCheck();
        const [i, j] = [dirtyCheckResult.dirtyBegin, dirtyCheckResult.dirtyEnd];
        let block_id = 0;
        for (; block_id < i; block_id++) {
            this.copyBlockFromNew(block_id);
        }
        for (; block_id < j; block_id++) {
            this.renderBlock(block_id);
        }
        for (; block_id < this.new_content.length; block_id++) {
            this.copyBlockFromNew(block_id);
        }

        return {
            "entityMap": Map(this.entityMap),
            "blocks": this.blocks
        };
    }

}

export function renderSelectionChange(contentState, selection) {
    const start = selection.getStartOffset();
    const startKey = selection.getStartKey();
    const end = selection.getEndOffset();
    const endKey = selection.getEndKey();
    const keys = Object.keys(contentState.entityMap);

    //large selection, do not show markup
    if (startKey !== endKey) {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const entity = contentState.entityMap[key];
            entity.data.hidden = 1;
        }
        return contentState;
    }

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const entity = contentState.entityMap[key];
        entity.data.hidden = 1;

        if (entity.data.blockKey !== startKey) continue;

        if ((start >= entity.data.activeRange[0] && start <= entity.data.activeRange[1])
            || (end >= entity.data.activeRange[0] && end <= entity.data.activeRange[1])
            || (start < entity.data.activeRange[0] && end > entity.data.activeRange[1])) {
            entity.data.hidden = 0;
        }
    }
    return contentState;
}

/**
 *
 * @param contentState{ContentState}
 * @param selection
 * @returns {number}
 */
export function renderSelectionChange1(contentState, selection) {
    const start = selection.getStartOffset();
    const startKey = selection.getStartKey();
    const end = selection.getEndOffset();
    const endKey = selection.getEndKey();
    let allEntities = Entity.__getAll();
    const keys = allEntities.keySeq().toArray();

    if (startKey !== endKey) {
        keys.forEach(key => {
            const entity = allEntities.get(key);
            const data = entity.get('data');
            data.hidden = 1;
            contentState = contentState.replaceEntityData(key, data);
        })
        return contentState;
    }

    keys.forEach(key => {
        const entity = allEntities.get(key);
        const data = entity.get('data');
        data.hidden = 1;

        if (data.blockKey !== startKey) return;

        if ((start >= entity.data.activeRange[0] && start <= entity.data.activeRange[1])
            || (end >= entity.data.activeRange[0] && end <= entity.data.activeRange[1])
            || (start < entity.data.activeRange[0] && end > entity.data.activeRange[1])) {
            data.hidden = 0;
            console.log("show markup");
        }
        contentState = contentState.replaceEntityData(key, data);
    })
    return contentState;

}

/*
todo:
1. discard selection state, render text
2. discard selection, render style
3. make hidden markup = shown markup, modify code
3. render selection by change entity data.
 */