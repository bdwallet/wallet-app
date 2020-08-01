<template>
  <div>
    <div @click="clearCash">清理缓存</div>
  </div>
</template>

<script>
  import localStore from '~script/localStore';
  export default {
    name: "clear",
    methods: {
      clearCash() {
        localStore.clearAll();
        alert("清理成功！");
      }
    }
  }
</script>
