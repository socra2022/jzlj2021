<template>
  <div>
    <!-- 面包屑 -->
    <div id="title">
      <div class="crumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <img src="../../../static/img/icon26.png" alt="箭头" />
    </div>

    <!-- 首页要显示的内容 -->
    <!-- 显示用户名和登录时间 -->
    <div class="management">
      <div class="management1">
        <img src="../../../static/img/icon06.png" class="img1" />
        <div>
          <span class="management2">{{ username }}</span
          ><br />
          <span class="management3">{{ role }}</span>
        </div>
      </div>
      <!-- 显示登录时间 -->
      <div class="management4">
        <span class="management5">本次登录时间 ：</span><br />
        <span class="management6">{{ now }}</span>
      </div>
    </div>

    <!-- 管理员部分 -->
    <!-- 显示运输车辆 -->
    <div
      class="vehicle"
      v-if="(this.rolen == 'admin') | (this.rolen == 'superadmin')"
    >
      <div class="txt">
        <span class="number">{{ adminTruckData }}</span
        ><br />
        <span class="name">运输车辆管理</span>
      </div>
      <img src="../../../static/img/icon07.png" class="img2" />
    </div>
    <!-- 显示运输企业 -->
    <div
      class="company"
      v-if="(this.rolen == 'admin') | (this.rolen == 'superadmin')"
    >
      <div class="txt">
        <span class="number">{{ adminCompanyData }}</span
        ><br />
        <span class="name">运输企业管理</span>
      </div>
      <img src="../../../static/img/icon08.png" class="img2" />
    </div>

    <!-- 显示产生源 -->
    <div
      class="source"
      v-if="(this.rolen == 'admin') | (this.rolen == 'superadmin')"
    >
      <div class="txt">
        <span class="number">{{ adminSourceData }}</span
        ><br />
        <span class="name">产生源管理</span>
      </div>
      <img src="../../../static/img/icon09.png" class="img2" />
    </div>
    <!-- 显示消纳场 -->
    <div
      class="accommodation"
      v-if="(this.rolen == 'admin') | (this.rolen == 'superadmin')"
    >
      <div class="txt">
        <span class="number">{{ adminIntakePlantData }}</span
        ><br />
        <span class="name">消纳场管理</span>
      </div>
      <img src="../../../static/img/icon10.png" class="img2" />
    </div>
    <!-- 显示资源场 -->
    <div
      class="resource"
      v-if="(this.rolen == 'admin') | (this.rolen == 'superadmin')"
    >
      <div class="txt">
        <span class="number">{{ adminResourceData }}</span
        ><br />
        <span class="name">资源场管理</span>
      </div>
      <img src="../../../static/img/icon11.png" class="img2" />
    </div>

    <!-- 运输企业 -->
    <div class="vehicle" v-if="this.rolen === 'transport'">
      <div class="txt">
        <span class="number">{{ truckData[0] }}</span
        ><br /><br />
        <span class="name">运输车辆管理</span>
        <span class="name">待审核</span>
      </div>
      <img src="../../../static/img/icon07.png" class="img2" />
    </div>
    <div class="company" v-if="this.rolen === 'transport'">
      <div class="txt">
        <span class="number">{{ companyData[0] }}</span
        ><br /><br />
        <span class="name">运输企业管理</span>
        <span class="name">待审核</span>
      </div>
      <img src="../../../static/img/icon08.png" class="img2" />
    </div>
    <div class="source" v-if="this.rolen === 'transport'">
      <div class="txt">
        <span class="number">{{ truckData[1] }}</span
        ><br /><br />
        <span class="name">运输车辆管理</span>
        <span class="name">已审核</span>
      </div>
      <img src="../../../static/img/icon07.png" class="img2" />
    </div>
    <div class="accommodation" v-if="this.rolen === 'transport'">
      <div class="txt">
        <span class="number">{{ companyData[1] }}</span
        ><br /><br />
        <span class="name">运输企业管理</span>
        <span class="name">已审核</span>
      </div>
      <img src="../../../static/img/icon08.png" class="img2" />
    </div>
  </div>
</template>

