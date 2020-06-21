import {CompoundDecorator} from "../../util/CompoundDecorator";
import {LinkDecorator} from './components/Link'
import {HiddenMarkupDecorator} from "./components/HiddenMarkup";
import {InlineImageDecorator} from "./components/InlineImage";
import {ShownMarkupDecorator} from "./components/ShownMarkup";
import {CompositeDecorator} from "draft-js";

const DECORATORS = [InlineImageDecorator, LinkDecorator, HiddenMarkupDecorator,ShownMarkupDecorator];

export class InlineDecorator {
    constructor(setSelection) {
        this.__decorator = new CompositeDecorator(DECORATORS.map(component => new component(setSelection)));
    }

    getDecorations(block, contentState) {
        return this.__decorator.getDecorations(block, contentState);
    }

    getComponentForKey(key) {
        return this.__decorator.getComponentForKey(key);
    }

    getPropsForKey(key) {
        return this.__decorator.getPropsForKey(key);
    }
}