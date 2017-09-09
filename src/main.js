import 'babel-polyfill' // 辅助使用es6api的
import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
Vue.config.productionTip = false
import  fastclick from 'fastclick'
fastclick.attach(document.body) // 移动端点击300毫秒延迟
Vue.use(VueLazyLoad,{ // 懒加载
  loading: require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
