<template>
  <div>
    <the-header></the-header>
    <the-aside></the-aside>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TheHeader from './TheHeader';
import TheAside from './TheAside';
import bus from '../assets/js/bus';
export default {
  components: {
    TheHeader,
    TheAside
  },
  data () {
    return {
      collapse: false
    }
  },
  created() {
    bus.$on('collapse', msg => {
      this.collapse = msg;
    })
  }
}
</script>

<style>
.content-box {
  position: absolute;
  left: 150px;
  right: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
  -webkit-transition: left .3s ease-in-out;
  transition: left .3s ease-in-out;
  background: #f0f0f0;
}

.content-collapse {
  left: 45px;
}
</style>