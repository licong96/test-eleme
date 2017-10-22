<template lang="html">
  <div class="food-warp">
    <transition name="translatex">
      <div class="food" v-show="showFlag" ref="scrollfood">
        <div food-content>
          <!-- 顶部图片 -->
          <div class="image-header">
            <img :src="food.image" alt="">
            <span class="back" @click="hide">
              <i class="iconfont icon-fanhui"></i>
            </span>
          </div>
          <!-- 内容页 -->
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <!-- 加入购物车按钮 -->
            <div class="cartcontrol-warp">
              <my-cartcontrol :food="food"></my-cartcontrol>
            </div>
            <transition name="fadel">
              <div class="buy" v-show="!food.count || food.count === 0" @click.stop="addFirst">加入购物车</div>
            </transition>
          </div>
          <!-- 商品信息 -->
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <!-- 商品评价 -->
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <my-ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></my-ratingselect>
            <!-- 评价列表 -->
            <div class="rating-wrapper">
              <ul v-show="food.ratings && food.ratings.length">
                <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img class="avatar" :src="rating.avatar" alt="">
                  </div>
                  <div class="time">{{rating.rateTime}}</div>
                  <p class="text">
                    <i v-show="rating.rateType===0" class="thumb-up iconfont icon-noun154796cc"></i>
                    <i v-show="rating.rateType===1" class="thumb-down iconfont icon-noun154796cc-copy"></i>
                    <span class="text-info">{{rating.text}}</span>
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import MyCartcontrol from '../common/Cartcontrol.vue'
import split from '../common/Split.vue'
import MyRatingselect from '../ratingselect/Ratingselect.vue'

// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    show () {
      this.showFlag = true
      // 每次显示都初始化
      this.selectType = ALL
      this.onlyContent = true
      this.$nextTick(() => {
        console.log(this.food)
        if (!this.scroll) {
          this.scroll = new this.BScroll(this.$refs.scrollfood, {
            click: true,
            bounce: false
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    },
    addFirst (event) {   // 添加一个到购物车
      if (!event._constructed) {
        return
      }
      this.$set(this.food, 'count', 1)
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  components: {
    MyCartcontrol,
    MyRatingselect,
    split
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/sass/mixin';
  .food{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .image-header{
      position: relative;
      width: 100%;
      height: 0;
      // 这样可以有一个宽高相等的容器
      padding-top: 100%;
      img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .back{
        position: absolute;
        top: 0;
        left: 0;
        color: #fff;
        padding: 12px;
        i{
          background-color: rgba(0,0,0,.5);
          border-radius: 50%;
          padding: 5px;
          font-size: 20px;
        }
      }
    }
    .content{
      position: relative;
      padding: 18px;
      .title{
        line-height: 14px;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
      }
      .detail{
        margin-bottom: 18px;
        line-height: 10px;
        height: 10px;
        font-size: 0;
        span{
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .sell-count{
          margin-right: 12px;
        }
      }
      .price{
        line-height: 24px;
        font-weight: 700;
        span:first-child{
          margin-right: 8px;
          font-size: 14px;
          color: rgb(240, 20, 20);
        }
        span:last-child{
          text-decoration: line-through;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
    }
    // 加入购物车按钮
    .cartcontrol-warp{
      position: absolute;
      right: 12px;
      bottom: 12px;
    }
    .buy{
      position: absolute;
      right: 18px;
      bottom: 18px;
      z-index: 10;
      height: 25px;
      line-height: 25px;
      padding: 1px 10px;
      box-sizing: border-box;
      border-radius: 12px;
      font-size: 10px;
      background-color: rgb(0, 160, 220);
      color: #fff;
      transform-origin: right;
    }
    // 商品信息
    .info{
      padding: 18px;
      .title{
        margin-bottom: 6px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .text{
        padding: 0 8px;
        line-height: 24px;
        font-size: 12px;
        color: rgb(77, 85, 93);
      }
    }
    // 商品评价
    .rating{
      padding-bottom: 48px;
      padding-top: 18px;
      .title{
        padding: 0 18px;
        line-height: 14px;
        margin-bottom: 6px;
        font-size: 14px;
        color: $color1;
      }
      .rating-wrapper{
        padding: 0 18px;
        .rating-item{
          position: relative;
          padding: 16px 0;
          @include border-b-1px(0);
          .user{
            position: absolute;
            right: 0;
            top: 16px;
            line-height: 20px;
            font-size: 0;
            .name{
              display: inline-block;
              margin-right: 6px;
              vertical-align: top;
              font-size: 10px;
              color: $color2;
            }
            .avatar{
              width: 20px;
              height: 20px;
              border-radius: 50%;
            }
          }
          .time{
            margin-bottom: 6px;
            line-height: 12px;
            font-size: 10px;
            color: $color2;
          }
          .text{
            font-size: 0;
            color: $color1;
            vertical-align: bottom;
            .thumb-up,
            .thumb-down{
              display: inline-block;
              vertical-align: bottom;
              margin-right: 4px;
              font-size: 24px;
            }
            .thumb-up{
              color: rgb(0, 160, 220);
            }
            .thumb-down{
              color: $color2;
            }
            .text-info{
              display: inline-block;
              vertical-align: bottom;
              font-size: 12px;
              line-height: 24px;
            }
          }
        }
      }
    }
  }

  // 商品详情页打开动画
  .translatex-enter-active {
    animation: translatex .3s;
  }
  .translatex-leave-active {
    animation: translatex .3s reverse;
  }
  @keyframes translatex {
    0% {
      transform: translate3d(100%, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }
  // 加入购物车按钮渐变过渡
  .fadel-enter-active {
    animation: fadel .3s;
  }
  .fadel-leave-active {
    animation: fadel .3s reverse;
  }
  @keyframes fadel {
    0% {
      opacity: 0;
      transform: scaleX(.4);
    }
    100% {
      opacity: 1;
      transform: scaleX(1);
    }
  }


</style>
