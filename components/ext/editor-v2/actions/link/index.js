import panel from '../../panel'
import component from './component'
function Link(editor) {
    this.editor = editor
    this.title = '链接'
    this.icon = 'link'
    this.isCurrent = false 
}
Link.prototype = {
    constructor: Link,
    init(toolbar){
        this.panel = new panel({
            component,
            button:this
        })
    },
    click (e) {
        this.panel.show()
    },
    current(e) {
        let isA = false;
        let range = this.editor.selection.getDefaultRange()
        let el = this.editor.selection.getRangeElem(range)
        if(!el) return false
        // fixIE
        if(el.tagName === 'P'){
            let p = el.childNodes;
            let a = el.getElementsByTagName('a')
            if(p.length==1 && a.length){
                isA = true
            }
        }
        this.isCurrent = el.tagName === 'A' || isA
    }
}
export default Link