import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const originalPush = Router.prototype.push;

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

var router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/home",
      redirect: "/content",
      component: () => import("../components/home/Home.vue"),
      meta: {
        title: "首页"
      },
      children: [
        {
          path: "/content",
          component: () => import("../components/home/Content.vue"),
          meta: {
            title: "首页"
            // requiresAuth: true
          }
        },
        {
          path: "/messageManagement",
          redirect: "/right",
          component: () => import("../components/messageManagement/Home.vue"),
          meta: {
            title: "信息管理首页",
            requiresAuth: true
          },
          children: [
            {
              path: "/right",
              component: () =>
                import("../components/messageManagement/Right.vue"),
              meta: {
                title: "信息管理首页"
              }
            },

            {
              path: "/Elebill_search",
              component: () =>
                import("../components/messageManagement/eBill/Elebill.vue"),
              meta: {
                title: "电子联单查询"
              }
            },
            {
              path: "/s_source",
              component: () =>
                import(
                  "../components/messageManagement/statistics/Source/source.vue"
                ),
              meta: {
                title: "产生源统计"
              }
            },
            {
              path: "/s_consumerfield",
              component: () =>
                import(
                  "../components/messageManagement/statistics/ConsumerField/consumerField.vue"
                ),
              meta: {
                title: "消纳场统计"
              }
            },
            {
              path: "/s_transportvehicle",
              component: () =>
                import(
                  "../components/messageManagement/statistics/TransportVehicle/transportvehicle.vue"
                ),
              meta: {
                title: "运输车辆统计"
              }
            },
            {
              path: "/s_electronicbill",
              component: () =>
                import(
                  "../components/messageManagement/statistics/ElectronicBill/electronicBill.vue"
                ),
              meta: {
                title: "电子联单统计"
              }
            },
            {
              path: "/s_resourcefarm",
              component: () =>
                import(
                  "../components/messageManagement/statistics/Resource/resourceFarm.vue"
                ),
              meta: {
                title: "资源场统计"
              }
            },
            // 济宁信息录入系统新添加路由
            {
              path: "/approval_form",
              component: () =>
                import(
                  "../components/messageManagement/dataInput/ApprovalForm.vue"
                ),
              meta: {
                title: "运输核准单信息录入"
              }
            },
            {
              path: "/source_info",
              component: () =>
                import(
                  "../components/messageManagement/dataInput/SourceInfo.vue"
                ),
              meta: {
                title: "工地信息录入"
              }
            },
            {
              path: "/intake_info",
              component: () =>
                import(
                  "../components/messageManagement/dataInput/IntakeInfo.vue"
                ),
              meta: {
                title: "消纳场信息录入"
              }
            },
            {
              path: "/car_info",
              component: () =>
                import("../components/messageManagement/dataInput/CarInfo.vue"),
              meta: {
                title: "车辆信息录入"
              }
            },
            {
              path: "/road_info",
              component: () =>
                import(
                  "../components/messageManagement/dataInput/RoadInfo.vue"
                ),
              meta: {
                title: "电子路线录入"
              }
            }
          ]
        },
        {
          path: "/sourceMonitor",
          component: () =>
            import("../components/sourcePlant/sourceMonitor.vue"),
          meta: {
            title: "产生源监测",
            requiresAuth: true
          }
        },
        {
          path: "/vehicleMonitor",
          redirect: "/monitorVehicle",
          component: () => import("../components/vehicleMonitor/Home.vue"),
          meta: {
            title: "车辆监控",
            requiresAuth: true
          },
          children: [
            {
              path: "/monitorVehicle",
              component: () =>
                import("../components/vehicleMonitor/MonitorVehicle.vue"),
              meta: {
                title: "车辆监控"
              }
            },
            {
              path: "/historicalTrack",
              component: () =>
                import("../components/vehicleMonitor/HistoricalTrack.vue"),
              meta: {
                title: "历史轨迹"
              }
            },
            {
              path: "/efSelect",
              component: () => import("../components/vehicleMonitor/ef.vue"),
              meta: {
                title: "电子围栏"
              }
            },
            {
              path: "/carAlarm",
              component: () => import("../components/vehicleMonitor/CarAlarm.vue"),
              meta: {
                title: "未处理"
              }
            },
            {
              path: "/handledCarAlarm",
              component: () => import("../components/vehicleMonitor/HandledCarAlarm.vue"),
              meta: {
                title: "已处理"
              }
            },
          ]
        },
        {
          path: "/intakeMonitor",
          component: () =>
            import("../components/IntakePlant/intakeMonitor.vue"),
          meta: {
            title: "消纳场管理",
            requiresAuth: true
          }
        },
        {
          path: "/resourceMonitor",
          component: () =>
            import("../components/resourcePlant/resourceMonitor.vue"),
          meta: {
            title: "资源场监测",
            requiresAuth: true
          }
        },
        {
          path: "/electronicBill",
          redirect: "/selectElBill",
          component: () => import("../components/electronicBill/Home.vue"),
          meta: {
            title: "电子联单",
            requiresAuth: true
          },
          children: [
            {
              path: "/selectElBill",
              component: () =>
                import("../components/electronicBill/Elebill.vue"),
              meta: {
                title: "联单查询"
              }
            }
          ]
        },
        {
          path: "/systemManagement",
          redirect: "/organizationManagement",
          component: () => import("../components/systemManagement/Home.vue"),
          meta: {
            title: "组织管理",
            requiresAuth: true
          },
          children: [
            {
              path: "/userManagement",
              component: () =>
                import("../components/systemManagement/userManagement.vue"),
              meta: {
                title: "用户管理"
              }
            },
            {
              path: "/roleManagement",
              component: () =>
                import("../components/systemManagement/roleManagement.vue"),
              meta: {
                title: "角色管理"
              }
            },
            {
              path: "/permissionManagement",
              component: () =>
                import(
                  "../components/systemManagement/permissionManagement.vue"
                ),
              meta: {
                title: "权限管理"
              }
            },
            {
              path: "/organizationManagement",
              component: () =>
                import("../components/systemManagement/Organization.vue"),
              meta: {
                title: "组织管理"
              }
            }
          ]
        }
      ]
    },
    {
      path: "/login",
      component: () => import("../components/home/Login.vue"),
      meta: {
        title: "登录"
      }
    }
  ]
});

// //挂载路由导航守卫-只能从登录界面进入系统
// router.beforeEach((to, from, next) => {
//   //to 将要访问的路径
//   // from 代表从哪个路径跳转而来
//   // next 是个函数 表示放行 next()--放行 next('/login)--强制跳转
//   if (to.path === "/login") return next();
//   //获取token
//   const tokenStr = window.sessionStorage.getItem("token");
//   if (!tokenStr) return next("/login");
//   next();
// });
// 把路由对象暴露出去
router.beforeEach((to, from, next) => {
  // next()
  if (to.path.startsWith("/Login")) {
    window.localStorage.removeItem("USER_STORAGE");
    next();
  } else {
    let user = window.localStorage.getItem("USER_STORAGE");
    if (!user) {
      next({ path: "/Login" });
    } else {
      next();
    }
  }
});
export default router;
