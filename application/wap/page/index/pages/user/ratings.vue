<template>
    <div class="choiceness-list">
        <comp-datalist ref="datalist" type="6" scene="4" :uid="uid" />
    </div>
</template>

<script>
    import compDatalist from '~components/compDatalist';
    export default {
        name: 'choicenessList',
        components: {
            compDatalist
        },
        data(){
            return {
                olduid:0, //保存旧uid 用于刷新缓存旧数据
            }
        },
        computed:{
            uid(){
                return this.$route.params.uid;
            }
        },
        activated() {
            //因为页面缓存，在切换了用户以后，还是前一个用户的数据，需要监听uid重新拉取数据
            if(this.olduid != this.uid && this.olduid != 0){
                this.$refs.datalist.Reload();
            }
            this.olduid = this.uid;
            Share.Ready({
                title: `黑钻社区--“${this.$route.query.name}”荣获的精选评级`,
                desc: "好的东西，只愿与你分享~",
                link: location.href,
            });
        }
    }
</script>

