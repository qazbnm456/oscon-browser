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

<style lang="sass">
</style>
