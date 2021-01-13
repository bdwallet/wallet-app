<template>
  <div class="HZPJ-home">
    <div class="conitem-bg1">
      <div class="container conitem first">
        <transition name="fade-left">
          <div v-show="section.first" class="textbox">
            <p class="en">Black Diamond Wallet</p>
            <p class="cn">{{ $lang("助力跨链交易与web3.0新经济") }}</p>
            <p class="desc">
              {{ $lang("黑钻钱包全球首创去中心化区块链评级模式，通过社区化评级报告，提升用户对区块链的理解和认知；同时我们为用户提供安全的区块链资产存储与专业的区块链金融服务。我们还积极参与到波卡生态建设，致力于实现web3.0的目标与使命。")}}
            </p>
            <div class="weixin pc-show">
              <img :src="$assets.downewm" />
              <div class="tips">
                <h3>{{ $lang("扫码下载APP")}}</h3>
                <!-- <p class="wap-show">关注“黑钻评级”服务号</p> -->
                <p>{{ $lang("开启区块链世界之旅")}}</p>
              </div>
              <!-- <img style="width:250px;height:90px;margin-left:100px" src="../../assets/image/web3foundation.png" /> -->
            </div>
            <!-- 查看白皮书 -->
            <div class="btns">
              <div class="btn wap-show" @click="Download">{{ $lang("下载APP")}}</div>
              <div class="btn" v-if="0" @click="Viewbook">{{ $lang("查看白皮书")}}</div>
            </div>
              <div class="wap-show">
                <!-- <img style="width:250px;height:90px;margin-top:20px;" src="../../assets/image/web3foundation.png" /> -->
              </div>
          </div>
        </transition>
        <transition name="fade-right">
          <div class="image1" v-show="section.first">
            <img :src="$assets.conitemImg1" />
          </div>
        </transition>
      </div>
    </div>
    <div class="conitem-bg2">
      <div class="container conitem second">
        <transition name="fade-left">
          <div v-show="section.second" class="textbox">
            <p class="en">DECENTRALIZED RATING</p>
            <p class="cn">{{ $lang("去中心化评级")}}</p>
            <p class="desc">{{ $lang("公正、权威、有影响力")}}</p>
            <p class="desc">{{ $lang("让你听到市场的真实回声")}}</p>
          </div>
        </transition>
        <transition name="fade-right">
          <div class="image" v-show="section.second">
            <img :src="$assets.conitemImg2" />
          </div>
        </transition>
      </div>
    </div>
    <div class="conitem-bg3 bgcolor">
      <div class="container conitem third align-right">
        <transition name="fade-left">
          <div class="image" v-show="section.third">
            <img :src="$assets.conitemImg3" />
          </div>
        </transition>
        <transition name="fade-right">
          <div v-show="section.third" class="textbox">
            <p class="en">BLOCKCHAIN FINANCIAL SERVICES</p>
            <p class="cn">{{ $lang("区块链金融服务")}}</p>
            <p class="desc">{{ $lang("多元化的数字资产投资组合")}}</p>
            <p class="desc">{{ $lang("灵活投资，收益稳定")}}</p>
          </div>
        </transition>
      </div>
    </div>
    <div class="conitem-bg4">
      <div class="container conitem fourth">
        <transition name="fade-left">
          <div v-show="section.fourth" class="textbox">
            <p class="en">SAFE AND EASY TO USE</p>
            <p class="cn">{{ $lang("安全易用的区块链钱包")}}</p>
            <p class="desc">{{ $lang("为您的数字资产保驾护航")}}/p>
            <p class="desc">{{ $lang("随时随地收款与支付")}}</p>
          </div>
        </transition>
        <transition name="fade-right">
          <div class="image" v-show="section.fourth">
            <img :src="$assets.conitemImg4" />
          </div>
        </transition>
      </div>
    </div>
    <div class="conitem-bg5 bgcolor" style="display: none">
      <div class="container conitem ratings-list">
        <transition name="fade-top">
          <div v-show="section.fifth" class="section-title">
            <p class="en">PROJECTS RATING</p>
            <div class="title-box">
              <p class="cn">{{ $lang("项目评级")}}</p>
              <router-link tag="div" to="ratings" class="more"
                >{{ $lang("查看更多")}}</router-link
              >
            </div>
          </div>
        </transition>
        <transition name="fade-bottom">
          <ul v-if="section.fifth" class="ratings-list-box">
            <li
              v-for="item in itemData"
              :key="item"
              @click="gotoDetail(item.item_id)"
            >
              <circle-progress
                class="score"
                :value="item.item_grade"
              ></circle-progress>
              <div class="info">
                <img :src="item.item_logo" />
                <div class="name">
                  <h1>
                    {{ item.item_en_name
                    }}{{ item.item_en_name && item.item_cn_name ? "/" : ""
                    }}{{ item.item_cn_name }}
                  </h1>
                  <p> {{ $lang("{num}人评论", { num: item.item_user_num }) }}</p>
                </div>
              </div>
              <p class="abstract">{{ item.item_intro.substr(0, 42) }}...</p>
            </li>
          </ul>
        </transition>
      </div>
    </div>
    <!-- PC路线图 -->
    <!--
    <div class="conitem-bg8">
      <div class="container conitem eighth">
        <transition name="fade-top">
          <div v-show="section.eighth" class="section-title">
            <p class="en" style="color:#fff;">ROAD MAP</p>
            <div class="title-box">
              <p class="cn">路线图</p>
            </div>
          </div>
        </transition>
        <transition name="fade-bottom">
          <div class="image" v-show="section.eighth">
            <img class="pc-show" :src="$assets.conitemPcRoad" />
            <img class="wap-show" :src="$assets.conitemWapRoad1" />
            <img class="wap-show" :src="$assets.conitemWapRoad2" />
            <img class="wap-show" :src="$assets.conitemWapRoad3" />
            <img class="wap-show" :src="$assets.conitemWapRoad4" />
            <img class="wap-show" :src="$assets.conitemWapRoad5" />
          </div>
        </transition>
      </div>
    </div>
    -->

    <!-- PC黑钻积分应用场景 -->
    <!--
    <div class="conitem-bg9">
      <div class="container conitem ninth">
        <transition name="fade-top">
          <div v-show="section.ninth" class="section-title">
            <p class="en">USER SCENARIO</p>
            <div class="title-box">
              <p class="cn">黑钻积分应用场景</p>
            </div>
          </div>
        </transition>
        <transition name="fade-bottom">
          <div class="image" v-show="section.ninth">
            <img class="pc-show" :src="$assets.conitemPcH5" />
            <img class="wap-show" :src="$assets.conitemWapH5" />
          </div>
        </transition>
      </div>
    </div>
    -->

    <!-- WAP路线图 -->

    <!-- WAP黑钻积分应用场景 -->

    <div class="conitem-bg6 bgcolor">
      <div class="container conitem customers">
        <transition name="fade-top">
          <div v-show="section.eighth" class="section-title">
            <p class="en">WHAT CUSTOMERS SAY</p>
            <p class="cn">{{$lang("用户点评")}}</p>
          </div>
        </transition>
        <transition name="fade-bottom">
          <ul v-show="section.eighth" class="comment-list">
            <li>
              <div class="author">
                <img class="author-avatar" :src="$assets.avatar1" />
                <div class="author-info">
                  <h3 class="name">梓岑</h3>
                  <p class="job">HelloEOS创始人，YOYOW联合创始人</p>
                </div>
              </div>
              <p class="content">
                黑钻评级独创的“超级评审团”制度，以纯粹去中心化的方式重新定义了这个领域，真正规避某个或某些“中心”对评级结果的操控，避免权和利的寻租空间，给用户提供最真实的项目评价和最靠谱的投资参考。黑钻评级让我们看到，去中心化绝不仅限于比特币，就像比特币颠覆了货币的逻辑，我们也可以用分布式自治重新改造任何一个需要“信用”的场景。
              </p>
            </li>
            <li>
              <div class="author">
                <img class="author-avatar" :src="$assets.avatar2" />
                <div class="author-info">
                  <h3 class="name">37度</h3>
                  <p class="job">比特时代副总裁</p>
                </div>
              </div>
              <p class="content">
                黑钻评级的超级评审团产出了大量有价值的的社区评级，这些评级对投资者有着重要的参考作用。另外，黑钻团队是我见过熊市做事的典范，这样的项目和团队应该得到更广泛的支持
              </p>
            </li>
            <li>
              <div class="author">
                <img class="author-avatar" :src="$assets.avatar3" />
                <div class="author-info">
                  <h3 class="name">鱼文辉</h3>
                  <p class="job">Coinvoice CEO</p>
                </div>
              </div>
              <p class="content">
                黑钻评级通过去中心化的方式很好的解决了用户的信任问题；通过超级评审员引导、普通用户一起参与的方式，解决了流量的问题。评级内容是区块链投资者的刚需，未来会有很大的发展空间
              </p>
            </li>
          </ul>
        </transition>
      </div>
    </div>
    <div class="conitem-bg7">
      <div class="container conitem partner">
        <transition name="fade-top">
          <div v-show="section.ninth" class="section-title">
            <p class="en">ECOLOGICAL PARTNER</p>
            <p class="cn">生态伙伴</p>
          </div>
        </transition>
        <transition name="fade-bottom">
          <ul v-show="section.ninth" class="partner-list">
            <li class="icon">
              <img width="150" src="../../assets/image/polkadot.png">
            </li>
            <li class="icon">
              <img width="120" src="../../assets/image/web3.jpg">
            </li>
            <li class="icon">
             <img width="120" src="../../assets/image/kusama.png">
            </li>
            <li class="icon icon-ziyuan"></li>
            <li class="icon icon-exnow"></li>
            <li class="icon icon-jinta"></li>
            <li class="icon icon-shidai"></li>
            <li class="icon icon-yangtuoxi"></li>
            <li class="icon icon-bixiaobai"></li>
            <li class="icon icon-btc1"></li>
            <li class="icon icon-bkex"></li>
            <li class="icon icon-bikuaibao"></li>
            <li class="icon icon-bishijie"></li>
            <li class="icon icon-jinsecaijing"></li>
            <li class="icon icon-bitan"></li>
            <li class="icon icon-ztcom"></li>
            <li class="icon icon-suanli"></li>
            <li class="icon icon-jiugeyi"></li>
          </ul>
        </transition>
      </div>
    </div>
    <div class="conitem keywords">
      <h3>{{$lang("关键词")}}</h3>
      <div class="list">
        <span>黑钻钱包</span>
        <span>区块链钱包</span>
        <span>黑钻评级</span>
        <span>数字货币评级</span>
        <span>区块链</span>
        <span>区块链项目评级</span>
        <span>项目评级</span>
        <span>比特币价格</span>
        <span>比特币资讯</span>
        <span>数字资产评级</span>
        <span>虚拟货币资讯</span>
        <span>BTC</span>
        <span>LTC</span>
        <span>EOS</span>
        <span>ETH</span>
      </div>
    </div>
  </div>
