<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll'
  export default {
    props: {
      probeType: { // 滑动监听 123档滑动的速度 是否截流
        type: Number,
        default: 1
      },
      click: { //是否可点击
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: { // 滚动监听
        type: Boolean,
        default: false
      },
      pullup: { // 是否支持上拉刷新,默认 false
        type: Boolean,
        default: false
      },
      beforeScroll:{ // 滚动一开始,触发
        type:Boolean,
        default: false
      }
    },
    mounted(){
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll(){
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          deceleration: 0.001
        })

        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos) // 在父组件监听,监听事件名@scroll='scroll()'
          })
        }
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y < this.scroll.maxScrollY + 50) {
              this.$emit('scrollToEnd') // 滚到底部了,需要加载数据
            }
          })
        }
        if(this.beforeScroll){
          this.scroll.on('beforeScrollStart',()=>{
            this.$emit('beforeScroll')
          })
        }
      },
//      方法代理
      enable(){
        this.scroll && this.scroll.enable()
      },
      disable(){
        this.scroll && this.scroll.disable()
      },
      refresh(){
        this.scroll && this.scroll.refresh()
      },
      scrollTo(){
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement(){
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data(){
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
