<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <ConvertPanel/>
  </div>
</template>

<script>
import ConvertPanel from './components/ConvertPanel'

export default {
  name: 'app',
  components: {
    ConvertPanel
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
