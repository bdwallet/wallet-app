<template>
    <div class="wallet-node-edit">
        <comp-input :status="1" :height="'2.3rem'" v-model="desc" placeholder="备注，可以填所在钱包或交易所" @arrow="Add" />
        <comp-input :status="1" :height="'2.3rem'" v-model="content" placeholder="钱包地址" @arrow="Add" />
        <comp-prompt>目前仅支持填入imtoken钱包提现地址，请慎重填写并再三核对。若因地址错误导致的一切损失，平台概不负责</comp-prompt>
            
        <div class="com-btns">
            <comp-input type="button" :status="btnStatus" :value="id>0?'保存':'添加地址'" @arrow="Submit" />
        </div>
    </div>
</template>

<script>
    import compInput from '~components/compInput/input';
    import compPrompt from '~components/compPrompt';
    export default {
        components: {
            compInput,
            compPrompt
        },
        data() {
            return {
                desc: '',
                content: '',
                oldData: {}
            }
        },
        computed: {
            id() {
                return this.$route.params.id;
            },
            btnStatus() {
                return this.desc && this.content ? 1 : 0;
            }
        },
        methods: {
            //提交数据
            Submit() {
                if (this.desc == this.oldData.address_desc && this.content == this.oldData.address_content) { //没有修改任何内容
                    if(Global.isApp && Global.isPro){
                        HZApp.Back()
                    }else {
                        this.$router.go(-1);
                    }
                } else if (!/^0x[0-9a-fA-F]{40}$/i.test(this.content)){ //校验地址是否正确
                    this.$dialog.alert("提币地址格式有误");
                } else {
                    Ajax.post(Api.apply.save_address, {
                        address_desc:this.desc,
                        address_content:this.content,
                        address_id:this.id
                    }).then(res => {
                        if(res.data.status == 1){
                            let txt = this.id > 0 ? '修改成功' : '添加成功';
                            if(Global.isApp && Global.isPro){
                                HZApp.Reload('/user/wallet/node/main?select=1',1)
                            }else {
                                this.$router.replace('/user/wallet/node/main?select=1');
                            }
                            setTimeout(() => {
                                this.$dialog.tip(txt);
                            }, 0);
                        }else {
                            this.$dialog.tip(res.message);
                        }
                    });
                }
            },
            //获取指定数据
            GetData() {
                Ajax.get(Api.apply.get_address, {
                    address_id: this.id,
                }).then(res => {
                    this.oldData = res.data.info;
                    this.desc = res.data.info.address_desc;
                    this.content = res.data.info.address_content;
                });
            }
        },
        mounted() {
            //this.GetData();
            let t = "";
            if (this.id > 0) {
                t = "修改钱包地址";
                this.GetData();
            } else {
                t = "添加钱包地址";
            }
            document.title = t;
            if(Global.isApp)
				Titlebar.title = t;
        }
    }
</script>