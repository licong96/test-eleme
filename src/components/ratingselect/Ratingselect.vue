<template lang="html">
  <div class="ratingselect">
    <!-- 三种类型 -->
    <div class="rating-type">
      <span @click="select(2,$event)" class="block positive" :class="{'active': selectIndex===2}">{{desc.all}}<mark class="count">{{ratings.length}}</mark></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active': selectIndex===0}">{{desc.positive}}<mark class="count">40</mark></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active': selectIndex===1}">{{desc.negative}}<mark class="count">7</mark></span>
    </div>
    <div @click="toggleContent($event)" class="switch" :class="{'on': onClass}">
      <i class="iconfont icon-gouxuan"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  data () {   // 这是曲线救国啊
    return {
      selectIndex: 0,
      onClass: true
    }
  },
  created () {    // 不能直接修改props里的数据，所以先存在这里
    this.selectIndex = this.selectType
    this.onClass = this.onlyContent
  },
  computed: {
    positives () {
    }
  },
  methods: {
    select (type, event) {
      if (!event._constructed) {
        return
      }
      this.selectIndex = type
      // this.$emit('ratingtype.select', type)     // 给父组件发送事件
    },
    toggleContent (event) {
      if (!event._constructed) {
        return
      }
      this.onClass = !this.onClass
      // this.$emit('content.toggle', this.onlyContent)     // 给父组件发送事件
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../common/sass/mixin';

  .ratingselect{
    .rating-type{
      padding: 18px 0;
      margin: 0 18px;
      @include border-b-1px(0);
      font-size: 0;
      .block{
        display: inline-block;
        padding: 8px 12px;
        margin-right: 8px;
        border-radius: 1px;
        line-height: 16px;
        font-size: 12px;
        color: rgb(77, 85, 93);
        &.active{
          color: #fff;
          .count{
            color: #fff;
          }
        }
        .count{
          margin-left: 2px;
          background-color: transparent;
          font-size: 8px;
          color: rgb(77, 85, 93);
        }
        &.positive{
          background-color: rgba(0, 160, 220, 0.2);
          &.active{
            background-color: rgba(0, 160, 220, 1);
          }
        }
        &.negative{
          background-color: rgba(77, 85, 93, 0.2);
          &.active{
            background-color: rgba(77, 85, 93, 0.8);
          }
        }
      }
    }
    .switch{
      padding: 12px 18px;
      line-height: 24px;
      @include border-b-1px(0);
      color: rgb(147, 153, 159);
      font-size: 0;
      &.on{
        .iconfont{
          color: #00c850;
        }
      }
      .iconfont{
        display: inline-block;
        vertical-align: top;
        margin-right: 4px;
        font-size: 24px;
      }
      .text{
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
      }
    }
  }
</style>
