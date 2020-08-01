<template>
    <div class="summary-page"
        :style="{backgroundImage:backgroundImage}"
        @touchstart="TouchStart"
        @touchend="TouchEnd">
        <div class="summary-step step0" v-show="Dstep==0">
            <p>Hi,{{Ddata.user_name}}</p>
        </div>
        <div class="summary-step step1" v-show="Dstep==1">
            <p>我们是怎样的人</p>
            <p>是保护“韭菜”的<span>【黑钻评审员】</span></p>
            <p>在社区思想的碰撞</p>
            <p>知识的共享</p>
            <p>给行业带去一道光</p>
        </div>
        <div class="summary-step step2" v-show="Dstep==2">
            <p><span>{{$service.Dater(Ddata.user_create_time,"YYYY")}}</span>年<span>{{$service.Dater(Ddata.user_create_time,"MM")}}</span>月<span>{{$service.Dater(Ddata.user_create_time,"DD")}}</span>日</p>
            <p>我正式加入黑钻评级</p>
            <p>今天是我加入黑钻评级的第<span>{{Ddata.num_day}}</span>天</p>
        </div>
        <div class="summary-step step3" v-show="Dstep==3">
            <p>距今共计贡献了<span>{{Ddata.num_count}}</span>字</p>
            <p>写了<span>{{Ddata.num_grade}}</span>个项目分析</p>
            <p>获得了<span>{{Ddata.num_like}}</span>个点赞</p>
            <p>获得了<span>{{Ddata.num_comment}}</span>条留言</p>
            <p>超过黑钻评级社区<span>{{Ddata.percent}}%</span>人</p>
        </div>
        <div class="summary-step step4" v-show="Dstep==4">
            <p><span>{{$service.Dater(Ddata.grade_date,"YYYY")}}</span>年<span>{{$service.Dater(Ddata.grade_date,"MM")}}</span>月<span>{{$service.Dater(Ddata.grade_date,"DD")}}</span>日</p>
            <p>是特殊的一天</p>
            <p>我写了<span>{{Ddata.grade_date_num}}</span>条评级</p>
            <p v-if="Ddata.grade_time>=0"><span>{{Ddata.grade_time}}</span>点</p>
            <p v-if="Ddata.grade_time>=0">我仍在为输出优质评级而奋笔疾书</p>
        </div>
        <div class="summary-step step5" v-show="Dstep==5">
            <p>为净化区块链行业环境</p>
            <p>降低用户投资风险</p>
            <p>我将继续尽绵薄之力</p>
            <p>和黑钻评级一起前行</p>
        </div>
        <div class="summary-step step6" v-show="Dstep==6">
            <p class="big">你还没有写评级</p>
            <p class="big">赶快去写评级吧</p>
        </div>
        <!-- <div class="summary-step step6" v-show="0">
        </div> -->
        <div class="nextbtn" :style="{bottom:Dstep==6?'2.5rem':'.5rem'}">
            <p v-if="Dstep==0" :class="{'enter':DnextBtn}">上滑查看我的报告</p>
            <p v-if="Dstep==5 && !self && uid!=0" :class="{'enter':DnextBtn,'go':1}" @click="Go">戳此生成我的报告</p>
            <p v-else-if="Dstep==5" :class="{'enter':DnextBtn,'go':1}" @click="Share">戳此分享</p>
            <p v-else-if="Dstep==6" :class="{'enter':DnextBtn,'write':1}" @click="Write">去写评级</p>
            <div v-show="Dstep<5"><i class="icon icon-shanghua"></i></div>
        </div>
    </div>
</template>

