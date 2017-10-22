<template lang="html">
  <!-- 商品添加减少按钮 -->
  <div class="cartcontrol">
    <transition name="fade">
      <div class="cart-decrease" v-show="food.count>0" @click.stop="decreaseCart">
        <i class="iconfont icon-jian"></i>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add" @click.stop="addCart">
      <i class="iconfont icon-jia"></i>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart (event) {
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {   // 给选择的商品添加 count 属性，有就累加
        Vue.set(this.food, 'count', 1)  // Vue.set 添加一个属性可以被检测到，同时触发视图更新
      } else {
        this.food.count++
      }

      // 添加商品同时发送当前元素，给购物车小球加动画
      this.$emit('cartadd', event.target)
    },
    decreaseCart (event) {
      if (!event._constructed) {
        return
      }
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .cartcontrol{
    font-size: 0;
    .cart-decrease,
    .cart-add{
      display: inline-block;
      padding: 12px 6px;
      i{
        padding: 4px;
        box-sizing: border-box;
        background-color: rgb(0, 160, 220);
        border: 2px solid rgb(0, 160, 220);
        border-radius: 50%;
        font-size: 12px;
        color: #fff;
      }
    }
    .cart-count{
      display: inline-block;
      min-width: 16px;
      font-size: 14px;
      color: rgb(147, 153, 159);
      text-align: center;
    }
    .cart-decrease{
      i{
        background-color: transparent;
        border: 2px solid rgb(0, 160, 220);
        box-sizing: border-box;
        color: rgb(0, 160, 220);
      }
    }
  }

  // 动画
  .fade-enter-active, .fade-leave-active {
    transition: all .4s linear;
    transform: translate3d(0, 0, 0) rotate(0);
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
    transform: translate3d(32px, 0, 0) rotate(180deg);
  }
</style>
