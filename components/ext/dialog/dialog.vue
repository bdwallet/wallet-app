<template>
  <div :class="`${prefix}-container`">
    <component v-if="dialog.type === 'open'" :is="dialog.component" :params="dialog.params"></component>
  </div>             
</template>

<script>0
  export default {
    name: "v-dialogs-content",
    props: ['setting', 'index'],
    data(){
      return {
         
      };
    },
    methods:{
      closeDialog(trigger){
        this.$emit('close');
      }
    },
    mounted(){
        
    }
  }
</script>

<style lang="less" scoped>
  @borderRadius: 2px;
</style>