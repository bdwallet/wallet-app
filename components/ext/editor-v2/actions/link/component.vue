<template>
	<div style="width: 200px">
		<ui-form-group>
			<dt><label for="text">链接文字</label></dt>
			<dd><input v-model="text" type="text" id="text" class="form-control " placeholder="请输入链接文字"></dd>
		</ui-form-group>
		<ui-form-group>
			<dt><label for="url">链接地址</label></dt>
			<dd><input v-model="url" type="text" id="url" class="form-control " placeholder="请输入链接地址"></dd>
		</ui-form-group>
		<ui-form-group>
			<ui-button-group class="f-r">
				<ui-button v-if="delBtn" type="gray" size="sm"  @click="del" class="f-r">删除链接</ui-button>
				<ui-button type="primary" size="sm"  @click="add" class="f-r">{{addText}}</ui-button>
			</ui-button-group>
		</ui-form-group>
	</div>
</template>

<script>	
	export default {
		props: {
			button:Object,
			editor:Object,
			key:String
		},
		data(){
			return{
				addText:'添加链接',
				delBtn:false,
				text:'',
				url:''
			}
		},
		methods: {
			del(){
				this.button.editor.cmd.do('unlink', this.text);
				this.button.panel.close()
			},
			add(){
				let url = `${this.url}`;
				if(!this.isUrl(url)){
					this.$message.tip('链接地址有误','error')
					return false;
				}
				this.button.editor.cmd.do('insertHTML', `<a href="${this.url}" target="_blank">${this.text||this.url}</a>`);
				this.button.panel.close()
			},
			isUrl(str_url){
					let strRegex = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/; 
	        let re=new RegExp(strRegex); 
	        if (re.test(str_url)){
	          return (true); 
	        }else{ 
	          return (false); 
	        }
			}
		},
		mounted() {
			if (this.button.isCurrent) {
        let el = this.editor.selection.getRangeElem()
        if(!el) return
        this.text = el.innerText
        this.url = el.getAttribute('href')
        this.addText = '修改链接'
        this.delBtn = true
      } else {
         this.text=this.editor.selection.getText()
      }
		}
	}
</script>