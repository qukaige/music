<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header.vue'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'

  export default {
    components: {
      "m-header": MHeader,
      Tab,
      Player
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">
</style>
