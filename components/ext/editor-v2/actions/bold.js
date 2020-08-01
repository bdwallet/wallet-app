function Bold(editor) {
    this.editor = editor
    this.title = '粗体'
    this.icon = 'bold'
    this.isCurrent = false
}

Bold.prototype = {
    constructor: Bold,
    click(e){
        this.editor.cmd.do('bold')
    },
    current() {
        let el = this.editor.selection.getRangeElem();
        let fixH = el && /^h/i.test(el.tagName);
        let isH = /^h/i.test(this.editor.cmd.value('formatBlock')) || fixH
        this.isCurrent = this.editor.cmd.state('bold') && !isH ? true : false;
    }
}
export default Bold