<script>
// 导入请求数据的方法
// 运输车辆
import {
  selectCarDataByInputName,
  selectNumOfAllCarData
} from "../../assets/axios/index";
// 运输企业
import {
  selectCompanyDataByInputName,
  selectAllCompanyData
} from "../../assets/axios/index";
// 产生源
import {
  selectSourceDataByInputName,
  selectAllSourceData
} from "../../assets/axios/index";
// 消纳场
import {
  selectIntakeDataByInputName,
  selectAllIntakeData
} from "../../assets/axios/index";
// 资源场
import {
  selectResourceDataByInputName,
  selectAllResourceData
} from "../../assets/axios/index";
// 导入js方法 时间
import getNowtime from "../../assets/js/index";
// 页面之间的通信
import bus from "../../assets/js/bus";
export default {
  data() {
    return {
      // 角色  对应rolename
      rolen: "",
      // 登录用户名
      username: "",

      //请求数据-管理员
      adminTruckData: 0,
      adminCompanyData: 0,
      adminSourceData: 0,
      adminIntakePlantData: 0,
      adminResourceData: 0,
      // 请求数据-普通用户
      truckData: [],
      companyData: [],
      sourceData: [],
      intakePlantData: [],
      resourceData: []
    };
  },
  computed: {
    role() {
      if (this.rolen === "superadmin") {
        return "超级管理员";
      }
      if (this.rolen === "admin") {
        return "管理员";
      }
      if (this.rolen === "customer") {
        return "测试用户";
      }
      if (this.rolen === "transport") {
        return "运输单位用户";
      }
      if (this.rolen === "source") {
        return "产生源用户";
      }
      if (this.rolen === "intake") {
        return "消纳场用户";
      }
      if (this.rolen === "resource") {
        return "资源场用户";
      }
    },
    now() {
      return getNowtime();
    }
  },
  mounted() {
    this.rolen = this.$user.getInfo().name;
    this.username = this.$user.getInfo().id;
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      // 请求数据方法--根据用户名来判断请求的数据量
      if (
        (window.sessionStorage.usern !== "admin") &
        (window.sessionStorage.usern !== "superadmin")
      ) {
        let name = {
          INPUT_NAME: this.username
        };
        if (window.sessionStorage.usern === "transport") {
          // 运输车辆数据
          await selectCarDataByInputName(this.username, false, 1, 10).then(
            res => {
              this.truckData = JSON.parse(JSON.stringify(res.data.respBody));
              // console.log(this.truckData);
              // num_0为待审核的数量，num_1_2为已审核的数量
              let num_0 = 0;
              let num_1_2 = 0;
              for (let i = 0; i < this.truckData.length; i++) {
                if (this.truckData[i].reviewStatus === 0) {
                  num_0 += 1;
                } else {
                  num_1_2 += 1;
                }
              }
              // 赋值
              this.truckData[0] = num_0;
              this.truckData[1] = num_1_2;
            }
          );
          // 请求运输企业数据
          await selectCompanyDataByInputName(this.username, false).then(res => {
            // console.log(res.data);
            this.companyData = JSON.parse(JSON.stringify(res.data.respBody));
            // console.log(this.companyData);
            // num_0为待审核的数量，num_1_2为已审核的数量
            let num_0 = 0;
            let num_1_2 = 0;
            for (let i = 0; i < this.companyData.length; i++) {
              if (this.companyData[i].reviewStatus === 0) {
                num_0 += 1;
              } else {
                num_1_2 += 1;
              }
            }
            // 赋值
            this.companyData[0] = num_0;
            this.companyData[1] = num_1_2;
          });
        }
        if (window.sessionStorage.usern === "source") {
          // 产生源数据
          await selectSourceDataByInputName(this.username).then(res => {
            this.sourceData = JSON.parse(JSON.stringify(res.data.respBody));
            // console.log(this.sourceData);
            // num_0为待审核的数量，num_1_2为已审核的数量
            let num_0 = 0;
            let num_1_2 = 0;
            for (let i = 0; i < this.sourceData.length; i++) {
              if (this.sourceData[i].reviewStatus === 0) {
                num_0 += 1;
              } else {
                num_1_2 += 1;
              }
            }
            // 赋值
            this.sourceData[0] = num_0;
            this.sourceData[1] = num_1_2;
          });
        }
        if (window.sessionStorage.usern === "intake") {
          // 消纳场数据
          await selectIntakeDataByInputName(this.username).then(res => {
            this.intakePlantData = JSON.parse(
              JSON.stringify(res.data.respBody)
            );
            // num_0为待审核的数量，num_1_2为已审核的数量
            let num_0 = 0;
            let num_1_2 = 0;
            for (let i = 0; i < this.intakePlantData.length; i++) {
              if (this.intakePlantData[i].reviewStatus === 0) {
                num_0 += 1;
              } else {
                num_1_2 += 1;
              }
            }
            // 赋值
            this.intakePlantData[0] = num_0;
            this.intakePlantData[1] = num_1_2;
          });
        }
        if (window.sessionStorage.usern === "resource") {
          // 资源场数据
          await selectResourceDataByInputName(this.username).then(res => {
            // console.log(res.data);
            this.resourceData = JSON.parse(JSON.stringify(res.data.respBody));
            // num_0为待审核的数量，num_1_2为已审核的数量
            let num_0 = 0;
            let num_1_2 = 0;
            for (let i = 0; i < this.resourceData.length; i++) {
              if (this.resourceData[i].reviewStatus === "0") {
                num_0 += 1;
              } else {
                num_1_2 += 1;
              }
            }
            // 赋值
            this.resourceData[0] = num_0;
            this.resourceData[1] = num_1_2;
          });
        }
      } else {
        //如果是管理员，则请求所有的数据
        // 运输车辆数据
        await selectNumOfAllCarData().then(res => {
          // console.log(res.data.respBody);
          this.adminTruckData = res.data.respBody;
        });
        //运输企业
        await selectAllCompanyData(false).then(res => {
          this.companyData = JSON.parse(JSON.stringify(res.data.respBody));
          let num_0 = 0;
          for (let i = 0; i < this.companyData.length; i++) {
            if (this.companyData[i].reviewStatus === 0) {
              num_0 += 1;
            }
          }
          this.adminCompanyData = num_0;
        });
        // 产生源数据
        await selectAllSourceData(false).then(res => {
          this.sourceData = JSON.parse(JSON.stringify(res.data.respBody));
          console.log(this.sourceData);
          let num_0 = 0;
          for (let i = 0; i < this.sourceData.length; i++) {
            if (this.sourceData[i].reviewStatus === 0) {
              num_0 += 1;
            }
          }
          this.adminSourceData = num_0;
        });
        // 消纳场数据
        await selectAllIntakeData(false).then(res => {
          // console.log(res.data.respBody);
          this.intakePlantData = JSON.parse(JSON.stringify(res.data.respBody));
          console.log("aaaa")
          console.log(this.intakePlantData);
          let num_0 = 0;
          for (let i = 0; i < this.intakePlantData.length; i++) {
            if (this.intakePlantData[i].reviewStatus === 0) {
              num_0 += 1;
            }
          }
          this.adminIntakePlantData = num_0;
        });
        // 资源场数据
        await selectAllResourceData(false).then(res => {
          this.resourceData = JSON.parse(JSON.stringify(res.data.respBody));
          // console.log(this.intakePlantData);
          let num_0 = 0;
          for (let i = 0; i < this.resourceData.length; i++) {
            if (this.resourceData[i].reviewStatus === 0) {
              num_0 += 1;
            }
          }
          this.adminResourceData = num_0;
        });
      }
    }
  },
  //   保证第一行激活样式保持！
  watch: {
    $route(to, from) {
      //监听路由变化-变化了给父组件传值
      // console.log("s");
      bus.$emit("isActive", true);
    }
  }
};
</script>

