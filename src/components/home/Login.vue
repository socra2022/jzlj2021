<template>
  <div id="login">
    <!-- 标题 -->
    <div class="title">建筑垃圾全过程实时监测与智能管控云平台</div>
    <!-- 英文标题 -->
    <div class="englishTitle">
      Real-time Monitoring and Intelligent Management Cloud Platform for
      Construction Waste
    </div>
    <!-- 登录框 -->
    <form id="myform">
      <div class="login-div" ref="loginForm">
        <!-- 用户名 -->
        <div class="input-wh input-div mt-1">
          <img src="../../../static/img/icon03.png" alt="登录用户名" />
          <input
            type="text"
            class="input-style"
            placeholder="请输入用户名"
            v-model="loginForm.username"
            name="username"
          />
        </div>

        <!-- 密码 -->
        <div class="input-wh input-div mt-2">
          <img src="../../../static/img/icon01.png" alt="登录密码" />
          <input
            type="password"
            class="input-style mt"
            placeholder="请输入密码"
            v-model="loginForm.password"
            name="password"
          />
        </div>
        <!-- 验证码 -->
        <div class="input-wh input-div mt-3" style="width: 18.646vw">
          <img src="../../../static/img/icon02.png" alt="验证码" />
          <input
            style="width: 6vw"
            type="test"
            class="input-style mt"
            placeholder="验证码"
            v-model="loginForm.captcha"
            name="captcha"
          />
          <img
            id="imgWH"
            :src="this.imgPath"
            title="点击刷新"
            alt="点击刷新"
            @click="changeCaptcha"
          />
        </div>
        <div class="w-passwordword">
          <img
            id="isChange"
            @click="changeRember"
            src="../../../static/img/icon04.png"
            alt="记住密码"
          />
          <span>记住密码</span>
        </div>
        <button class="btu" type="submit">登录</button>
      </div>
    </form>
  </div>
</template>

<script>
import "../../../static/nice_validator/jquery.validator";
import "../../../static/nice_validator/local/zh-CN";
import "../../../static/nice_validator/jquery.validator.css";
import { login, getcaptcha, imgBasePath } from "../../assets/axios/index";
import userinfo from "../../assets/js/userState.js";

// 引入jQuery
import $ from "jquery";
export default {
  data() {
    return {
      loginForm: {
        captcha: "",
        username: "",
        password: ""
      },
      isChangeRember: true,
      //   初始验证码地址
      imgPath: imgBasePath
    };
  },
  methods: {
    init() {
      if (
        window.localStorage.getItem(userinfo.userIdKey) != null &&
        window.localStorage.getItem(userinfo.userIdKey) != ""
      ) {
        this.loginForm.username = window.localStorage.getItem(
          userinfo.userIdKey
        );
        this.loginForm.password = window.localStorage.getItem(
          userinfo.userPwKey
        );
      }
    },

    loginBtn() {
      let that = this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // that.loading=true
          var loginParams = {
            username: that.loginForm.username,
            password: that.loginForm.password,
            rememberMe: that.loginForm.checked
          };
          console.log(loginParams);
          API.login(loginParams)
            .then(function(result) {
              if (result && result.code === 200) {
                localStorage.setItem(userinfo.idKey, result.respBody.id);
                localStorage.setItem(
                  userinfo.userNameKey,
                  result.respBody.username
                );
                localStorage.setItem(
                  userinfo.userStorage,
                  JSON.stringify(result.respBody.pageSources)
                );
                localStorage.setItem(
                  userinfo.userRememberKey,
                  that.checked ? 1 : 0
                );
                if (that.checked) {
                  localStorage.setItem(
                    userinfo.userIdKey,
                    that.loginForm.username
                  );
                  localStorage.setItem(
                    userinfo.userPwKey,
                    that.loginForm.password
                  );
                } else {
                  sessionStorage.setItem(
                    userinfo.userIdKey,
                    that.loginForm.username
                  );
                  localStorage.removeItem(userinfo.userIdKey);
                  localStorage.removeItem(userinfo.userPwKey);
                }
                that.$router.push("/mains");
              } else {
                that.$message.error({
                  showClose: true,
                  message: result.meta.msg || "登录失败",
                  duration: 2000
                });
              }
            })
            .catch(function(error) {
              that.loading = false;
              that.$message.error({
                showClose: true,
                message: "登录失败",
                duration: 2000
              });
            });
        }
      });
    },
    changeRember() {
      console.log("jjjjj");
      let obj1 = document.getElementById("isChange");
      if (this.isChangeRember) {
        obj1.src = "../../../static/img/icon05.png";
        this.isChangeRember = false;
        console.log(this.isChangeRember);
      } else {
        obj1.src = "../../../static/img/icon04.png";
        this.isChangeRember = true;
        console.log(this.isChangeRember);
      }
    },
    // 实现验证码的点击切换  地址后面加上一个随机数即可实现刷新
    changeCaptcha() {
      this.imgPath = this.imgPath + "?" + Math.random();
    }
  },
  mounted: function() {
    //登录方法
    this.init();
    //验证表单
    $("#myform").validator({
      timely: 2, //实时验证
      stopOnError: true, //在第一次错误时停止验证
      // 提示信息样式
      theme: "red_top_effect",

      // 验证内容
      fields: {
        username: {
          // 验证规则
          rule: "required",
          // 验证不通过的提示信息
          msg: {
            required: "用户名不能为空！"
          }
        },
        password: {
          rule: "required,length(6~16)",
          msg: {
            required: "密码不能为空！",
            length: "密码长度为6~16个字符！"
          }
        },
        captcha: {
          rule: "required,length(4)",
          msg: {
            required: "验证码不能为空！"
            // length: "密码长度为6~16个字符！"
          }
        }
      },

      // 成功之后的回调函数----这里必须使用箭头函数
      valid: () => {
        let that = this;
        login(
          this.loginForm.captcha,
          this.loginForm.username,
          this.loginForm.password,
          false
        ).then(res => {
          // 原来的登录逻辑
          console.log(res.data);

          let data = res.data;
          this.$store.commit("set_token", data);
          // 角色
          let usern = res.data.respBody.roleName;
          this.$store.commit("set_user", usern);
          //用户名
          let namen = res.data.respBody.username;
          this.$store.commit("set_name", namen);
          // if (this.$store.state.token) {
          if (this.$store.state.namen) {
            let result = JSON.parse(JSON.stringify(res.data));
            localStorage.setItem(userinfo.idKey, result.respBody.id);
            localStorage.setItem(
              userinfo.userNameKey,
              result.respBody.roleName
            );
            localStorage.setItem(
              userinfo.userStorage,
              JSON.stringify(result.respBody.pageSources)
            );
            localStorage.setItem(
              userinfo.userRememberKey,
              that.isChangeRember ? 1 : 0
            );
            if (that.isChangeRember) {
              localStorage.setItem(userinfo.userIdKey, that.loginForm.username);
              localStorage.setItem(userinfo.userPwKey, that.loginForm.password);
            } else {
              sessionStorage.setItem(
                userinfo.userIdKey,
                that.loginForm.username
              );
              localStorage.removeItem(userinfo.userIdKey);
              localStorage.removeItem(userinfo.userPwKey);
            }

            that.$router.push("/home");
          } else if (res.data.respBody == "登陆失败，验证码错误") {
            this.$router.replace("/");
            alert("验证码错误，请重新填写!");
          } else {
            this.$router.replace("/");
            alert("用户名或密码错误，请重新填写!");
          }
        });
      }
    });
  }
};
</script>

