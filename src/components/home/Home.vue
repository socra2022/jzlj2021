<template>
  <div id="home">
    <!-- header部分 -->
    <div id="header">
      <div class="left_nav">
        <ul>
          <li v-if="page_index" class="nav_li">
            <router-link to="/content" exact>首页</router-link>
          </li>
          <li v-if="page_messageManagement" class="nav_li" id="m_m">
            <router-link to="/right">信息管理</router-link>
          </li>
          <li v-if="page_source" class="nav_li">
            <router-link to="/sourceMonitor">产生源监测</router-link>
          </li>
          <li v-if="page_carMonitoring" class="nav_li">
            <router-link to="/monitorVehicle" id="v_m">车辆监控</router-link>
          </li>
          <li class="nav_li_img">
            <router-link to="/carAlarm" id="v_b"
              ><img src="../../../static/img/baojing.png" alt="" />
              <!-- <div class="alarm">15</div> -->
              <span class="alarm">{{ alarmNum }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="right_nav">
        <ul>
          <li v-if="page_intakePlant" class="nav_li">
            <router-link to="/intakeMonitor">消纳场管理</router-link>
          </li>
          <li v-if="page_resource" class="nav_li">
            <router-link to="/resourceMonitor">资源场监测</router-link>
          </li>
          <li v-if="page_elBill" class="nav_li">
            <router-link to="/selectElBill" id="e_b">电子联单</router-link>
          </li>
          <li v-if="page_systemManagement" class="nav_li" id="s_m">
            <router-link to="/organizationManagement">系统管理</router-link>
          </li>
        </ul>
      </div>
      <div class="user">
        <!-- 用户名下拉菜单 -->
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item command="resetpassword">退出登录</el-dropdown-item> -->
            <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
            <el-dropdown-item command="resetpassword"
              >修改密码</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <router-view></router-view>

    <!-- 修改密码 -->
    <el-dialog
      :visible.sync="resetpasswordDialog"
      append-to-body
      width="40%"
      title="请修改信息"
      label-width="4.1vw"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="5.2vw"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldpass">
          <el-input
            type="password"
            v-model="ruleForm.oldpass"
            autocomplete="off"
            placeholder="请输入原密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            placeholder="请输入新密码6-16字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            placeholder="请确认新密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="margin-left:8vw"
            @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../../assets/js/bus";
import { getAllUnHandle } from "../../assets/axios/index";
import { resetpassword } from "../../assets/axios/index";
export default {
  provide() {
    return {
      reload: this.reload
    };
  },

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        oldpass: ""
      },
      rules: {
        oldpass: [
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符"
          }
        ],
        pass: [
          { validator: validatePass, trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符"
          }
        ],
        checkPass: [
          { validator: validatePass2, trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符"
          }
        ]
      },
      // name: window.sessionStorage.usern,
      name: "",

      isRouterAlive: true,

      //信息首页是否激活
      isActive: false,
      //系统管理是否激活
      isSystomActive: false,
      //车辆监控是否激活
      isVehicleMonitorActive: false,
      //电子联单是否激活
      isElBillActive: false,
      currentPage: "",
      PageSize: "",
      // 车辆报警数量
      alarmNum: window.sessionStorage.alarmNum,
      // 新权限系统
      page_index: false,
      page_messageManagement: false,
      page_source: false,
      page_carMonitoring: false,
      page_intakePlant: false,
      page_resource: false,
      page_elBill: false,
      page_systemManagement: false,
      pageName: "/index",

      // 修改密码表单的对话框
      resetpasswordDialog: false,

      //   旧密码
      oldPwd: "",
      newPwd: "",
      // 表单绑定值
      updateForm: {
        passWord: ""
      },
      // 表单验证规则2
      updateFormRules: {
        address: [{ required: true, message: "不能为空!", trigger: "blur" }],
        mobile: [
          { required: true, message: "不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" }
        ],
        organizationName: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        parentAccount: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        socialCreditCode: [
          { required: true, message: "不能为空!", trigger: "blur" }
        ]
      }
    };
  },
  // created(){
  //   this.getData();
  // },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },

    unc(lengthNum) {
      //  this.reload();
      this.alarmNum = lengthNum;
      console.log(data);
      console.log(this.alarmNum);
    },
    // 请求数据方法
    // async getData(){
    //   // 根据用户名来判断请求的数据
    //   // if (
    //     console.log(2222);

    //   await  getAllUnHandle(this.currentPage,this.PageSize)
    //       .then(res => {
    //         //console.log(res.data.respBody.records)

    //         //console.log(this.allData.length)394
    //         this.alarmNum = res.data.respBody.total;
    //         console.log(res.data.respBody.total);
    //         //this.totalCount = res.data.respBody.total;

    //       });

    // },

    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        this.$store.commit("del_token");
        this.$user.exitLogin();
        this.$router.go("/Login");
      }
      if (command == "resetpassword") {
        this.resetpasswordDialog = true;
      }
    },
    updateData() {
      this.el - alert("提交成功");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          resetpassword(
            window.sessionStorage.namen,
            this.ruleForm.oldpass,
            this.ruleForm.pass
          ).then(res => {
            console.log(res);
            if (res.data.message == "密码修改失败") {
              this.$message({
                message: "修改密码失败",
                type: "warning",
                offset: 300,
                center: true,
                duration: 1000
              });
            } else if (res.data.message == "密码修改成功") {
              this.$message({
                message: "密码修改成功",
                type: "success",
                offset: 300,
                center: true,
                duration: 1000
              });
              this.$router.push("/Login");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 请求数据方法
    async getData() {
      // 根据用户名来判断请求的数据
      // if (

      await getAllUnHandle()
        .then(res => {
          console.log(res.data.respBody);

          //console.log(this.allData.length)394
          window.sessionStorage.alarmNum = res.data.respBody.total;
          //this.totalCount = res.data.respBody.total;
        })
        .then({});
    }
  },
  mounted() {
    this.name = this.$user.getInfo().id;

    this.page_index = this.$user.hasPermission("content");
    this.page_messageManagement = this.$user.hasPermission("right");
    this.page_source = this.$user.hasPermission("sourceMonitor");
    this.page_carMonitoring = this.$user.hasPermission("monitorVehicle");
    this.page_intakePlant = this.$user.hasPermission("intakeMonitor");
    this.page_resource = this.$user.hasPermission("resourceMonitor");
    this.page_elBill = this.$user.hasPermission("selectElBill");
    this.page_systemManagement = this.$user.hasPermission(
      "organizationManagement"
    );
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route(to, from) {
      //切换大背景图片
      let bg = document.getElementById("home");
      let img = new Image();
      if (to.path.indexOf("/content") != -1) {
        //  console.log("到首页了");
        // 修复切换背景图时出现的“白色闪屏”现象
        img.src = "../../../static/img/bg.png";
        // 确定图片加载完成后再进行背景图片切换
        img.onload = function() {
          bg.style.background = `url(${img.src}) repeat-y`;
        };
      } else {
        // console.log("到了其他页面");
        img.src = "../../../static/img/bg12.png";
        img.onload = function() {
          bg.style.background = `url(${img.src}) repeat`;
        };
      }
      //如果不是信息管理首页-去除样式
      if (to.path.indexOf("/right") == -1) {
        let bg = document.getElementById("m_m");
        bg.classList.remove("isActive");
        bg.setAttribute("class", "nav_li");
      }

      //如果不是系统管理首页-去除样式
      if (to.path.indexOf("/organizationManagement") == -1) {
        let bg = document.getElementById("s_m");
        bg.classList.remove("isActive");
        bg.setAttribute("class", "nav_li");
      }

      //如果不是车辆监控首页-去除样式
      if (to.path.indexOf("/monitorVehicle") == -1) {
        let bg = document.getElementById("v_m");
        bg.classList.remove("isActive");
        bg.setAttribute("class", "nav_li");
      }
      //如果不是报警首页-去除样式
      if (to.path.indexOf("/carAlarm") == -1) {
        let bg = document.getElementById("v_b");
        bg.classList.remove("isActive");
        bg.setAttribute("class", "nav_li");
      }
      //如果不是电子联单首页-去除样式
      if (to.path.indexOf("/selectElBill") == -1) {
        let bg = document.getElementById("e_b");
        bg.classList.remove("isActive");
        bg.setAttribute("class", "nav_li");
      }
    }
  },
  created() {
    //this.getData();
    console.log(1111);
    getAllUnHandle(this.currentPage, this.PageSize).then(res => {
      //console.log(res.data.respBody.records)

      //console.log(this.allData.length)394
      this.alarmNum = res.data.respBody.total;
      if (this.alarmNum == 0) {
        document.getElementById("v_b").style.display = "none";
      }
      console.log(res.data.respBody.total);
      //this.totalCount = res.data.respBody.total;
    });
    //  this.$nextTick(function() {

    //    getAllUnHandle(this.currentPage,this.PageSize)
    //       .then(res => {
    //         //console.log(res.data.respBody.records)

    //         //console.log(this.allData.length)394
    //         this.alarmNum = res.data.respBody.total;
    //         console.log(res.data.respBody.total);
    //         //this.totalCount = res.data.respBody.total;

    //       });

    // });

    //接收信息管理侧栏的点击时数据传送-保存首页的高亮样式
    bus.$on("isActive", msg => {
      this.isActive = msg;
      if (this.isActive) {
        let bg = document.getElementById("m_m");
        // 使用添加类名的方法
        bg.classList.add("class", "isActive");
      }
    });
    //接收系统管理侧栏的点击时数据传送-保存首页的高亮样式
    bus.$on("isSystemActive", msg => {
      this.isSystemActive = msg;
      if (this.isSystemActive) {
        let bg = document.getElementById("s_m");
        // 使用添加类名的方法
        bg.classList.add("class", "isActive");
      }
    });
    //接收车辆管理侧栏的点击时数据传送-保存首页的高亮样式
    bus.$on("isVehicleMonitorActive", msg => {
      this.isVehicleMonitorActive = msg;
      if (this.isVehicleMonitorActive) {
        let bg = document.getElementById("v_m");
        // 使用添加类名的方法
        bg.classList.add("class", "isActive");
      }
    });
    //接收电子联单侧栏的点击时数据传送-保存首页的高亮样式
    bus.$on("isElBillActive", msg => {
      this.isElBillActive = msg;
      if (this.isElBillActive) {
        let bg = document.getElementById("e_b");
        // 使用添加类名的方法
        bg.classList.add("class", "isActive");
      }
    });
  }
};
</script>

<style lang="scss" scoped>
#home {
  background: url("../../../static/img/bg.png") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
  #header {
    background: url("../../../static/img/dingbu.png") no-repeat;
    background-position: center;
    width: 100%;
    height: 7.407vh;
    background-size: 100vw 7.407vh;
    display: flex;
    font-size: 1.5vh;
    font-weight: bold;
    .left_nav {
      height: 3.704vh;
      width: 25vw;
      margin: 0.926vh 0 0 0.469vw;
      // background-color: red;
    }
    .right_nav {
      height: 3.704vh;
      width: 25vw;
      margin: 0.926vh 0 0 48vw;
      // background-color: red;
    }
    .user {
      height: 3.704vh;
      width: 30vw;
      margin: 0.926vh 0 0 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
    }
  }
}
.nav_li {
  list-style: none;
  display: flex;
  width: 6vw;
  height: 3.704vh;
  // margin-left: 0.5vw;
  // margin-right: 0.5vw;
  justify-content: center;
  align-items: center;
  // background-color: red;
  a {
    color: #ffffff;
    font-weight: bold;
  }
}
.nav_li :hover {
  background: url("../../../static/img/anniu.png") no-repeat;
  background-position: center;
  width: 6vw;
  height: 3.704vh;
  background-size: 5vw 3.6vh;
  list-style: none;
  display: flex;
  // margin-left: 0.5vw;
  // margin-right: 0.5vw;
  justify-content: center;
  align-items: center;
  // background-color: red;
  a {
    color: #ffffff;
    font-weight: bold;
  }
}
ul {
  padding: 0;
  margin: 0;
  display: flex;
}
// 警报标志
.nav_li_img {
  position: relative;
  list-style: none;
  display: flex;
  width: 4vw;
  height: 3.704vh;
  // margin-left: 0.5vw;
  // margin-right: 0.5vw;
  justify-content: center;
  align-items: center;
  // background-color: red;
  .alarm {
    position: absolute;
    color: white;
    font-size: 12px;
    background-color: red;
    /*height: 24px;改前*/
    min-height: 20px; /*改后新增的代码*/
    min-width: 20px; /*改后新增的代码*/
    line-height: 20px;
    right: -12%;
    top: -8px;
    text-align: center;
    -webkit-border-radius: 24px;
    border-radius: 20px;
    padding: 1px;
  }
  img {
    height: 4vh;
    width: 4vh;
  }
  a {
    color: #ffffff;
    font-weight: bold;
  }
}
//路由激活时更换样式
.router-link-active {
  background: url("../../../static/img/anniu.png") no-repeat !important;
  background-position: center !important;
  width: 6vw;
  height: 3.704vh;
  background-size: 5vw 3.6vh !important;
  list-style: none;
  display: flex;
  // margin-left: 0.5vw;
  // margin-right: 0.5vw;
  justify-content: center;
  align-items: center;
  // background-color: red;
  a {
    color: #ffffff;
    font-weight: bold;
  }
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
  font-size: 1.5vh;
  font-weight: bold;
}
.el-dropdown-menu {
  display: block;
}
.el-dropdown-menu__item {
  display: block;
  text-align: center;
}
.el-icon-arrow-down {
  font-size: 1.111vh;
}
.isActive {
  background: url("../../../static/img/anniu.png") no-repeat !important;
  background-position: center !important;
  width: 6vw;
  height: 3.704vh;
  background-size: 5vw 3.6vh !important;
  list-style: none;
  display: flex;
  // margin-left: 0.5vw;
  // margin-right: 0.5vw;
  justify-content: center;
  align-items: center;
  // background-color: red;
  a {
    color: #ffffff;
    font-weight: bold;
  }
}
</style>
