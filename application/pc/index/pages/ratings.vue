<template>
  <div class="HZPJ-ratings">
    <div class="container">
      <div class="search-arer">
        <div class="title">PROJECTS RATING</div>
        <div class="search-box">
          <h1 class="total">共{{itemTotal}}个项目</h1>
          <div class="search-tools">
            <input v-model="keyword" placeholder="搜索项目" />
            <i @click="searchItem" class="icon icon-sousuo"></i>
          </div>
        </div>
      </div>
      <scroll v-if="itemData && itemData.length>0" :on-infinite="onInfinite">
        <transition-group tag="ul" class="ratings-list-box">
          <li v-for="item in itemData" :key="item" @click="$router.push(`/detail/${item.item_id}`)">
            <circle-progress class="score" :value="item.item_grade"></circle-progress>
            <div class="info">
              <img :src="item.item_logo" />
              <div class="name">
                <h1>{{item.item_urrency_abbreviation}}{{item.item_urrency_abbreviation&&item.item_cn_name?'/':''}}{{item.item_cn_name}}</h1>
                <p>{{item.item_user_num}}人评过</p>
              </div>
            </div>
            <p class="abstract">{{item.item_intro.substr(0,38)}}...</p>
          </li>
        </transition-group>
      </scroll>
      <empty v-if="!loading && (!itemData || (itemData && itemData.length == 0))" />
    </div>
  </div>
</template>

<script>
  import circleProgress from '~components/circleProgress';
  import empty from '~components/empty';
  import scroll from '~components/scroll';
  export default {
    name: 'HZPJ-ratings',
    components: {
      circleProgress,
      empty,
      scroll
    },
    data() {
      return {
        keyword: '', //搜索关键词
        itemData: [],
        current_page: 1,
        page_size: 12,
        item: '', //查询用可以传入ID 和 项目名称
        itemTotal: 0, //项目总数
        loading: false,
        more: true,
      }
    },
    computed: {},
    methods: {
      //获取项目列表
      getItemList(done) {
        this.loading = true;
        Ajax.get(Api.get_item_list, {
          current_page: this.current_page,
          page_size: this.page_size,
          order: 1,
          item: this.item,
          item_total: 1
        }).then(res => {
          this.loading = false;
          if (this.current_page == 1) {
            this.itemData = res.data.itemData;
          } else {
            this.itemData = this.itemData.concat(res.data.itemData);
          }
          this.more = res.data.itemData.length >= this.page_size;
          this.itemTotal = res.data.itemTotal;
          done && done();
        });
      },
      //下拉加载处理函数
      onInfinite(done) {
        if (this.more) {
          this.current_page++;
          this.getItemList(done);
        } else {
          done();
        }
      },
      //搜索
      searchItem() {
        if (this.keyword && this.keyword != this.item) { //有关键词，并且与上一次搜索内容不一样
          this.current_page = 1;
          this.item = this.keyword;
          this.getItemList();
        } else if (!this.keyword && this.item) { //没有关键词，并且存在上一次搜索 =》 清空搜索并重置列表
          this.current_page = 1;
          this.item = '';
          this.getItemList();
        }
      }
    },
    mounted() {
      this.getItemList();
      //注册键盘事件
      document.onkeydown = (e) => {
        let currKey = 0,
          ev = (typeof event != 'undefined') ? window.event : e;
        currKey = ev.keyCode || ev.which || ev.charCode; //支持IE、FF
        if (currKey == 13) {
          this.searchItem();
        }
      }
    }
  }
</script>
