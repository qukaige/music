<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <!--背景-->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!--顶部按钮 标题-->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle border-1px" v-html="currentSong.singer"></h2>

        </div>
        <!--中间歌手图片-->
        <div class="middle"
             @touchstart.stop.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="paly-bar" ref="palyBar">
            <img class="paly-bar-img" :class="playBarClass" width="100%" src="data:image/png;base64,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" alt="">
          </div>
          <div class="middle-l" ref="middle">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <span class="playing-lyric">{{playingLyric}}</span>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current':currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!--底部播放按钮-->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @percentChange="onProgressBarChange" :percent="percent"></progress-bar>
            </div>
            <span class="time time-r"> {{format(currentSong.drution)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--迷你播放器-->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i class="icon-mini" :class="miniIcon" @click.stop.prevent="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio @ended="playEnd" :src="currentSong.url" @error="error" @canplay="ready" ref="audio"
           @timeupdate="updateTime"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default {
    data(){
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null, // 当前播放歌词,
        currentLineNum: 0,  // 当前歌词播放的行
        currentShow: 'cd', // 显示歌词还是 cd
        playingLyric: ''
      }
    },
    created(){
      this.touch = {}
    },
    computed: {
      playBarClass(){
        return this.playing ? 'in' : 'out'
      },
      cdCls(){
        return this.playing ? 'play' : 'play pause'
      },
      playIcon(){
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon(){
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
//      随机播放,顺序播放图标(根据当前mode)
      iconMode(){
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      disableCls(){
        return this.songReady ? '' : 'disable'
      },
      percent(){
        return this.currentTime / this.currentSong.drution
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    watch: {
      // 歌曲发生变化 (点击下一曲 自动播放)
      currentSong(){
        if (arguments[0] === arguments[1]) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop() // 如果歌词已经被播放 先停止之前的歌词定时器
        }
        setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()//
        },1000)
      },
      // 播放暂停
      playing(newPlaying){
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    methods: {
      middleTouchStart(e){
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
        this.$refs.lyricList.$el.style[transitionDuration] = 0
      },// cd 歌词左右滑动
      middleTouchMove(e){
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const dataX = touch.pageX - this.touch.startX
        const dataY = touch.pageY - this.touch.startY
        if (Math.abs(dataY) > Math.abs(dataX)) {
          return
        }
        // 滚动距离不能大于0 小于-window.innerWidth
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(Math.max(-window.innerWidth, dataX + left), 0)
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.middle.style.opacity = 1 - this.touch.percent
        this.$refs.palyBar.style.opacity = 1 - this.touch.percent

        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.touch.cancelTouchEnd = true
      },
      middleTouchEnd(e){
        if (!this.touch.cancelTouchEnd) {
          return
        }
        this.touch.cancelTouchEnd = false
        this.touch.initiated = false
        let offsetWidth, opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.2) {
            offsetWidth = -window.innerWidth
            this.currentShow = 'lyric'
            opacity = 0
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.8) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middle.style.opacity = opacity
        this.$refs.palyBar.style.opacity = opacity
        this.$refs.middle.style[transitionDuration] = `${time}ms`
      },
      getLyric(){ // 歌词
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric) // 歌词解析第3方
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      // 回调函数有两个参数 行号(行索引0开始),当前行歌词
      handleLyric({lineNum, txt}){ // 每行歌词发生改变时 回调
        this.playingLyric = txt
        this.currentLineNum = lineNum // 绑定当前行的歌词样式
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
      },
//        播放完成当前歌曲,进入下一首播放
      playEnd(){
        if (this.mode === playMode.loop) { // 循环
          this.loop()
        } else {
          this.next() // 还要判断是随机还是顺序...
        }
      },
      // 循环播放
      loop(){
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      // 上一曲
      prev(){
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      // 下一曲
      next(){
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      // 播放暂停 的取反
      togglePlaying(){
        if (!this.songReady) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
        this.setPlayingState(!this.playing)
      },
      // 点击顶部 back 显示mini播放器
      back(){
        this.setFullScreen(false)
      },
      // 打开全屏播放器
      open(){
        this.setFullScreen(true)
      },
//      歌曲正常加载
      ready(){
        this.songReady = true
      },
      error(){
        console.log('歌曲播放失败!')
        this.songReady = true
      },
      // 当audio 播放时间变化
      updateTime(e){
        this.currentTime = e.target.currentTime
      },
      format(interval){
        interval = interval | 0
        let minute = interval / 60 | 0
        let second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      onProgressBarChange(percent){
//          设置歌曲进度
        const currentTime = this.currentSong.drution * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      // 点击变换播放状态(012) ,并改变当前播放列表顺序
      changeMode(){
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      // 从新计算当前播放的音乐的 索引
      resetCurrentIndex(list){
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      // 秒前补0
      _pad(num, n = 2){
        let secondLen = num.toString().length
        while (secondLen < n) {
          num = '0' + num
          secondLen++
        }
        return num
      },
      // js动画钩子
      enter(el, done){
        const {x, y, scale} = this._getPosAndScale()
        let animation = {
          0: {
//           从哪里到哪里的意思
            // -147  428   scale  0.123  开始运动的起点
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.2)`
          },
          100: {
            //  100%结束点  就是元素本身所在的位置
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
//        注册动画
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
//        运行 关联元素
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)//done动画结束回调执行下一个动画
      },
      afterEnter(){
//      解绑动画
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done){ // done 结束后执行下一步动画
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave(){
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getPosAndScale(){
//          底部歌曲图片的大小
        const targetWidth = 40
//          底部歌曲图片(中心点)距离左边的距离
        const paddingLeft = 40
//        底部距离为30
        const paddingBottom = 30
//        中心大图到顶部的距离
        const paddingTop = 80
        // 图片的width
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width // 初始缩放比例
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        // 就是找到mini播放器的图片中心点**  对应着中间大图片坐标0,0,构成了飞入
//        x取负数,因为大图中心点 左边为负坐标了...
        return {
          x, y, scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      })
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          padding-bottom 2px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
          border-1px(rgba(255,255,255,0.4))
      .middle
        position: fixed
        overflow hidden
        width: 100%
        top: 60px
        bottom: 170px
        padding-top 20px
        white-space: nowrap
        font-size: 0
        .paly-bar
          position: absolute
          width: 100px
          left: 50%
          top: 0px
          margin-left -20px
          height: 160px
          z-index 999
          .paly-bar-img
            position: absolute
            -webkit-transform-origin: top left;
            transition: all .3s linear
            &.in
              top: -15px
              transform rotate(-12deg)
            &.out
              top: -10px
              transform rotate(-30deg)
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 20px
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
                padding 40px
                background-image url("../../common/image/img_black_bg3.png")
                background-repeat no-repeat
                background-size 100% 100%
                box-sizing: border-box

          .playing-lyric-wrapper
            width: 80%
            margin: 40px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 30px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
