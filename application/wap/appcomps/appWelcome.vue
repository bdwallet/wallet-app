<template>
    <div class="app-welcome" :class="{'leave':Dshow == 2}" v-if="Dshow">
		<comp-swiper v-if="Dimgs.length" height="100vh" :pagination="true" @movend="Moved">
			<comp-swiper-item v-for="item in Dimgs" :key="item">
				<img :src="item" />
			</comp-swiper-item>
		</comp-swiper>
        <div class="btn-welcome" :class="{'visible':Dindex == Dimgs.length}" @click="Welcome">
            <div class="titles">立即开启</div>
        </div>
    </div>
</template>

<script>
    import LocalStore from '~script/localStore';
	import {
		compSwiper,
		compSwiperItem
    } from '~components/compSwiper';
    
    export default {
        name: "appWelcome",
        components:{
            compSwiper,
            compSwiperItem
        },
        data(){
            return {
                Dshow:0,
                Dimgs: [],
                Dindex:0,
            }
        },
        methods:{
            Moved(v){
                this.Dindex = v+1;
            },
            NewComes(){
                this.$dialog.newComes().then(() => {
                    this.$router.push({name:'login',query:{url:'/user/wallet'}})
                });
            },
            Welcome(){
                this.Dshow = 2;
                setTimeout(() => {

                    this.Dshow = 0;
                    LocalStore.set("welcome", 1, 3600*24*30*12);

                    HZApp.CheckUpdate(); //检测并更新

                    //do new comes
                    this.NewComes();

                    //destroy
                    this.$destroy();
                }, 600);
            }
        },
        mounted(){
            this.Dshow = LocalStore.get("welcome") == 1 ? 0 : 1;
            if(this.Dshow == 0){
                setTimeout(() => {
                    //console.log("inininininin appWelcome.vue");
                    HZApp.CheckUpdate(); //检测并更新
                }, 2000);
            }
            // let b = '/images/banner.jpg';
            // let b1 = '/images/banner1.jpg';
            // let b2 = '/images/banner2.jpg';
            let b = require('~assets/img/banner.jpg');
            let b1 = require('~assets/img/banner1.jpg');
            let b2 = require('~assets/img/banner2.jpg');
            this.Dimgs = [b,b1,b2];
        }
    }
</script>

<style lang="less">
    .app-welcome{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100vh;
        z-index: 9;
        background: #FFF;
        transition: .5s all;
        &.leave{
            transform: translateX(-100%);
        }
        .comp-swiper{
            .comp-swiper-item{
                align-items: center;
            }
            .swiper-pagination{
                .circle{
                    width: .4rem;
                    height: .4rem;
                    background: transparent;
                    border: .03rem solid #000;
                    &.current{
                        transform:scale(1);
                        border: none;
                        background: #000;
                    }
                }
            }
        }
        .btn-welcome{
            position: absolute;
            bottom:2.5rem;
            left:50%;
            display: flex;
            width: 6rem;
            height: 2rem;
            border:.03rem solid #000;
            justify-content: center;
            align-items: center;
            z-index: 9;
            border-radius: 1rem;
            color:#000;
            font-size: .8rem;
            transition: .2s all;
            transform: translateX(-50%) scale(0);
            opacity: 0;
            &.visible{
                opacity: 1;
                transform: translateX(-50%) scale(1);
            }
        }
    }
</style>
