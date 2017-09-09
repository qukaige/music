import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
function findIndex(randomList, song) {
  return randomList.findIndex((item) => {
    return item.id === song.id
  })
}
// 异步修改,对mutation一些封装(触发多个mutation)
// actions 中有commit方法,和state属性
export const selectPlay = function ({commit, state}, {list, index}) {
  // 顺序播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    // 开始顺序播放列表
    commit(types.SET_PLAYLIST, list)
  }
  // 播放索引
  commit(types.SET_CURRENT_INDEX, index)
  // 展开播放器
  commit(types.SET_FULL_SCREEN, true)
  // state.fullScreen = true  必须commit 提交 不然会包警告
  // 开始播放
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  let randomList = shuffle(list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
// 搜索结果中点击播放,插入一条歌曲到当前播放列表
export const insertSong = function ({commit, state}, song) {
  // .slice 创建一个副本 ,不然会报错// Do not mutate vuex store state outside mutation handlers.
  // 就是只能在commit中修改不能在非commit之外修改
  // 因为插入的歌曲要在 当前播放的歌曲的下一首
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查看要插入的歌曲是否在当前播放的列表中
  let fpIndex = findIndex(playlist, song)
  // 在当前歌曲的下一首插入
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  // 如果包含这首歌,删除这首歌
  if (fpIndex > -1) {
    // 删除有2种情况
    //1.如果歌曲的index < 插入的index
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST,playlist)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
