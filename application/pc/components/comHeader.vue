<template>
  <div class="HZPJ-header">
    <div class="container">
      <div class="logo-box" @click="$router.push('/')">
        <img class="logo" :src="$assets[`logo`]" />
        <img
          class="logo-text"
          :src="$assets[`logoTextHeader${$i18n.locale}`]"
        />
      </div>
      <ul class="tab-pc">
        <router-link tag="li" to="/home">{{ $lang("钱包") }}</router-link>
        <router-link tag="li" to="/ratings">{{ $lang("评级") }}</router-link>
        <li @click="handleChangeLanguage">{{ $lang("English") }}</li>
      </ul>
      <div class="tab-wap tab-wap-item">
        <router-link tag="div" to="/ratings">
          <i class="icon icon-pingji"></i>
        </router-link>
        <div @click="handleChangeLanguage">
          <i :class="`icon icon-pingji icon-${$i18n.locale}`"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const name = "header";
export default {
  name,
  data() {
    return {};
  },
  computed: {},
  methods: {
    handleChangeLanguage() {
      this.$i18n.locale = this.$i18n.locale === "cn" ? "en" : "cn";
    },
  },
  mounted() {},
};
</script>