<script>
import "./style";
export default {
    name:"summaryPage",
    data(){
        return {
            Dstep:-1, //播放进度 0为初始页
            Ddata:{}, //用户年终数据
            DnextBtn: 1, //是否显示进入下一页的提示按钮 控制每一页至少让用户看3秒
            DtouchStartY: 0, //记录起始触摸点坐标
        }
    },
    watch:{
        Dstep(v){
            this.ShowText();
        },
        uid(v){
            if(!Global.isApp)
                this.$router.go(0); //强制刷新页面的方法 该方法会闪屏 仅H5端 待优化
        }
    },
    computed:{
        //是否为当前登录用户
        self(){
            return this.uid == this.$store.getters.userInfo.user_id;
        },
        //用户编号
        uid(){
            return this.$route.params.uid;
        },
        //背景图片处理
        backgroundImage(){
            let r
            if(this.Dstep<0) r = '';
            else r = this.$assets[`summaryBg${this.Dstep}`];
            return `url(${r})`;
        }
    },
    methods:{
        //获取用户年终数据
        GetData(){
            this.Dstep = 0;
            Ajax.get(Api.apply.YearlyStatistics,{
                user_id: this.uid
            }).then(res => {
                this.Ddata = res.data;
                Share.Ready({
                    title: `2019年我在黑钻评级写了${this.Ddata.num_grade}条评级，快来围观！`,
                    desc: "想知道我给哪些项目打了高分，给哪些项目打了低分？快来看看吧。",
                    link: `${Global.host}/summary/${this.$store.getters.userInfo.user_id}`,
                    href: `/summary/${this.$store.getters.userInfo.user_id}`
                });
            });
        },
        TouchStart(e){
            this.touchStartY = e.changedTouches[0].pageY;
        },
        TouchEnd(e){
            if(this.DnextBtn && this.Dstep<5){
                if(this.Ddata.num_grade == 0){
                    this.Dstep = 6;
                }else{
                    this.DnextBtn = 0;
                    if(e.changedTouches[0].pageY > this.touchStartY){
                        if(this.Dstep <= 0) this.Dstep == 0;
                        else this.Dstep--;
                    } else{
                        if(this.Dstep >= 5) this.Dstep = 5;
                        else this.Dstep++;
                    }
                    setTimeout(() => {
                        this.ShowNextBtn();
                    }, 1500);
                }
            }
        },
        //显示下一页按钮
        ShowNextBtn(){
            this.DnextBtn = 1;
        },
        //显示文本
        ShowText(){
            let difference = 500, //显示的间隔差量
                timeout = 0; 
            let div = this.$el.querySelector(`.step${this.Dstep}`);
            let p = div.children;
            for(let k in p){
                if(p.hasOwnProperty(k)){
                    setTimeout(() => {
                        p[k].classList.add('enter');
                    }, timeout);
                    timeout += difference;
                }
            }
        },
        //生成我的总结
        Go(){
            //先校验登录状态及是否为超级评审员
            Service.CheckLogin().then(()=> {
                Service.CheckLevel().then(() => {
                    this.$router.replace(`/summary/${this.$store.getters.userInfo.user_id}`);
                }).catch(() => {
                    Dialog.alert({content:"您还不是超级评审员",btns:["去申请"]}).then(() => {
                        if(Global.isApp && Global.isPro){
                            HZApp.Reload('/user/application',1);
                        }else {
                            this.$router.replace("/user/application");
                        }
                    });
                });
            });
        },
        Write(){
            this.$router.replace("/select/2/0");
        },
        //分享
        Share(){
            if(Global.isApp){
                HZApp.Share.Show();
            }else{
                Dialog.mask({
                    content: '点击这里快分享给您的好友吧！',
                    btn:1
                });
            }
        }
    },
    mounted(){
        //预加载背景图片，防止切换时闪频
        for(let i = 0; i <= 5; i++){
            let img = new Image();
            img.src = this.$assets[`summaryBg${i}`];
        }
        if(this.uid == 0){
            Service.CheckLogin().then(()=> {
                Service.CheckLevel().then(() => {
                    this.GetData();
                }).catch(() => {
                    Dialog.alert({content:"您还不是超级评审员",btns:["去申请"]}).then(() => {
                        if(Global.isApp && Global.isPro){
                            HZApp.Reload('/user/application',1);
                        }else {
                            this.$router.replace("/user/application");
                        }
                    });
                });
            });
        } else {
            this.GetData();
        }
    },
}
</script>