<template>
    <div class="wallet-node-main">
        <div class="com-datalist">
            <comp-scroll :on-infinite="onInfinite" v-if="source&&source.length>0">
                <ul class="ul">
                    <li v-for="(item,index) in source" :key="item" @click.stop="Select(item)">
                        <div class="main">
                            <div class="title">
                                <span class="name">{{item.address_desc}}</span>
                            </div>
                            <div class="content">{{item.address_content}}</div>
                        </div>
                        <div class="action" @click.stop="openActionPannel(item,index)">
                            <i class="icon icon-more"></i>
                        </div>
                    </li>
                </ul>
            </comp-scroll>
            <comp-empty v-if="!loading&&source.length <= 0" text="暂无数据" mainHeight="calc(100vh - 5rem)"/>
        </div>
        <div class="com-btns">
            <comp-input type="button" :status="1" value="添加地址" @arrow="Edit(1)" />
        </div>
    </div>
</template>

<script>
    import compScroll from "~components/compScroll";
    import compEmpty from '~components/compEmpty';
    import compInput from '~components/compInput/input';
    export default {
        name: "wallet-node",
        components: {
            compEmpty,
            compScroll,
            compInput
        },
        data() {
            return {
                source: [], //列表数据容器
                actionObject:{}, //当前操作对象（删除、修改时）
                more: 1,
                loading: 1,
                //integral: 0,
                current_page: 1,
                page_size: 30
            }
        },
        methods: {
            //添加、编辑 type=1添加 type=0编辑
            Edit(type){
                if(type){
                    this.actionObject = {}; //添加时重置操作对象
                    if(this.source && this.source.length >=10){
                        this.$dialog.alert("最多可维护10个提币地址（可先删除后再添加）");
                        return;
                    }
                }
                let id = this.actionObject.id;
                if(!id) id = 0;
                this.$router.push(`/user/wallet/node/edit/${id}`);
            },
            Delete(){
                this.$dialog.confirm({
                    title:'删除该钱包地址',
                    btns:['删除','取消']
                }).then(() => {
                    Ajax.post(Api.apply.del_address,{
                        address_id:this.actionObject.id
                    }).then(res => {
                        setTimeout(() => {
                            this.$dialog.tip('删除成功');
                            this.source.splice(this.actionObject.index, 1);
                        },300)
                    }); 
                });
            },
            //选择地址
            Select(obj){
                if(this.$route.query.select == 1){
                    if(Global.isApp && Global.isPro){
                        HZApp.Reload(`/user/wallet/cashout?aname=${obj.address_desc}&aid=${obj.address_id}`,1)
                    } else {
                        this.$router.go(-1);
                        setTimeout(() => {
                            this.$router.replace(`/user/wallet/cashout?aname=${obj.address_desc}&aid=${obj.address_id}`);
                        },200);
                    }

                }
            },
            //获取数据
            GetData() {
                let params = {
                    current_page: this.current_page,
                    page_size: this.page_size
                };
                Ajax.get(Api.apply.get_address, params).then(res => {
                    this.loading = 0;
                    this.source = res.data.info;
                });
            },
            //打开操作面板
            openActionPannel(obj, index) {
                this.actionObject.id = obj.address_id;
                this.actionObject.index = index;
				let btns = [{
					name: "修改",
					action: this.Edit
                },{
					name: "删除",
					action: this.Delete
                }];
				this.$dialog.action(btns);
            },
            onInfinite(done){
                done();
            }, 
        },
        mounted() {
            this.GetData();
        }
    }
</script>