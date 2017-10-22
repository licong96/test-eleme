<template>
  <div id="app">
    <!-- header -->
    <my-header :seller="seller"></my-header>
    <!-- tab -->
    <nav class="tab border-b-1px">
      <router-link to="/goods">商品</router-link>
      <router-link to="/rationgs">评价</router-link>
      <router-link to="/seller">商家</router-link>
    </nav>
    <!-- content内容路由 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MyHeader from './components/header/Header.vue'

export default {
  name: 'app',
  data () {
    return {
      seller: {}
    }
  },
  created () {
    // 组件创建完后获取数据
    this.fetchData()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    // '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.$http.get('/api/seller')
        .then(function (response) {
          this.seller = response.data.data
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  components: {
    MyHeader
  }
}
</script>

<style lang="scss" scoped>
  @import './common/sass/mixin';

  #app{
    .tab{
      display: flex;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      @include border-b-1px(0);
      a{
        display: block;
        flex: 1;
        font-size: 16px;
        color: rgb(77, 85, 93);
        &.router-link-active{
          color: rgb(240, 20, 20);
        }
      }
    }
  }
</style>
