
function selection(editor) {
    this.editor = editor
    this.currentRange = null
}
selection.prototype = {
    constructor: selection,
    getRange(){
        return this.currentRange
    },
    saveRange(value) {
        if (value) return this.currentRange = value
        let range = this.getDefaultRange()
        let containerElem = this.getRangeElem(range)
        if (!containerElem || containerElem.getAttribute('contenteditable') === 'false') return
        this.currentRange = range
    },
    isEmpty: function () {
        const range = this._currentRange || this.getDefaultRange()
        if (range && range.startContainer) {
            if (range.startContainer === range.endContainer) {
                if (range.startOffset === range.endOffset) {
                    return true
                }
            }
        }
        return false
    },

    getText: function () {
        const range = this._currentRange || this.getDefaultRange()
        if (range) {
            return range.toString()
        } else {
            return ''
        }
    },
    getDefaultRange(){
        let _selection = window.getSelection();
        if(_selection.rangeCount === 0) return
        return _selection.getRangeAt(0)
    },
    getRangeElem(range) {
        range = range || this.currentRange
        if (range) {
            let elem = range.commonAncestorContainer
            return elem.nodeType === 1 ? elem : elem.parentNode
        }
    },
    restore() {
        let selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(this.currentRange)
    },
    createRangeByElem(elem, toStart, isContent) {
        if (!elem) return
        let range = document.createRange()
        range[isContent?'selectNodeContents':'selectNode'](elem)
        range.collapse(toStart)
        this.saveRange(range)
    }
}
export default selection