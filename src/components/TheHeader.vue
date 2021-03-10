<template>
  <div class="header">
    <!-- 折叠图片 -->
    <div class="collapse-btn" @click="collapseChange">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">后台管理</div>
    <div class="header-right">
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{username}}
          <i class="el-icon-caret-bottom"></i>
        </span>
        
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import bus from '../assets/js/bus';
export default {
  data () {
    return {
      collapse: false
    }
  },
  methods: {
    collapseChange() {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    },
    handleCommand(command) {
      if(command == 'logout') {
        localStorage.removeItem('username');
        this.$router.push('/');
      }
    }
  },
  computed: {
    username() {
      return localStorage.getItem('username');
    }
  }
}
</script>

<style>
.header {
  position: relative;
  background-color: #253041;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  float: left;
  line-height: 70px;
}

.header-right {
  float: right;
  line-height: 70px;
  margin-right: 50px;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
</style>