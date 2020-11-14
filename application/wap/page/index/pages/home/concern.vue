<template>
    <div class="home-main concern">
        <div class="concern" v-if="Ddata && Ddata.length > 0">
            <comp-datalist :data="Ddata" scene="1" type="3" />
        </div>
        <div class="no-concern" v-else-if="!loading">
            <p class="title">关注达人，看精彩评级</p>
            <p class="sub">了解币圈最新资讯、实时掌握动态</p>
            <div class="con-rating" v-if="dt_pushData && dt_pushData.length > 0">
                <div class="card">
                    <div class="item" v-for="c in dt_pushData" :key="c" @click.stop="CheckBoxClick(c.user_id)">
                        <comp-avatar size="108" :level="c.level" :src="c.user_photo" />
                        <p class="name">{{c.user_name.length > 6 ?c.user_name.substr(0,5)+'...' : c.user_name}}</p>
                        <p class="identity">{{c.label_data.label_name}}</p>
                        <label class="checkbox">
                            <input type="checkbox" name="conitem" :value="c.user_id">
                            <i class="icon icon-wancheng"></i>
                        </label>
                    </div>
                </div>
                <div class="btns">
                    <div class="exchange-btn" @click="GetData">换一批</div>
                    <div class="con-btn" :class="{'dis-btn': checkedNum<=0}" @click="ConcernClick">一键关注</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import compDatalist from '~components/compDatalist';
    import compAvatar from '~components/compAvatar';
    export default {
        name: 'concern',
        components: {
            compDatalist,
            compAvatar,
        },
        data() {
            return {
                dt_pushData: [], //推送关注数据
                Ddata: [], //关注数据
                loading:true, //数据加载状态
                checkedNum: 1, //选择关注人数
            }
        },
        computed: {
            refreshCon() {
                return this.$store.getters.refreshCon;
            }
        },
        methods: {
            GetData() { //获取关注数据
                //this.loading = true; //点击换一换时，会闪屏
                Ajax.get(Api.apply.list_get, { //有关注的人，如果关注的人没有发布任何评级、爆料，将继续推送关注
                    page: 1,
                    size: 20,
                    scene:1,
                    type:3
                }).then(res => {
                    this.loading = false;
                    let data = res.data;
                    if (data.rand_data && data.rand_data.length > 0) {
                        // 推送关注数据
                        this.dt_pushData = data.rand_data;
                        //渲染推荐关注并全选
                        setTimeout(() => { //进行异步的原因是因为，DOM还没有渲染
                            let obj = document.getElementsByName('conitem');
                            obj.forEach(o => { o.checked = true;});
                        }, 0);
                    } else {
                        // 已关注
                        this.Ddata = data.list;
                    }
                    this.$store.commit("changeRefreshCon", false);
                }).catch(err => {
                    this.loading = false;
                    Dialog.alert(err.message);
                })
            },
            ConcernClick() { // 一键关注
                if (!!this.checkedNum) {
                    let obj = document.getElementsByName('conitem');
                    let ids = [];
                    obj.forEach(o => {
                        if (o.checked) {
                            ids.push(o.value);
                        }
                    });
                    Service.UpdateAtt(ids,this.GetData);
                }
            },
            CheckBoxClick(id) { //推荐关注监听，没有勾选时，一键关注灰掉
                this.checkedNum = 0;
                let obj = document.getElementsByName('conitem');
                obj.forEach(o => {
                    if (o.value == id) {
                        o.checked = !o.checked;
                    }
                    if (o.checked) {
                        this.checkedNum++;
                    }
                });
            }
        },
        mounted() {
            this.GetData();
        },
        activated() {
            setTimeout(() => {
				Share.Ready({
					desc: "币圈动态实时掌握，最新爆料与你共享",
					link: location.href,
				});
			});
            if (this.refreshCon) {
                this.Ddata = [];
                this.dt_pushData = [];
                this.GetData();
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        },
    }
</script>

<style lang="less">
    @import '../../../../assets/css/config.less';
    .no-concern {
        width: 100%;
        height: auto; // height: e('calc(100vh - 2.45rem - 2.5rem)');
        font-size: .8rem;
        font-weight: 400;
        line-height: 1.4;
        color: @color-sub;
        text-align: center;
        .title {
            margin-top: .75rem;
        }
        .sub {
            margin-top: .5rem;
            font-size: .7rem;
            color: @color-dec;
        }
        .con-rating {
            margin: 1rem .5rem .5rem;
            padding: .4rem .5rem 1rem;
            background-color: #fff;
            box-shadow: 0 .05rem .1rem .05rem rgba(0, 0, 0, 0.1);
            border-radius: .1rem;
            .card {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                .item {
                    position: relative;
                    width: 5.3rem;
                    height: 7.075rem;
                    background-color: @bgcolor-body;
                    padding: 1rem 0 .75rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: .5rem;
                    border-radius: .1rem;
                    .name {
                        font-size: .7rem;
                        margin-top: .6rem;
                    }
                    .identity {
                        font-size: .6rem;
                        color: @color-dec;
                    }
                    .checkbox {
                        position: absolute;
                        top: .275rem;
                        right: .275rem;
                        width: 18px;
                        height: 18px;
                        input {
                            position: absolute;
                            right: 0;
                            top: 0;
                            opacity: 0;
                        }
                        .icon {
                            color: #BCBCBC;
                            font-size: .9rem;
                        }
                        input[type="checkbox"]:checked+i::before {
                            content: "\e74d";
                            font-family: 'icon';
                            color: @color-link;
                        }
                    }
                }
            }
            .btns {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-direction: column;
                margin-top: 1rem;
                padding: .5rem;
                .con-btn {
                    position: relative;
                    width: 14.4rem;
                    height: 1.9rem;
                    line-height: 1.9rem;
                    background-color: @color-link;
                    color: #fff;
                    border-radius: .25rem;
                    &.dis-btn {
                        background-color: #BCBCBC;
                    }
                }
                .exchange-btn {
                    width: 4rem;
                    color: @color-link;
                    font-size: .7rem;
                    margin-bottom: 1rem;
                    text-decoration: underline;
                }
            }
        }
    }
</style>


