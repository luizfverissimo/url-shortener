<template>
  <div id="app">
    <Encurtador/>
  </div>
</template>

<script>
import Encurtador from './components/Encurtador.vue'

export default {
  name: 'App',
  components: {
    Encurtador
  }
}
</script>

<style>
* {
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
}
#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: rgb(247, 244, 244);
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
}
</style>
