function Italic(editor) {
    this.editor = editor
    this.title = '斜体'
    this.icon = 'italic'
    this.isCurrent = false
}

Italic.prototype = {
    constructor: Italic,
    click(e) {
        this.editor.cmd.do('italic')
    },
    current() {
        this.isCurrent = this.editor.cmd.state('italic') ? true : false;
    }
}
export default Italic
