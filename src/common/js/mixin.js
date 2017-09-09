import {mapGetters} from 'vuex'
// 当组件引用这个mixin   会和组件 merge,如果组件和mixin方法同名,那么会覆盖mixin中的方法
// 一个组件可以有多个mixin
export const  playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  // keep-alive组件激活时调用。
  activated(){
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal){
      this.handlePlaylist(newVal)
    }
  },
  methods: { // 子组件必须重写这个方法
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
