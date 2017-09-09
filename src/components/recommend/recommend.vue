<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="slider-wrapper">
          <slider v-if="recommends.length">
            <div class="a" v-for="item in recommends">
              <a :href="item.linkUrl">
                <!--needsclick fastclick的事件允许-->
                <img class="needsclick" @load="_loadImage" :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in discList" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60" alt="">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container">
        <loading v-show="!discList.length"></loading>
      </div>
    </scroll>
    <!--承载子路由-->
    <router-view></router-view>
  </div>

</template>

<script type="text/ecmascript-6">
  import {ERR_OK} from 'api/config'
  import {getRecommend, getDiscList} from 'api/recommend'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {mapGetters, mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  export default {
    mixins: [playlistMixin],
    data(){
      return {
        recommends: [],
        discList: []
      }
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'currentSong'
      ])
    },
    watch: {
      fullScreen(){

      }
    },
    created(){
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      // 点击热门歌单跳转2级路由
      selectItem(item){
        this.getDisc(item)
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
      },
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : '0'
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getRecommend(){ // 推荐数据轮播图
        getRecommend().then((res) => {
          if (res.code == ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList(){ // 获取歌单数据
        getDiscList().then((res) => {
          if (res.code == ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      _loadImage(){
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
      ...mapMutations({
        getDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