</template>

<script>
import circleProgress from "~components/circleProgress";
export default {
  name: "HZPJ-home",
  components: {
    circleProgress,
  },
  data() {
    return {
      itemData: [],
      section: {},
    };
  },
  computed: {},
  methods: {
    //滚动显示动效
    showSection(e) {
      if (
        this.section.second &&
        this.section.third &&
        this.section.fourth &&
        // this.section.fifth &&
        this.section.sixth &&
        this.section.seventh &&
        this.section.eighth &&
        this.section.ninth
      ) {
        window.removeEventListener("scroll", this.showSection, false);
      }
      let scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      if (scrollTop > 660 - 250 && !this.section.second) {
        this.$set(this.section, "second", true);
      }
      if (scrollTop > 660 * 2 - 250 && !this.section.third) {
        this.$set(this.section, "third", true);
      }
      if (scrollTop > 660 * 3 - 250 && !this.section.fourth) {
        this.$set(this.section, "fourth", true);
      }
      // if (scrollTop > (660 * 4 - 250) && !this.section.fifth) {
      //   this.$set(this.section, 'fifth', true);
      // }
      if (scrollTop > 660 * 4 - 250 && !this.section.eighth) {
        this.$set(this.section, "eighth", true);
      }
      if (scrollTop > 660 * 5 - 250 && !this.section.ninth) {
        this.$set(this.section, "ninth", true);
      }
      if (scrollTop > 660 * 6 - 250 && !this.section.sixth) {
        this.$set(this.section, "sixth", true);
      }
      if (scrollTop > 660 * 7 - 250 && !this.section.seventh) {
        this.$set(this.section, "seventh", true);
      }
    },
    //跳转至项目详情页
    gotoDetail(id) {
      this.$router.push({
        path: `/detail/${id}`,
      });
    },
    //打开下载页 https://wx.heizuan.com/doc/hzpj.pdf
    Download() {
      location.href = "http://fir.heizuan.com/bv9j";
    },
    Viewbook() {
      location.href = "https://wx.heizuan.com/doc/hzpj.pdf";
    },
  },
  mounted() {
    //获取项目列表
    Ajax.get(Api.get_item_list, {
      page_size: 6,
      order: 1,
    }).then((res) => {
      this.itemData = res.data.itemData;
    });
    //显示首屏
    setTimeout(() => {
      this.$set(this.section, "first", true);
    }, 0);
    window.addEventListener("scroll", this.showSection, false);
  },
};
</script>
