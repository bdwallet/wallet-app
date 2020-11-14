<template>
  <div :class="prefix" v-show="dialogs.length">
    <ext-dialog v-for="(dialog,index) in dialogs"
      is="extDialog"
      :setting="dialog"
      :index="index"
      :key="dialog.key"
      :dialogKey="dialog.key"
      @close="close">
    </ext-dialog>
  </div>
</template>

<script>
  import extDialog from './dialog';
  import {prefix,defaultConfig} from './vDialogConstants';
  export default {
    name: prefix,
    components: {
      extDialog
    },
    data(){
      return {
        prefix,
        dialogs: [],
        keyPrefix: `${prefix}-`,
        keyNum: 0
      };
    },
    methods: {
      config(config){
          return Object.assign({}, dialogDefaults, config);
      },
      
      build(config){
        this.keyNum++;
        let key = this.keyPrefix + this.keyNum;
        config.dialogKey = key;
        this.dialogs.push(config);
        return key;
      },
      addModal(content,params){
          let config = this.config(params);
          config.type = 'modal';
          return this.build(config);
      },
      addAlert(content,params){

      },
      addToast(p){
      
      },
      close(data, key){
      }
    }
  }
</script>

<style scoped>
  .fox--ext-dialog{
    width: 0;
    height: 0;
    position: fixed;
    z-index: 1;
  }
</style>