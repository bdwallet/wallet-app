function Head(editor) {
    this.editor = editor
    this.title = '标题'
    this.icon = 'heading'
    this.isCurrent = false
}

Head.prototype = {
    constructor: Head,
    init(){
        
    },
    click(value) {
        editor.cmd.do('formatBlock',value)
    },
    current(e) {
        this.isCurrent = true
    }
}
export default Head