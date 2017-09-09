<template>
  <transition name="slide">
    <music-list :bgImage="bgImage" :rank="rank" :title="title" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from  'vuex'
  import {createSong} from 'common/js/song'
  export default {
    data(){
      return {
        songs: [],
        rank: true
      }
    },
    computed: {
      bgImage(){
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      title(){
        return this.topList.topTitle
      },
      ...mapGetters([
        'topList'
      ])
    },
    created(){
      if (!this.topList.id) {
        this.$router.push({
          path: '/rank'
        })
        return
      }
      this._getMusicList()
    },
    methods: {
      _getMusicList(){
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs(list){
        let ret = []
        list.forEach((item) => {
          const song = item.data
          if (song.albummid && song.songid) {
            ret.push(createSong(song))
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
