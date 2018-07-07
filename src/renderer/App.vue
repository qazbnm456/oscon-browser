<template>
<div id="app">
  <div class="content-custom">
    <transition name="slide-right"
                mode="out-in">
      <router-view/>
    </transition>
  </div>
</div>
</template>

<script>
export default {
  name: 'oscon-browser'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  margin: 0;
  padding: 0;
  box-sizing: initial;
}

html, body {
  height: 100%;
}

body {
  background: radial-gradient(ellipse at center,#f5f5f5 0,hsla(0,0%,90%,.85) 100%);
  background-position: center;
  display: flex;
  font-family: 'Source Code Pro', Courier, monospace;;
  justify-content: center;
  text-align: center;
}

body.darwin .chrome-tabs {
  padding-left: 70px;
}

body.darwin #chrome-tabs-shell {
  height: 38px;
  padding-right: 26px;
  -webkit-app-region: drag;
      
}

body.darwin #chrome-tabs-shell .chrome-tab {
  top: 7px;
}
</style>
