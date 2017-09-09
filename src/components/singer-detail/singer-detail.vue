<!--详情列表..-->
<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'
  export default {
    data(){
      return {
        songs: []
      }
    },
    computed: {
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      },
      ...mapGetters([
        'singer' // 挂载getters.js 中的singer
      ])
    },
    created(){
      this._getDetail()
    },
    methods: {
        // 根据歌手id 获取音乐列表
      _getDetail(){
        if (!this.singer.id) {
          this.$router.push({ // 路由跳转
            path: '/singer'
          })
          return
        }
        getSingerDetail(this.singer.id).then((response) => {
          if (response.code === ERR_OK) {
            this.songs = this._normalizeSongs(response.data.list)
          }
        })
      },
//      歌曲数据的处理
      _normalizeSongs(list){
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          //let musicData = item.musicData 等价于
          if (musicData.songid && musicData.songmid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all .3s linear
    transform: translate3d(0, 0, 0)

  .slide-enter, .slide-leave-active
    transform: translate3d(100%, 0, 0)
</style>
