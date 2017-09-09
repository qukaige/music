//所有状态管理
import {playMode} from 'common/js/config'
const state = {
  singer: {},
  playing: false, // 播放
  fullScreen: false,// 展开收缩播放器,只有点击歌曲的时候才会触发调用这个变量
  playlist: [],// 播放列表
  sequenceList: [],// 和上面的list 对比, 模式不同列表数据顺序不同
  mode: playMode.sequence, // 默认顺序播放
  currentIndex: -1, //当前播放歌曲索引

  disc: {},
  topList: {},
  searchHistory: [] // 封装搜索历史
}
export default state
