<template>
  <div class="sidebar">
    <!-- 管理员 -->
    <!-- 
      default-active：当前激活菜单的 index
      collapse：是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
      unique-opened：是否只保持一个子菜单的展开
     -->
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      text-color="#ffffff"
      active-text-color="#3DCAF5"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template>
          <!-- index内存要跳转的路由 -->
          <el-menu-item :index="item.index" :key="item.index">
            <img class="icon-img" :src="item.icon" alt="图标" />
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../../assets/js/bus";
export default {
  data() {
    return {
      rolen: window.sessionStorage.usern,
      collapse: false,
      // 管理员
      originItems: [
        {
          icon: "../../../static/img/组织管理.png",
          index: "organizationManagement",
          title: "组织管理"
        },
        {
          icon: "../../../static/img/用户管理.png",
          index: "userManagement",
          title: "用户管理"
        },
        {
          icon: "../../../static/img/角色管理.png",
          index: "roleManagement",
          title: "角色管理"
        },
        {
          icon: "../../../static/img/权限管理.png",
          index: "permissionManagement",
          title: "权限管理"
        }
      ],
      items: []
    };
  },
  computed: {
    // 当前激活菜单的 index
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  mounted() {
    this.rolen = this.$user.getInfo().name;
    for (let i = 0; i < this.originItems.length; i++) {
      if (this.$user.hasPermission(this.originItems[i].index)) {
        this.items.push(this.originItems[i]);
      }
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    // 接收数据，第一个参数是数据的名字，与发送时的名字对应，第二个参数是一个方法，要对数据的操作
    bus.$on("collapse", msg => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  }
};
</script>

<style scoped>
.icon-img {
  width: 2vh;
  height: 2vh;
  margin-right: 0.5vw;
}
.el-menu {
  /* 去除背景颜色 */
  background-color: transparent !important;
  border: none;
}
/* 去除ul背景颜色 */
ul :hover {
  background: transparent !important;
}
ul :active {
  background: transparent !important;
}
/* 设置鼠标悬停时的字体颜色 */
li :hover {
  color: #3dcaf5 !important;
}
li :active {
  background-color: transparent !important;
  /* color: #3DCAF5 !important; */
}
.el-menu-item {
  font-size: 1.667vh;
  text-align: center;
}
.el-menu-item is-active {
  background-color: transparent !important;
}

.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 7.5vh;
  bottom: 0;
  overflow-y: scroll;
  color: #ffffff !important;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
/* 宽度 */
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 12vw;
}
.sidebar > ul {
  color: #ffffff;
  height: 100%;
}
</style>

<style>
.el-menu {
  /* 去除背景颜色 */
  background-color: transparent !important;
  border: none;
}
.el-menu-item.is-active {
  /* 去除点击后的高亮颜色 */
  background-color: transparent !important;
}
</style>
