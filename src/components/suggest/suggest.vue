<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          ref="suggest"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll"
          @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li class="suggest-item" @click="selectItem(item)" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉,暂无搜索结果!"></no-result>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  const TYPE_SINGER = 'singer'
  const perpage = 20
  export default {
    created(){
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: { // 搜索中需要显示歌手,但是收藏中不许要显示歌手,维护这个变量
        type: Boolean,
        default: true
      }
    },
    data(){
      return {
        page: 1,
        result: [], // 搜索的歌曲
        hasMore: true, // 检索歌曲的标识,如果歌曲加载已经大于歌曲列表return
        pullup: true, // 子组件是否支持上拉刷新
        beforeScroll: true
      }
    },
    methods: {
      listScroll(){ // 滚动一开始回调,(移动端键盘隐藏)
        this.$emit('beforeScroll') // 在发送给父组件
      },
      searchMore(){ // scroll事件 搜索歌曲滚动到底部了,上拉加载
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkHasMore(res.data)
          }
        }, (err) => {
          console.log(err)
        })
      },
      getIconCls(item){
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item){
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.singer}-${item.name}`
        }
      },
      selectItem(item){
        if (item.type === TYPE_SINGER) { // 如果(第一个)是歌手
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      _search(){
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkHasMore(res.data)
          }
        }, (err) => {
          console.log(err)
        })
      },
      _checkHasMore(data){ // 查看歌曲是否超出总条数
        const song = data.song
        if (!song.list.length || (song.curpage * song.curnum) >= song.totalnum) {
          this.hasMore = false
        }
      },
      _genResult(data){ // 处理搜索结果,因为可能有歌手 和 歌曲两个对象
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          // 扩展运算符
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})// 多个对象合并一个 {...{},...{},...n} = {...}
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list){
        let ret = []
        list.forEach((item) => {
          if (item.albummid && item.songmid) {
            ret.push(createSong(item))
          }
        })
        return ret
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query(){
        this._search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
