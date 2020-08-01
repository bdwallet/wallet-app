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
        localStore.remove("playvideo");
        localStore.remove("isfirst");
        localStore.remove("oawclxrtjy");
        localStore.remove("user");
        alert("清理成功！");
      }
    }
  }
</script>
