function H2(editor) {
    this.editor = editor
    this.title = '标题'
    this.icon = 'heading'
    this.isCurrent = false
}

H2.prototype = {
    constructor: H2,
    click: function (e) {
        // fixIE
        let el = this.editor.selection.getRangeElem();
        let fixH = el && /^h/i.test(el.tagName);
        let isH = this.editor.cmd.value('formatBlock')=='h2' || fixH
        let tag = isH ? '<P>' : '<H2>'
        this.editor.cmd.do('formatBlock',tag)
    },
    current: function () {
        let el = this.editor.selection.getRangeElem();
        let fixH = el && /^h/i.test(el.tagName);
        let isH = /^h/i.test(this.editor.cmd.value('formatBlock')) || fixH
        this.isCurrent = isH
    }
}
export default H2