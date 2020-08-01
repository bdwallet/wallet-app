<template>
    <div class="comp-level" :style="{justifyContent:align}">
        <span class="comp-level-name">{{username}}</span>
        <span  @click.stop="gotoLevel" class="comp-level-level" v-if="values && values!='0'">LV.{{values}}</span>
    </div>
</template>

<script>
    export default {
        name:'compLevel',
        props:{
            username:{
                type: String,
                default: ''
            },
            value:{
                type: Number,
                default: 0
            },
            isOffiece:{
                type: Number,
                default: 0
            },
            align:{
                type: String,
                default: 'center'
            },
        },
        computed: {
            isOffieces () {
                if(this.isOffiece == Global.userLevel.official) return 1;
                else return 0
            },
            values () {
                if(this.isOffieces) return 0;
                else return this.value;
            }
        },
        methods: {
            gotoLevel(){
                if(this.$route.name == 'user-main'){
                    this.$router.push('/user/level');
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .comp-level {
        display: flex;
        align-items: center;
        line-height:1;
		color:#fff;
        .comp-level-level{
            display: flex;
            width: 1.65rem;
            height: .8rem;
            margin-left:.5rem;
            justify-content: center;
            align-items: center;
            background: linear-gradient(180deg, rgba(248, 213, 188, 1) 0%, rgba(255, 177, 136, 1) 100%);
            border-radius: 24px;
            font-size: .5rem;
        }
    }
</style>
