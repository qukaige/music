<template>
  <scroll :data="data"
          :listenScroll="listenScroll" :probeType="3"
          @scroll="scroll" class="listview" ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
          <img class="avatar" v-lazy="item.avatar" alt="">
          <span class="name">{{item.name}}</span>
        </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" :class="{'current':currentIndex===index}"
            :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="scrollY<0" ref="fixed">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-if="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import Loading from 'base/loading/loading'
  const ANCHOR_HEIGHT = 18 // 右侧li高度
  const TITLE_HEIGHT = 30 // title标题高度
  export default {
    created(){
      this.touch = {}
      this.listenScroll = true // 滚动监听
      this.listHeight = [] // 存放歌手的高度
    },
    data(){
      return {
        scrollY: -1,
        currentIndex: 0, // 绑定当前滚动的索引
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList(){
        return this.data.map((group) => {
          return group.title.substring(0, 1)
        })
      },
      fixedTitle(){
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      selectItem(item){  //歌手的条目被点击了  把当前这个点击事件派发
        this.$emit('select', item)
      },
      onShortcutTouchStart(e){
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY  // 存储点击的y轴距离
        let anchorIndex = getData(e.target, 'index')
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      refresh(){
        this.$refs.listview.refresh()
      },
      scroll(pos){
        this.scrollY = pos.y
      },
      onShortcutTouchMove(e){
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY //存储move的y轴距离
        console.log(this.touch.y2, this.touch.y1, this.touch.anchorIndex)
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = delta + parseInt(this.touch.anchorIndex)
        this._scrollTo(anchorIndex)
      },
      _scrollTo(index){
        if (!index) { // 如果index 还不存在
          return
        }
        if (index < 0) { // 拖动边栏的时候 边界控制
          index = 0
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight(){  // 获取所有歌手的高度
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          height += list[i].clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data(){
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY){
        if (newY > 0) { // 当下拉到最顶部时  newY是大于0的,此时让第一个高亮
          this.currentIndex = 0
          return
        }
//        实际是23个 push了一个0
        let listHeight = this.listHeight
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 - -newY // li的高度(下线) 减去滚动y轴的的距离  滚到顶部为0
            return
          }
        }
//        上拖到最底部时  如果大于 listHeight 的最后的垒加高度 就让最后一个高亮
// -2是因为 索引-1 + push(0) 实际 length 是23
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal){ // 推动标题 动画开始的距离监听
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
//        this.$refs.fixed.style.transform = `translateY(${this.fixedTop}px)`
        this.$refs.fixed.style.transform = `translate3d(0,${this.fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -1px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
