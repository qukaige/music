import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer){ // 歌手详情根据id查询歌曲
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state,flag){
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state,flag){
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state,list){
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state,list){
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state,mode){
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state,index){
    state.currentIndex = index
  },
  [types.SET_DISC](state,disc){ // 热门榜单,根据id查询热门数据
    state.disc = disc
  },
  [types.SET_TOP_LIST](state,list){
    state.topList = list
  },
  [types.SET_SEARCH_HISHORY](state,history){
    state.searchHistory = history
  }

}
export default  mutations
