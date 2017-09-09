import  {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid) { // 根据歌曲id获取歌词
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    g_tk: '334115943',
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    pcachetime: new Date(),
    hostUin: 0,
    songmid: mid
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
