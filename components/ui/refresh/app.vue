<template lang="html">
    <button class="btn btn-primary" @click="backtop">回到顶部</button>  
</template>

<script>
    export default {
        props: {
           id: {
                type: String,
                default: ''
            }
            
        },
        data() {
            return {
             
            }
        },
        methods: {
            backtop(){
                let scrollTops= document.getElementById(this.id).scrollTop;
                if(scrollTops===0){return;}
                let h= scrollTops/40;
                let scrollInterval  =setInterval(
                    ()=>{ 
                        scrollTops-=h;
                        if(scrollTops>=0){
                            document.getElementById(this.id).scrollTop=scrollTops; 
                        }else{
                            clearInterval(scrollInterval);   
                        }   
                    },20);
                       
            }
        }     
        
    }
</script>

<style lang="less">
 
</style>