<style lang="scss" scoped>
#login {
  background: url("../../../static/img/bg1.png") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: 100vw 100vh;
  position: fixed;
  .title {
    color: #ffffff;
    font-size: 4.444vh;
    text-align: center;
    margin-top: 13.796vh;
  }
  .englishTitle {
    text-align: center;
    color: #ffffff;
    font-size: 1.667vh;
    margin-top: 3.333vh;
  }
  .login-div {
    height: 44.815vh;
    width: 37.604vw;
    margin: 8.889vh 0 0 31.146vw;
    text-align: center;
    background: url("../../../static/img/loginbg.png") no-repeat;
    background-position: center;
    background-size: 37.604vw 44.815vh;
    .input-div {
      position: absolute;
      display: flex;
      justify-items: center;
      align-items: center;
    }
    .mt-1 {
      margin: 6.574vh 0 0 5.365vw;
    }
    .mt-2 {
      margin: 15.463vh 0 0 5.365vw;
    }
    .mt-3 {
      margin: 24.259vh 0 0 5.365vw;
    }
    .w-passwordword {
      position: absolute;
      display: flex;
      justify-items: center;
      align-items: center;
      color: #cccccc;
      font-size: 1vw;
      margin: 26.269vh 0 0 26vw;
      img {
        height: 2.593vh;
        width: 2.593vh;
      }
      span {
        margin-left: 0.5vw;
      }
    }
    .btu {
      width: 26.771vw;
      height: 6.574vh;
      margin-top: 33.148vh;
      border-radius: 0.463vh;
      border: none;
      background: #0384ea;
      font-size: 1vw;
      font-family: MicrosoftYaHei;
      color: #ffffff;
    }
  }
}
.input-wh {
  position: relative;
  border: #02ffff solid 1px;
  width: 26.771vw;
  height: 6.574vh;
  img {
    height: 3.241vh;
    width: 3.241vh;
    margin-left: 0.99vw;
  }
}
.input-style {
  margin-left: 0.5vw;
  width: 20vw;
  height: 6.574vh;
  border: none;
  outline: none;
  background-color: transparent;
  color: #cccccc;
  // color: #ffffff;
  font-size: 1vw;
  font-family: MicrosoftYaHei;
}
#imgWH {
  display: inline-block;
  margin-left: 2.917vw;
  width: 5.938vw;
  height: 4.444vh;
}
</style>

<style>
/* 解决浏览器记住密码input背景色问题 */
input:-webkit-autofill {
  -webkit-text-fill-color: #cccccc !important; /*浏览器记住密码的字的颜色*/
  transition: background-color 5000s ease-in-out 0s; /*通过延时渲染背景色变相去除背景颜色*/
  caret-color: #cccccc; /*光标颜色*/
}
input:focus {
  outline: none;
} /*外边框线去除*/
</style>
