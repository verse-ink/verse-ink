import React from 'react';
import {ContentState, convertFromRaw, convertToRaw, Editor, EditorState, Entity, SelectionState} from 'draft-js';
import {BlockRender, renderSelectionChange, renderSelectionChange1} from "./Render";
import {InlineDecorator} from './inline/decorator';
import InlineStyleMap from './inline/style-map';

function App() {
    const setSelection = (anchorKey, anchorOffset, focusKey, focusOffset, backward) => {
        let selectionState = SelectionState.createEmpty(anchorKey).merge({
            focusKey: focusKey || anchorKey,
            focusOffset: focusOffset === undefined ? anchorOffset : focusOffset,
            anchorKey: anchorKey,
            anchorOffset: anchorOffset,
            isBackward: backward,
            hasFocus: true
        });
        setEditorState(editorState => {
            const new_editor_state = EditorState.forceSelection(editorState, selectionState);
            const renderResult = renderSelectionChange(convertToRaw(editorState.getCurrentContent()), new_editor_state.getSelection());
            const contentState = convertFromRaw(renderResult);
            const editorState_content_updated = EditorState.push(new_editor_state, contentState, 'whatever');
            return EditorState.forceSelection(editorState_content_updated, new_editor_state.getSelection());
        });
    };

    const [editorState, setEditorState] = React.useState(
        EditorState.createEmpty(new InlineDecorator(setSelection)),
    );

    const onChange = (new_editor_state) => setEditorState(editorState => {
        let renderResult = null;
        let contentState = null;
        //if (editorState.getCurrentContent() === new_editor_state.getCurrentContent()) {
        //    contentState = renderSelectionChange1(new_editor_state.getCurrentContent(), new_editor_state.getSelection());
        //} else {
        renderResult = (new BlockRender(new_editor_state, editorState)).render();//render AST
        contentState = ContentState.createFromBlockArray(renderResult.blocks, renderResult.entityMap);
        Entity.__loadWithEntities(renderResult.entityMap);
        contentState = renderSelectionChange1(contentState, new_editor_state.getSelection());//render selection
        // }
        const editorState_content_updated = EditorState.push(new_editor_state, contentState, 'whatever');
        return EditorState.forceSelection(editorState_content_updated, new_editor_state.getSelection());
    });

    return (
        <div>
            <div><Editor customStyleMap={InlineStyleMap} editorState={editorState} onChange={onChange}/></div>
            <hr/>
            <div>{JSON.stringify(editorState.getSelection())}
            </div>
        </div>
    );
}


export default App;
