<template>
  <div class="sidebar">
    <!-- 管理员 -->
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
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
                >{{ subItem.title }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>

    <!-- 运输单位 -->
    <!-- <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      text-color="#ffffff"
      active-text-color="#3DCAF5"
      unique-opened
      router
      v-if="this.rolen === 'transport'"
    >
      <template v-for="item in items_1">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
                >{{ subItem.title }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu> -->

    <!-- 产生源 -->
    <!-- <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      text-color="#ffffff"
      active-text-color="#3DCAF5"
      unique-opened
      router
      v-if="this.rolen === 'source'"
    >
      <template v-for="item in items_2">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
                >{{ subItem.title }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu> -->

    <!-- 消纳场 -->
    <!-- <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      text-color="#ffffff"
      active-text-color="#3DCAF5"
      unique-opened
      router
      v-if="this.rolen === 'intake'"
    >
      <template v-for="item in items_3">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
                >{{ subItem.title }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu> -->

    <!-- 资源场 -->
    <!-- <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      text-color="#ffffff"
      active-text-color="#3DCAF5"
      unique-opened
      router
      v-if="this.rolen === 'resource'"
    >
      <template v-for="item in items_4">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
                >{{ subItem.title }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu> -->
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
        // {
        //   icon: "el-icon-document",
        //   index: "1", //侧栏导航条的编号
        //   title: "申报管理", //一级标题
        //   subs: [
        //     {
        //       index: "truck",
        //       title: "运输车辆管理" //二级标题
        //     },
        //     {
        //       index: "transport",
        //       title: "运输企业管理"
        //     },
        //     {
        //       index: "1-4",
        //       title: "工地管理",
        //       subs: [
        //         {
        //           index: "gs_source",
        //           title: "产生源管理" //三级标题
        //         },
        //         {
        //           index: "gs_intake_plant",
        //           title: "消纳场管理"
        //         },
        //         {
        //           index: "gs_resource",
        //           title: "资源场管理"
        //         }
        //       ]
        //     }
        //   ]
        // },
        {
          icon: "el-icon-s-data",
          index: "2",
          title: "信息统计",
          subs: [
            {
              index: "s_source",
              title: "产生源统计"
            },
            {
              index: "s_consumerfield",
              title: "消纳场统计"
            },
            {
              index: "s_transportvehicle",
              title: "运输车辆统计"
            },
            {
              index: "s_electronicbill",
              title: "电子联单统计"
            },
            {
              index: "s_resourcefarm",
              title: "资源场统计"
            }
          ]
        },
        {
          icon: "el-icon-date",
          index: "3",
          title: "电子联单",
          subs: [
            {
              index: "Elebill_search",
              title: "电子联单查询"
            }
          ]
        },
        // 济宁信息录入系统
        {
          icon: "el-icon-edit",
          index: "4",
          title: "信息录入",
          subs: [
            {
              index: "approval_form",
              title: "运输核准单"
            },
            {
              index: "source_info",
              title: "工地信息"
            },
            {
              index: "intake_info",
              title: "消纳场信息"
            },
            {
              index: "car_info",
              title: "车辆信息"
            },
            {
              index: "road_info",
              title: "电子路线"
            }
          ]
        }
      ],
      items: []
      // 运输单位
      // items_1: [
      //   {
      //     icon: "el-icon-document",
      //     index: "1", //侧栏导航条的编号
      //     title: "申报入口", //一级标题
      //     subs: [
      //       {
      //         index: "truck",
      //         title: "运输车辆申报" //二级标题
      //       },
      //       {
      //         index: "transport",
      //         title: "运输企业申报"
      //       }
      //     ]
      //   }
      // ],
      // 产生源
      // items_2: [
      //   {
      //     icon: "el-icon-document",
      //     index: "1", //侧栏导航条的编号
      //     title: "申报入口", //一级标题
      //     subs: [
      //       {
      //         index: "1-4",
      //         title: "工地申报",
      //         subs: [
      //           {
      //             index: "gs_source",
      //             title: "产生源申报" //三级标题
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ],
      // 消纳场
      // items_3: [
      //   {
      //     icon: "el-icon-document",
      //     index: "1", //侧栏导航条的编号
      //     title: "申报入口", //一级标题
      //     subs: [
      //       {
      //         index: "1-4",
      //         title: "工地申报",
      //         subs: [
      //           {
      //             index: "gs_intake_plant",
      //             title: "消纳场申报"
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ],
      // 资源场
      // items_4: [
      //   {
      //     icon: "el-icon-document",
      //     index: "1", //侧栏导航条的编号
      //     title: "申报入口", //一级标题
      //     subs: [
      //       {
      //         index: "1-4",
      //         title: "工地申报",
      //         subs: [
      //           {
      //             index: "gs_resource",
      //             title: "资源场申报"
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ]
    };
  },
  computed: {
    //   什么作用？？？
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  mounted() {
    this.items = JSON.parse(JSON.stringify(this.originItems));
    this.rolen = this.$user.getInfo().name;
    for (let i = 0; i < this.items.length; i++) {
      for (let j = 0; j < this.items[i].subs.length; j++) {
        if (!this.$user.hasPermission(this.items[i].subs[j].index)) {
          this.items[i].subs.splice(j, 1);
          console.log(this.items[i].subs.length);
          j--;
        }
      }
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  }
};
</script>

<style lang="scss" scoped>
i {
  /* 图标颜色 */
  color: #ffffff;
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
.el-menu-item is-active {
  background-color: transparent !important;
}
.el-submenu__title span :hover {
  color: #3dcaf5 !important;
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
  width: 13.021vw;
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
