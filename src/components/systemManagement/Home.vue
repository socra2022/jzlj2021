<template>
  <!-- 系统管理首页 -->
  <div id="system">
    <!-- 侧栏 -->
    <div id="sidebar">
      <div class="title">系统管理</div>
      <div class="sidebar-nav">
        <v-sidebar></v-sidebar>
      </div>
    </div>
    <!-- 内容 -->
    <div id="right" :class="{ 'content-collapse': collapse }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import bus from "../../assets/js/bus";
import vSidebar from "./Sidebar.vue";
export default {
  data() {
    return {
      tagsList: [],
      collapse: false,
    };
  },
  // 引入Sidebar组件
  components: {
    vSidebar,
  },
  created() {
    // 接收数据，第一个参数是数据的名字，与发送时的名字对应，第二个参数是一个方法，要对数据的操作
    bus.$on("collapse-content", (msg) => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", (msg) => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
  watch: {
    $route(to, from) {
      //监听路由变化-变化了给父组件传值
      // console.log("s");
      bus.$emit("isSystemActive", true);
    },
  },
};
</script>

<style lang="scss" scoped>
#system {
  // 自适应box-flex
  display: flex;
  justify-content: left;
  position: absolute;
  #sidebar {
    position: relative;
    height: 85vh;
    width: 13.021vw;
    margin: 2.315vh 0 0 1.5625vw;
    background: url("../../../static/img/icon32-1.png") no-repeat;
    background-position: center;
    background-size: 13.021vw 85vh;
    .title {
      height: 4.259vh;
      width: 12.917vw;
      margin: 0.0926vh auto;
      background: url("../../../static/img/icon22.png") no-repeat;
      background-position: center;
      background-size: 12.865vw 4.259vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      font-size: 1.574vh;
      font-weight: bold;
    }
    .sidebar-nav {
      height: 80.648vh;
      width: 12.917vw;
      // background-color: #fff;
    }
  }
  #right {
    position: relative;
    height: 85vh;
    width: 82.76vw;
    margin: 2.315vh 0 0 1vw;
    background: url("../../../static/img/icon31-1.png") no-repeat;
    background-position: center;
    background-size: 82.76vw 85vh;
  }
}
</style>
