<template lang="html">
  <!-- 购物车 -->
  <div class="shopcart-warp">
    <div class="shopcart">
      <div class="content">
        <!-- 左边 -->
        <div class="content-left" @click="toggleList">
          <!-- 购物车logo -->
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount>0}">
              <i class="iconfont icon-gouwuche" :class="{'highlight': totalCount>0}" ref="iconscale"></i>
            </div>
            <span class="num" v-show="totalCount>0">{{totalCount}}</span>
          </div>
          <div class="price" :class="{'highlight': totalPrice>0}">¥{{totalPrice}}</div>
          <div class="desc">另需配送费<span>¥{{deliveryPrice}}元</span></div>
        </div>
        <!-- 右边 -->
        <div class="content-right" @click="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <!-- 购物车详细 -->
      <transition name="fold">
        <section class="shopcart-list" v-show="listShow">
          <header class="list-header">
            <h2 class="title">购物车</h2>
            <span class="empty" @click="empty">清空</span>
          </header>
          <article class="list-content" ref="listconent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  ¥<span>{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-warp">
                  <my-cartcontrol :food="food"></my-cartcontrol>
                </div>
              </li>
            </ul>
          </article>
        </section>
      </transition>
    </div>
    <!-- 小球动画 -->
    <div class="ball" v-show="ballHide" ref="ballgun">
      <div class="inner"></div>
    </div>
    <!-- 遮罩 -->
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
import MyCartcontrol from '../common/Cartcontrol.vue'
import animations from 'create-keyframe-animation'   // js编写css动画

export default {
  data () {
    return {
      ballHide: false,
      fold: true
    }
  },
  props: {
    selectFoods: {    // 被选择到的商品
      type: Array,
      default () {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  computed: {
    totalPrice () {   // 计算总价
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {   // 选择商品的总数量
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {      // 计算还差多少起送
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass () {   // 结算状态 class
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    listShow () {
      if (!this.totalCount) {
        this.fold = true
        return false
      }
      let show = !this.fold
      // 加区域滚动
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new this.BScroll(this.$refs.listconent, {
              click: true,
              bounce: false
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
      return show
    }
  },
  methods: {
    drop (el) {       // 点击的位置
      // console.log(el.getBoundingClientRect())
      let {left, top} = el.getBoundingClientRect()
      let x = left - 32
      let y = -(window.innerHeight - top - 40)
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0)`
        },
        90: {
          transform: `translate3d(0, 0, 0,)`,
          opacity: 1
        },
        100: {
          transform: `translate3d(0, 0, 0,)`,
          opacity: 0
        }
      }
      // 注册create-keyframe-animation
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 300,
          easing: 'ease'
        }
      })
      // 运行，获取要执行的元素
      this.ballHide = true
      animations.runAnimation(this.$refs.ballgun, 'move', this.iconScale)   // iconScale 购物车图标动画
    },
    iconScale () {
      // 清除上面的动画
      this.ballHide = false
      this.$refs.ballgun.style.animation = ''
      let animation = {
        0: {
          transform: `scale(1)`
        },
        50: {
          transform: `scale(1.3)`
        },
        100: {
          transform: `scale(1)`
        }
      }
      // 注册create-keyframe-animation
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 300,
          easing: 'ease'
        }
      })
      // 运行，获取要执行的元素
      animations.runAnimation(this.$refs.iconscale, 'move', this.iconClear)   // done是回调
    },
    iconClear () {
      this.$refs.iconscale.style.animation = ''
    },
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    empty () {    // 清除购物车
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    hideList () {   // 遮罩隐藏购物车
      this.fold = true
    },
    pay () {    // 去结算
      if (this.totalPrice < this.minPrice) {
        return
      } else {
        alert('结算')
      }
    }
  },
  components: {
    MyCartcontrol
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/sass/mixin';

  .shopcart{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
    .content{
      display: flex;
      height: 100%;
      background-color: #141d27;
      color: #80858a;
      font-size: 0;
      .content-left{
        flex: 1;
        .logo-wrapper{
          display: inline-block;
          position: relative;
          top: -10px;
          margin: 0 10px;
          padding: 6px;
          width: 56px;
          height: 56px;
          box-sizing: border-box;
          vertical-align: top;
          border-radius: 50%;
          background: #141d27;
          .logo{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            text-align: center;
            background-color: #2b343c;
            // 高亮
            &.highlight{
              background-color: rgb(0, 160, 220);
            }
            i{
              display: inline-block;
              position: relative;
              z-index: 222;
              line-height: 44px;
              font-size: 24px;
              &.highlight{
                color: #fff;
              }
            }
          }
          .num{
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 16px;
            font-size: 9px;
            font-weight: 400;
            color: #fff;
            background-color: rgb(240, 20, 20);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
          }
        }
        .price{
          display: inline-block;
          vertical-align: top;
          margin-top: 12px;
          line-height: 24px;
          padding-right: 8px;
          box-sizing: border-box;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 16px;
          font-weight: 700;
          &.highlight{
            color: #fff;
          }
        }
        .desc{
          display: inline-block;
          vertical-align: top;
          margin-top: 12px;
          margin-left: 8px;
          line-height: 24px;
          font-size: 12px;
          &>span{
            display: inline-block;
            padding-left: 4px;
          }
        }
      }
      .content-right{
        width: 100px;
        .pay{
          height: 48px;
          line-height: 48px;
          text-align: center;
          background-color: #2b343c;
          font-size: 12px;
          font-weight: 700;
          &.not-enough{
            background-color: #2b333b;
          }
          &.enough{
            background-color: #00b43c;
            color: #fff;
          }
        }
      }
    }
    .shopcart-list{
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      transform: translate3d(0,-100%,0);
      .list-header{
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background-color: #f3f5f7;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .title{
          float: left;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .empty{
          float: right;
          padding: 0 10px;
          font-size: 12px;
          color: rgb(0, 160, 220);
        }
      }
      .list-content{
        padding: 0 18px;
        max-height: 200px;
        overflow: hidden;
        background-color: #fff;
        .food{
          display: flex;
          align-items: center;
          position: relative;
          padding: 12px 0;
          box-sizing: border-box;
          @include border-b-1px(0);
          .name{
            flex: 1;
            line-height: 24px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .price{
            min-width: 35px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(240, 20, 20);
            span{
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  // 小球动画
  .ball {
    position: fixed;
    left: 32px;
    bottom: 22px;
    z-index: 200;
    .inner {
      border-radius: 50%;
      width: 16px;
      height: 16px;
      background-color: rgb(0, 160, 220);
    }
  }

  // 购物车遮罩
  .list-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    opacity: 1;
    background-color: rgba(7, 17, 27, 0.6);
    /* ios 背景效果 */
    backdrop-filter: blur(2px);
  }

  // 购物车详细过渡
  .fold-enter-active {
    animation: bounce-in .3s;
  }
  .fold-leave-active {
    animation: bounce-in .3s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: translate3d(0,0,0);
    }
    100% {
      transform: translate3d(0,-100%,0);
    }
  }
  // 购物车遮罩过渡
  .fade-enter-active {
    animation: fade-in .3s;
  }
  .fade-leave-active {
    animation: fade-in .3s reverse;
  }
  @keyframes fade-in {
    0% {
      opacity: 0;
      background-color: rgba(7, 17, 27, 0);
    }
    100% {
      opacity: 1;
      background-color: rgba(7, 17, 27, 0.6);
    }
  }

</style>
