<template>
    <div class="comp-anonymous com-anonym" @click="ShowSelector">
        <i v-if="status" class="icon icon-spy"></i>
        <img v-else :src="avatar">
    </div>
</template>

<script>
    import './style';
    import Vue from 'Vue';
    import store from '~script/store';
    import selector from './selector';
    export default {
        data() {
            return {
                avatar: store.getters.userInfo.user_photo,
            }
        },
        props: {
            status: { //0实名 1匿名  这里是修改爆料情况下需传值进行赋值
                type: Number,
                default: 0
            },
        },
        methods: {
            //显示选择器
            ShowSelector() {
                let div = document.getElementsByClassName("comp-anonymous-selector");
                if(div.length > 0){
                    div[0].style.opacity = 0;
                    div[0].style.transform = "scale(0)";
                    setTimeout(() => {
                        document.body.removeChild(div[0]);
                    }, 300);
                    return;
                }
                let el = document.createElement('div');
                const component = Vue.extend(selector);
                let vm = new component({
                    el,
                    propsData:{
                        checked: this.status
                    },
                });
                document.body.appendChild(vm.$el);

                vm.$on('checked',v => {
                    this.status = v;
                    this.$emit('checked',v);
                });
            }
        }
    }
</script>