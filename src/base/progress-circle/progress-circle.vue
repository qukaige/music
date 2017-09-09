<template>
  <div class="progress-circle">
    <!--width 实际显示的大小         viewbox :svg的大小-->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent"
              :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
      <!--stroke-dasharray="314"锚边  stroke-dashoffset="110"锚边的偏移量-->
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      radius: { // 直径 32
        type: Number,
        default: 100
      },
      percent: { // 播放比例
        type: Number,
        default: 0
      }
    },
    data(){
      return {
        dashArray: Math.PI * 100  // 314 圆的周长  2 * R * PI
      }
    },
    // mini播放器 外圈滚动条的进度
    computed: {
      dashOffset(){
          // 0完成  314开始
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