<style lang="scss" scoped>
#title {
  width: 33.542vw;
  height: 4.259vh;
  margin: 0.0926vh 0 0 0.052vw;
  background: url("../../../static/img/icon27.png") no-repeat;
  background-position: center;
  background-size: 33.542vw 4.259vh; //背景加上大小可以去除边框
  display: flex;
  align-items: center; //中间内容采用居中布局
  color: white;
  font-size: 1.574vh;

  .crumb {
    margin-left: 1.5625vw;
  }
  img {
    margin-left: 1vw;
  }
}
.management {
  height: 64.074vh;
  width: 17.604vw;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #067ea5;
  margin-top: 2.87vh;
  margin-left: 1.563vw;
  float: left;
  font-size: 2.037vh;
  .management1 {
    width: 14.6vw;
    height: 9.074vh;
    // background-color: #fff;
    margin: 5vh 0 0 2.031vw;
    display: flex;
    align-items: center;
    .img1 {
      width: 9.074vh;
      height: 9.074vh;
    }
  }
  .management2 {
    font-size: 2vh;
    // font-weight: bold;
    color: white;
    margin-left: 1.094vw;
  }
  .management3 {
    display: block;
    margin-top: 1.5vh;
    font-size: 2vh;
    // font-weight: bold;
    color: white;
    margin-left: 1.094vw;
  }
  .management4 {
    width: 10.98vw;
    height: 3.981vh;
    margin-left: 2.5vw;
    margin-top: 4.074vh;
  }
  .management5 {
    font-size: 1.667vh;
    // font-weight: bold;
    color: white;
  }
  .management6 {
    font-size: 1.667vh;
    // font-weight: bold;
    color: white;
  }
}
.span {
  color: white;
}
.vehicle {
  margin-top: 2.87vh;
  margin-left: 20.208vw;
  width: 23.177vw;
  height: 20.185vh;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #067ea5;
}
.company {
  margin-top: -20.5vh;
  margin-right: 15.156vw;
  width: 23.177vw;
  height: 20.185vh;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #067ea5;
  float: right;
}
.source {
  margin-top: 1.759vh;
  margin-left: 20.208vw;
  width: 23.177vw;
  height: 20.185vh;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #067ea5;
}

.accommodation {
  margin-top: -20.47vh;
  margin-right: 15.156vw;
  width: 23.177vw;
  height: 20.185vh;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #067ea5;
  float: right;
}
.resource {
  margin-top: 1.759vh;
  margin-left: 20.208vw;
  width: 23.177vw;
  height: 19.525vh;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #067ea5;
}

.txt {
  float: left;
  margin-top: 6.852vh;
  margin-left: 2.813vw;
}
.number {
  font-size: 4vh;
  color: white;
}
.name {
  font-size: 1.667vh;
  color: white;
}
// 除登录人员信息以外的图片
.img2 {
  width: 8.889vh;
  height: 8.889vh;
  margin-right: 2.292vw;
  margin-top: 5.648vh;
  float: right;
}
</style>

// 改element样式
<style>
/* 面包屑 */
.el-breadcrumb__inner,
el-breadcrumb__item {
  color: #ffffff !important;
  font-size: 1.574vh !important;
}
</style>
