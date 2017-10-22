<template lang="html">
  <div class="goods">
    <!-- 左导航 -->
    <div class="meun-wrapper" ref="meunwrapper">
      <ul>
        <li v-for="(item, index) in goods" class="meun-item" :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)">
          <span class="text">
            <span class="icon" :class="classMap[item.type]" v-show="item.type>0"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!-- 右内容 -->
    <div class="foods-wrapper" ref="foodwrapper">
      <ul>
        <li v-for="item in goods" class="food-list" ref="food_list">
          <h2 class="title">{{item.name}}</h2>
          <ul>
            <li v-for="food in item.foods" class="food-item" @click="selectFood(food, $event)">
              <div class="text-icon">
                <img :src="food.icon" alt="">
              </div>
              <div class="content">
                <h3 class="name">{{food.name}}</h3>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span>¥{{food.price}}</span>
                  <span v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
                <!-- 商品添加减少按钮 -->
                <div class="cartcontrol-warp">
                  <my-cartcontrol :food="food" v-on:cartadd="drop"></my-cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 购物车 -->
    <my-shopcart ref="shopcarts" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></my-shopcart>
    <!-- 商品详细页 -->
    <my-food :food="selectedFood" ref="food"></my-food>
  </div>
</template>

<script>
import MyShopcart from '../shopcart/Shopcart.vue'
import MyCartcontrol from '../common/Cartcontrol.vue'
import myFood from '../food/Food.vue'

const ERR_OK = 0  // 请求成功

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],   // 每个区间高度
      scrollY: 0,   // 右侧 Y 轴坐标
      selectedFood: {}
    }
  },
  created () {
    this.fetchData()
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        // 之间的值
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {      // 被选择到的商品会有一个count属性，循环出来放到一个新数组里
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    fetchData () {
      this.$http.get('/api/goods')
        .then(function (response) {
          console.log(response.data.data)
          if (response.data.errno === ERR_OK) {
            this.goods = response.data.data
            // nextTick获取更新后的 DOM
            this.$nextTick(function () {
              this._initScroll()            // 执行
              this._calculateHeight()       // 计算区间的高度，实现对应联动
            })
          }
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    _initScroll () {
      // 启用滚动插件
      this.meunScroll = new this.BScroll(this.$refs.meunwrapper, {
        click: true,
        bounce: false
      })

      this.foodScroll = new this.BScroll(this.$refs.foodwrapper, {
        probeType: 3,   // 滚动的时候，监听滚动位置
        click: true,
        bounce: false
      })

      this.foodScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))    // round取整 abs正值  -2可以解决电脑端模拟计算失误
      })
    },
    _calculateHeight () {
      let foodList = this.$refs.food_list
      let height = 0

      this.listHeight.push(height)    // 第一个区域距离顶部是 0
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight    // 高度是累加的
        this.listHeight.push(height)
      }
    },
    selectMenu (index, event) {   // 左侧列表点击
      if (!event._constructed) {  // 取消插件默认事件
        return
      }
      let foodList = this.$refs.food_list
      let el = foodList[index]
      this.foodScroll.scrollToElement(el, 300)
    },
    drop (target) { // 小球加动画
      this.$nextTick(() => {  // 放到nextTick里可以异步执行，有助于优化
        this.$refs.shopcarts.drop(target)
      })
    },
    selectFood (food, event) {      // 商品详细页
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      this.$refs.food.show()    // 调用子组件方法
    }
  },
  components: {
    MyShopcart,
    MyCartcontrol,
    myFood
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/sass/mixin';

  .goods{
    display: flex;
    position: absolute;
    top: 180px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
    .meun-wrapper{
      width: 80px;
      height: 100%;
      background: #f3f5f7;

      .meun-item {
        display: table;
        padding: 0 12px;
        width: 56px;
        height: 54px;
        line-height: 14px;
        &:last-child{
          &:after{
            display: none;
          }
        }
        &.current{
          background-color: #fff;
          .text{
            color: #f01414;
            &:after {
              border: 0;
            }
          }
        }
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 4px;
          background-size: 12px;
          background-repeat: no-repeat;
          &.decrease{
            @include bg-image('decrease_3');
          }
          &.discount{
            @include bg-image('discount_3');
          }
          &.guarantee{
            @include bg-image('guarantee_3');
          }
          &.invoice{
            @include bg-image('invoice_3');
          }
          &.special{
            @include bg-image('special_3');
          }
        }
        .text {
          display: table-cell;
          width: 56px;
          font-size: 12px;
          vertical-align: middle;
          @include border-b-1px(0);
        }
      }
    }
    .foods-wrapper{
      flex: 1;
      .title{
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }
      .food-item{
        display: flex;
        padding: 18px;
        &:last-child{
          &:after{
            display: none;
          }
        }
        @include border-b-1px(0);
        .text-icon{
          width: 57px;
          margin-right: 10px;
          img{
            width: 100%;
          }
        }
        .content{
          position: relative;
          flex: 1;
          .name{
            margin: 2px 0 8px 0;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .desc,
          .extra{
            margin-bottom: 8px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .extra{
            span{
              margin-right: 12px;
            }
          }
          .price{
            line-height: 26px;
            font-weight: 700;
            span:first-child{
              margin-right: 4px;
              font-size: 14px;
              color: rgb(240, 20, 20);
            }
            span:last-child{
              text-decoration: line-through;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          // 商品添加减少按钮
          .cartcontrol-warp{
            position: absolute;
            bottom: -6px;
            right: 0;
          }
        }
      }
    }
  }

</style>
