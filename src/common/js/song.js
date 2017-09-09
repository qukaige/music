import {getLyric} from 'api/song'
import {Base64} from 'js-base64'
import {ERR_OK} from 'api/config'
export default class Song { // 封装歌曲类
  constructor({id, mid, singer, name, album, drution, image, url}) {
    this.id = id // 歌曲播放id
    this.mid = mid // 算是图片id
    this.singer = singer //歌手
    this.name = name // 歌曲名
    this.album = album //专辑名
    this.drution = drution // 时间
    this.image = image // 图片url
    this.url = url // 歌曲播放url
  }

  getLyric() {
    if(this.lyric){
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve,reject)=>{
      getLyric(this.mid).then((response) => {
        if (response.retcode === ERR_OK) {
          this.lyric = Base64.decode(response.lyric)
          resolve(this.lyric)
        }else{
          reject('no lyric')
        }
      })
    })

  }
}
// 实例一个song
export function createSong(musicDate) {
  return new Song({
    id: musicDate.songid,
    mid: musicDate.songmid, // 图片有点曲折
    singer: filterSinger(musicDate.singer),
    name: musicDate.songname,
    album: musicDate.albumname,
    drution: musicDate.interval,
    // image:`//y.gtimg.cn/music/photo_new/T001R300x300M000${musicDate.singer[0].mid}.jpg?max_age=2592000`,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicDate.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicDate.songid}.m4a?fromtag=46`
  })
}
export function filterSinger(singer) { // 歌手名 做一个连接
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
