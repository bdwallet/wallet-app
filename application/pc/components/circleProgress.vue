<template>
  <div class="HZPJ-score">
    <div class="circleProgress_wrapper">
      <div class="wrapper r_right">
        <div class="circleProgress rightcircle" :style="{'transform':`rotate(${angleRight}deg)`}"></div>
      </div>
      <div class="wrapper r_left">
        <div class="circleProgress leftcircle" :style="{'transform':`rotate(${angleLeft}deg)`}"></div>
      </div>
      <span>{{scoreValue}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HZPJ-score',
    props: {
      value: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 10,
      },
    },
    data() {
      return {
        scoreValue: 0,
        angleRight: 45,
        angleLeft: 45,
      }
    },
    mounted() {
      let half = this.total / 2;
      let angle = 180 / half;
      let timeout =
        setInterval(() => {
          if (this.scoreValue >= this.value) {
            clearInterval(timeout);
          } else {
            this.scoreValue = (parseFloat(this.scoreValue) + 0.1).toFixed(1);
            if (this.scoreValue <= half) {
              this.angleRight = this.scoreValue * angle + 45;
            } else {
              this.angleLeft = (this.scoreValue - half) * angle + 45;
            }
          }
        }, 30);
    }
  }
</script>


<style lang="less">
  .HZPJ-score {
    .circleProgress_wrapper {
      position: relative;
      display: flex;
      width: 44px;
      height: 44px;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      color: #000;
      .wrapper {
        width: 22px;
        height: 44px;
        position: absolute;
        top: 0;
        overflow: hidden;
      }
      .r_right {
        right: 0;
      }
      .r_left {
        left: 0;
      }
      .circleProgress {
        width: 44px;
        height: 44px;
        border: 4px solid transparent;
        border-radius: 50%;
        position: absolute;
        top: 0;
      }
      .rightcircle {
        border-top: 4px solid #D9DCE4;
        border-right: 4px solid #D9DCE4;
        border-left: 4px solid #5682FF;
        border-bottom: 4px solid #5682FF;
        right: 0;
      }
      .leftcircle {
        border-top: 4px solid #5682FF;
        border-right: 4px solid #5682FF;
        border-bottom: 4px solid #D9DCE4;
        border-left: 4px solid #D9DCE4;
        left: 0;
      }
    }
  }
</style>
