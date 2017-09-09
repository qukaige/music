<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart="progressTouchStart"
           @touchmove="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'
  const progressBtnWidth = 16
  const transform = prefixStyle('transform')
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created(){
      this.touch = {}  // 共享变量
    },
    methods: {
      // 点击progress 设置播放进度
      progressClick(e){
        // this._offset(e.offsetX) 当点击btn(拖动进度的btn)时会被阻止
        let rect = this.$refs.progressBar.getBoundingClientRect()
        let offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        this._triggerPercent()
      },
      progressTouchStart(e){
        // 标识
        this.touch.initiated = true
        // 记录点击的x轴位置
        this.touch.startX = e.touches['0'].pageX
//        点击按钮获取  当前已经播放了 多少长度
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e){
        // 如果没有点击进入到这里 return
        if (!this.touch.initiated) {
          return
        }
        // 拖动时,当前拖动的x-点击记录下的x
        const dataX = e.touches['0'].pageX - this.touch.startX
        // 点击播放的长度 + 拖动的x距离 ,不能小于0 不能大于progress的width
        const offsetWidth = Math.min(Math.max(0, dataX + this.touch.left), this.$refs.progressBar.clientWidth - progressBtnWidth)
        this._offset(offsetWidth)
      },
      progressTouchEnd(e){
//      拖动结束,需要告诉外部,我被拖动的位置
        this.touch.initiated = false
        this._triggerPercent()
      },
      // 计算当前拖动的百分百 通知外部更改播放进度
      _triggerPercent(){
        // 总长度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 当前拖动的播放进度   /  总长度  = 百分比
        // 外部调用 歌曲的总时长 * 百分百 设置audio 的当前播放进度
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      // 设置width 和btn 的动画偏移
      _offset(offsetWidth){
        this.$refs.progress.style.width = offsetWidth + 'px'
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      percent(newPercent){
        if (newPercent >= 0 && !this.touch.initiated) {
//              减去按钮的宽度   最后按钮停留位置
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = barWidth * newPercent
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
