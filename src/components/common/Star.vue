<template lang="html">
  <!-- 评分 -->
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script>
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starType () {
      return 'star-' + this.size
    },
    itemClasses () {
      let result = []
      let score = Math.floor(this.score * 2) / 2      // 向下取整，4.4=4, 4.5=4.5, 4.9=4.5
      let hasDecimal = score % 1 !== 0              // 判断是否有小数.5，为半心
      let integer = Math.floor(score)             // 整心

      for (let i = 0; i < integer; i++) {   // 把对应的class添加进入
        result.push(CLS_ON)
      }
      if (hasDecimal) {   // 半心
        result.push(CLS_HALF)
      }
      while (result.length < LENGTH) {    // 不满五个，添加没心
        result.push(CLS_OFF)
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/sass/mixin';

  .star{
    .star-item{
        display: inline-block;
        background-repeat: no-repeat;
    }
    &.star-48{
      @include star-count(20px, 22px, 'star48');
    }
    &.star-36{
      @include star-count(15px, 6px, 'star36');
    }
    &.star-24{
      @include star-count(10px, 3px, 'star24');
    }
  }


</style>
