
import bold from './bold.js'
import italic from './italic.js'
import h2 from './h2.js'
import link from './link'
import image from './image.js'
import underline from './underline.js'
let menus = {
    h2,
    bold,
    italic,
    link,
    image,
    underline
}


function Menus(editor) {
    this.editor = editor
    this.menus = {}
    editor.toolbar.forEach(name => {
        this.menus[name] = new menus[name](editor)
    })
}

Menus.prototype = {
    constructor: Menus,
    current() {
        let menus = this.menus
        for(let name in menus){
            let menu = menus[name];
            if(menu.current) menu.current(name)
        }
    }
}
export default Menus