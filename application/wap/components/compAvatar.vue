<template>
    <!-- 匿名头像 -->
    <!-- <div class="comp-avatar" v-if="src == 2">
        <i class="icon icon-spy"></i>
    </div> -->
    <!-- 用户头像 -->
    <div class="comp-avatar" :style="{'width':`${size/40}rem`,'height':`${size/40}rem`}" @click="GoHomePage">
        <div v-if="src == 2" class="com-anonym" style="width:100%;height:100%;">
			<i class="icon icon-spy" style="font-size:xx-large;"></i>
		</div>
        <img v-else class="avatar" :src="_src" :style="{border: border ? '.1rem solid rgba(255,255,255,.6)' : 'none'}">
        <img class="offieceIcon" v-if="offieceIcon" :style="{'width':`${size/110}rem`,'height':`${size/110}rem`}" :src="offieceIcon">
        
    </div>
</template>

<script>
export default {
    name:'',
    props:{
        src:{ //头像地址 若为2，则为匿名用户
            type:String,
            default:''
        },
        size:{
            type:Number,
            default:150
        },
        level:{
            type:String,
            default:0
        },
        itemid:{
            type:Number,
            default:0
        },
        userID: "", //外部传入的用户id
        border:{
            type:Boolean,
            default:true
        }
    },
    computed:{
        _src(){
            if(this.src == 2) //如果传2刚为匿名
                return 0;
            else {
                let r = this.src || this.$assets.avatar;
                return `${r}?x-oss-process=image/resize,m_lfit,h_${this.size},w_${this.size}`
            }
        },
        offieceIcon(){
            let src = '';
            let G = this.$global.userLevel,
                A = this.$assets;
            if(this.level == G.assessor || this.level == G.assessorRobot) //超级评审员、评审机器人
                src = A.assessorIcon;
            if(this.itemid || this.level == G.official)  // 项目方官方账号、官方机器人
                src = A.offieceIcon;
            src = src ? `${src}?x-oss-process=image/resize,m_lfit,h_${this.size/2},w_${this.size/2}` : '';
            return src;
        }
    },
    methods: {
        GoHomePage(){
            if(this.userID)
                this.$router.push({path: `/user/homepage/${this.userID}`})
        }
    }
}
</script>

<style lang="less" scoped>
    .comp-avatar{
        position:relative;
        display: flex;
        align-self: center;
        flex-shrink: 0;
        .avatar{
            width: 100%;
            height:100%;
            border-radius: 50%;
        }
        .offieceIcon{
            position:absolute;
            right:0;
            bottom:0;
            border-radius: 50%;
        }
    }
</style>
