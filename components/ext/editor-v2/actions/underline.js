function Underline(editor) {
    this.editor = editor
    this.title = '下划线'
    this.icon = 'underline'
    this.isCurrent = false
}
Underline.prototype = {
    constructor: Underline,
    click(e){
        this.editor.cmd.do('underline')
    },
    current() {
        let el = this.editor.selection.getRangeElem()
        let isLink = el && el.tagName === 'A';
        this.isCurrent = this.editor.cmd.state('underline') && !isLink ? true : false;
    }
}
export default Underline