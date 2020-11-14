function Image(editor) {
    this.editor = editor
    this.title = '图片'
    this.icon = 'image'
    this.isCurrent = false
}

Image.prototype = {
    constructor: Image,
    click(e) {
        this.editor.$uploader({
            url:this.editor.uploadBase,
            field:'file',
            fileChange: () =>{
                this.editor.upImgstatus = 1;
            },
            uploaded:(res)=>{
                if(res.status<0){
                    return this.editor.$message.tip('上传失败，请重新登录！','error')
                }
                let url = res.data;
                if (url) this.editor.cmd.do('insertImage', url)
                this.editor.upImgstatus = 0;
            },
        })
    },
    current(e) {
        let el = this.editor.selection.getRangeElem()
        if(!el) return false
        let img = el.getElementsByTagName('img')
        this.isCurrent = img && img.length
    }
}
export default Image
