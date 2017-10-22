<template lang="html">
  <header class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="support-count" v-if="seller.supports" @click="showDetail">
        <span>{{seller.supports.length}}个</span>
        <i class="iconfont icon-icon"></i>
      </div>
    </div>
    <!-- 公告 -->
    <div class="content-footer">
      <span></span>
      <p class="text_over">{{seller.bulletin}}</p>
      <i class="iconfont icon-icon" @click="showDetail"></i>
    </div>
    <!-- 背景模糊图 -->
    <div class="background">
      <img :src="seller.avatar" alt="">
    </div>
    <!-- 详细浮层 -->
    <transition name="fade">
      <div v-if="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h2>{{seller.name}}</h2>
            <!-- 评分 -->
            <div class="star-warp">
              <my-star :size="48" :score="seller.score"></my-star>
            </div>
            <!-- 横线 -->
            <div class="line">
              <div class="line-s"></div>
              <div class="line-title">优惠信息</div>
              <div class="line-s"></div>
            </div>
            <!-- 优惠 -->
            <div class="support-warp">
              <div class="supports" v-if="seller.supports" v-for="item in seller.supports">
                <span class="icon" :class="classMap[item.type]"></span>
                <span class="text">{{item.description}}</span>
              </div>
            </div>
            <!-- 商家公告标题 -->
            <div class="line">
              <div class="line-s"></div>
              <div class="line-title">商家公告</div>
              <div class="line-s"></div>
            </div>
            <!-- 商家公告文字 -->
            <div class="bulletin">
              <p class="bullentin-p">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <!-- 关闭图标 -->
        <div class="detail-close">
          <i class="iconfont icon-guanbi" @click="hideDetail"></i>
        </div>
      </div>
    </transition>
  </header>
</template>

<script>
import MyStar from '../common/Star.vue'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      detailShow: false  // 显示隐藏
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    showDetail () {   // 显示
      this.detailShow = true
    },
    hideDetail () {   // 隐藏
      this.detailShow = false
    }
  },
  components: {
    MyStar
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/sass/_layout';    //@include MQ(S|M|L){}
@import '../../common/sass/mixin';

  .header{
    position: relative;
    color: #fff;
    background-color: rgba(7, 17, 27, 0.5);
    overflow: hidden;
    .content-wrapper{
      position: relative;
      display: flex;
      padding: 24px 12px 24px 24px;
      .content{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 16px;
        .title{
          display: flex;
          align-items: center;
          .brand{
            display: inline-block;
            width: 30px;
            height: 18px;
            @include bg-image(brand);
            background-size: 30px 18px;
            background-repeat: no-repeat;
          }
          .name{
            margin-left: 6px;
            font-size: 16px;
            font-weight: 700;
          }
        }
        .description{
          font-size: 12px;
        }
        .supports{
          @include supports(12px, 4px, 1);
        }
      }
      .support-count{
        position: absolute;
        bottom: 14px;
        right: 12px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        border-radius: 14px;
        background-color: rgba(0,0,0,0.2);
        text-align: center;
        color: #fff;
        span{
          font-size: 12px;
        }
        i{
          margin-left: 2px;
          font-size: 12px;
          font-weight: normal;
        }
      }
    }
    .content-footer{
      display: flex;
      align-items: center;
      height: 28px;
      line-height: 28px;
      padding: 0 12px;
      background-color: rgba(0,0,0,0.2);
      span{
        width: 22px;
        height: 12px;
        @include bg-image(bulletin);
        background-size: 22px 12px;
        background-repeat: no-repeat;
      }
      p{
        flex: 1;
        padding-left: 4px;
        font-size: 12px;
      }
      i{
        line-height: 28px;
        padding: 0 6px;
        font-size: 12px;
        font-weight: normal;
      }
    }
    .background{
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      z-index: -1;
      filter: blur(10px);
      img{
        width: 100%;
      }
    }
    .avatar{
      width: 64px;
      img{
        display: block;
        max-width: 100%;
        border-radius: 2px;
      }
    }
    // 详细浮层
    .detail{
      position: fixed;
      z-index: 100;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      -ms-overflow-style: -ms-autohiding-scrollbar;
      -webkit-overflow-scrolling: touch;
      background: rgba(7, 17, 27, 0.8);
      /* ios 背景效果 */
      backdrop-filter: blur(10px);
      .detail-wrapper{
        width: 100%;
        min-height: 100%;
        .detail-main{
          width: 100%;
          margin-top: 64px;
          padding-bottom: 64px;
          h2{
            text-align: center;
            font-size: 16px;
            font-weight: 700;
          }
          .star-warp{
            margin-top: 18px;
            padding: 2px 0;
            text-align: center;
          }
          // 横线
          .line{
            display: flex;
            align-items: center;
            width: 80%;
            margin: 28px auto 24px auto;
            .line-s{
              flex: 1;
              border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            .line-title{
              padding: 0 12px;
              font-size: 14px;
              font-weight: 700;
            }
          }
          .support-warp{
            width: 80%;
            margin: 0 auto;
            .supports{
              @include supports(16px, 6px, 2);
              margin-bottom: 8px;
            }
          }
          .bulletin{
            width: 80%;
            margin: 0 auto;
            p{
              line-height: 1.5;
              font-size: 14px;
              font-weight: normal;
              text-indent: 28px;
              letter-spacing: 1px;
            }
          }
        }
      }
      // 关闭按钮
      .detail-close{
        margin-top: -64px;
        text-align: center;
        clear: both;
        i{
          padding: 10px;
          font-size: 18px;
        }
      }
    }
  }
  .fade-enter-active {
    animation: fadeIn 0.5s;
  }
  .fade-leave-active {
    animation: fadeOut 0.5s;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  @keyframes fadeOut {
    0% {
      opacity: 1
    }
    100% {
      opacity: 0
    }
  }
</style>
