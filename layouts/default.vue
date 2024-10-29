<template>
    <el-container id="app-container">
    <el-header height="50px">
        <app-header>
     <!--<app-header
        :transparent="isTransparentHeader"
        :username="username"
        is-logged-in
      />--> 
    </app-header>
    </el-header>
    <el-container class="layout-container">
      <el-container>
        <el-main>
          <nuxt />
        </el-main>
        <el-footer style="padding: 0;" height="30px">
          <app-footer />
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import AppFooter from "~/components/AppFooter";
import AppHeader from '~/components/AppHeader.vue';
export default {
    data(){
      return{
        activeIndex: '1',
      }
    },
    component:{
        AppFooter,
        AppHeader
    },
    methods:{
      handleSelect(key) {
        localStorage.setItem('activeIndex', key);
      },
    }
  }
</script>

<style lang="scss">
  .body{
    background: black;
    width: 100%;
    height: 100vh;
  }
    @import "~assets/styles/variables";
$heightHeader: 50px;

#app-container {
  flex: 1 1 auto;
  min-height: 100vh;

  .layout-container {
    margin-top: $heightHeader;
  }

  .el-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 0;
    color: $colorFontLight;
  }

  .el-footer {
    background-color: rgba(0, 0, 0, 0.04);
    color: $colorFontDark;
    text-align: center;
  }

  .el-aside {
    transition: width 0.3s, left 0.3s;
    position: fixed;
    top: $heightHeader;
    bottom: 0;
    left: 0;
    z-index: 600;
    background-color: rgba(0, 0, 0, 0.04);
    box-shadow: inset -1px 0 0 $colorBorder;
    color: $colorFontDark;
  }

  .el-main {
    background-color: $colorBackground;
    color: $colorFontDark;
    padding: 15px;
  }
}
</style>