<template>
  <div class="singer" ref="singer">
    <listview @select="selectSinger" :data="singers" ref="list"></listview>
    <!--承载子路由-->
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import Listview from 'base/listview/listview'
  import {mapMutations} from 'vuex'

  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  export default {
    mixins: [playlistMixin],
    data(){
      return {
        singers: []
      }
    },
    created(){
      this._getSingerList()
    },
    methods: {
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : '0'
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger(singer){ // 监听歌手条目点击事件(歌手对象)
        this.setSinger(singer) //把歌手对象传入store
        this.$router.push({  // 2级路由跳转..
          path:`/singer/${singer.id}`
        })
      },
      _getSingerList(){
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
//      数据处理
      _normalizeSinger(list){
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }

        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        // 对数据排序处理

        let hot = []
        let ret = []
        for (let key in map) {
          const val = map[key]
          if (val.title.match(/[a-zA-z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger:'SET_SINGER' //拓展方法...
      })
    },
    components: {
      Listview
    }
  }

</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
