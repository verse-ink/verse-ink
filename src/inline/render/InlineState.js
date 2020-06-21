export class InlineState {
    constructor() {
        this.text = "";
        this.styles = [];
        this.entityMap = {};
        this.entityRanges = [];
        this.enabledStyles = [];
        this.openMarkups = [];
        this.entityId = 0
    }

    /**
     *
     * open markup by pushing to markup stack
     * @param {number} offset
     * @param {number} length
     */
    open_markup(offset, length) {
        this.openMarkups.push([offset, length]);
    }

    /**
     * pop the markup stack and add entity information of two markups (start+end)
     * @param {number} markup_length
     */
    end_markup(markup_length) {
        const start_point = this.openMarkups[this.openMarkups.length - 1];
        const end_point = [this.text.length, markup_length];
        this.entityMap[String(this.entityId)] = {
            "type": "hidden markup",
            "mutability": "MUTABLE",
            "data": {
                activeRange: [start_point[0], end_point[0] + end_point[1]],
            }
        };
        this.entityRanges.push({
            "offset": start_point[0],
            "length": start_point[1],
            "key": String(this.entityId)
        });
        this.entityRanges.push({
            "offset": end_point[0],
            "length": end_point[1],
            "key": String(this.entityId)
        });
        this.entityId++;
        this.openMarkups.pop();
    }

    /**
     * push style to enabled styles stack
     * @param {string} style
     */
    enable_style(style) {
        this.enabledStyles.push(style);
    }

    /**
     * pop style stack to disable style
     */
    disable_style() {
        this.enabledStyles.pop();
    }
}