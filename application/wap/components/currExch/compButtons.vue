<template>
    <div class="comp-buttons">
        <div class="title" v-if="_Object.title">{{ _Object.title }}</div>
        <ul class="button-list">
            <li class="button-item" :class="{current: item.name == current}" v-for="(item, index) in _Object.data" :key="index" @click.stop="Handle(item)">{{item.name}}</li>
        </ul>
        <div class="tip" v-if="setNum && $route.name == 'project'">{{ setNum }}条</div>
    </div>
</template>

<script>
    export default {
        name: "compButtons",
        data () {
            return {
                current: ''
            }
        },
        props: {
            _Object: {
                type: Object,
                default: {
                    title: '',
                    data:{}
                }
            },

        },
        computed: {
            // 获取参数
            str () {
                if(this.$route.query.name && this.$route.query.id >= 0) {
                    this.$emit("select", {
                        name: this.$route.query.name,
                        id: this.$route.query.id
                    });
                    this.current = this.$route.query.name;
                }
            },
            // 设置条数
            setNum () {
                if(!this.str){
                    return this.current.match(/\d+/g) && this.current.match(/\d+/g)[0];
                }
            }
        },
        methods: {
            Handle (val) {
                this.current = val.name;
                this.$emit("select", val)
            }
        }
    }
</script>

<style lang="less" scoped>
    .comp-buttons{
        background: white;
        padding: .75rem;
        font-family: PingFangSC-Medium,PingFangSC;
        font-size: .6rem;
        .title{
            color: rgba(51, 51, 51, 1);
            font-size: .85rem;
            font-weight: bold;
        }
        .button-list{
            display: flex;
            flex-wrap: wrap;
            .button-item {
                padding: .2rem .55rem;
                color: rgba(136, 136, 136, 1);
                border-radius: .1rem;
                border: .025rem solid rgba(201,201,201,1);
                margin: .2rem .3rem .2rem 0;
                &.current {
                    border: .025rem solid rgba(86, 130, 255, 1);
                    background: rgba(86, 130, 255, 1);
                    color: white !important;
                }
            }
        }
        .tip{
            padding: .2rem 0;
            color:rgba(86,130,255,1);
        }
    }
</style>
