<template>
  <div class="all">
    <div id="map">
      <div id="mapview"></div>
      <div id="toggleA" @click="toggleA"></div>
      <div id="input">
        <div id="r-result">
          <el-input
            type="text"
            id="suggestId"
            placeholder="请输入内容"
            v-model="input"
            clearable
          >
            >
          </el-input>
        </div>
        <div
          id="searchResultPanel"
          style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"
        ></div>
      </div>
    </div>

    <!-- 右侧控制栏 -->
    <div id="controlBar">
      <p>路线信息</p>
      <div id="select">
        <el-select v-model="input" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div id="info">
        <P>请输入路线名</P>
        <el-input placeholder="请输入内容" v-model="roadName" clearable>
        </el-input>
      </div>
      <ul></ul>
      <el-button type="primary" plain class="button" @click="clickSetMark">
        {{ listen ? "开始绘制" : "停止绘制" }}
      </el-button>
      <el-button type="success" plain class="button2" @click="newRoute"
        >生成路线</el-button
      >
      <el-button type="primary" plain class="button3" @click="clear"
        >清空地图</el-button
      >
      <el-button type="danger" plain class="button4" @click="addData"
        >提交数据</el-button
      >
    </div>
  </div>
</template>

<script>
// import { insertRoadInfo, getRoadInfo } from "../../assets/axios/index";
import getNowtime from "../../../assets/js/index";
import CoordinateUtil from "../../../assets/js/bd092wgs84";
import wgs2bd from "../../../assets/js/wgs842bd09";

export default {
  data() {
    return {
      map: "",

      driving: "",
      //   存储点击的坐标
      input: "",
      //   返回的路线点
      path: [],
      //   绘制
      polyline: "",
      polyline1: "",
      //   存放从后端读取的wgs坐标
      pts: [],
      //   转换成bd09坐标
      pts1: [],
      //   路线长度
      length: 0,

      //   录入的路线名
      roadName: "",
      points: [],
      //   监听判断
      listen: true,
      //   监听函数内方法名
      drawpoint: "",
      //   路线开始点
      start: "",
      //   路线结束点
      end: "",
      //   途经点
      waypoints: [],
      //   上传的roadaddress数据
      eachart: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: []
        }
      },
      //   转换后的坐标

      options: [
        {
          value: "广安路",
          label: "广安路"
        },
        {
          value: "德源路",
          label: "德源路"
        },
        {
          value: "327国道",
          label: "327国道"
        },
        {
          value: "同济路",
          label: "同济路"
        },
        {
          value: "孟子大道",
          label: "孟子大道"
        }
      ],
      value: ""
    };
  },
  mounted() {
    // 获取信息进行渲染
    // getRoadInfo(81)
    //   .then(res => {
    //     this.$message({
    //       message: "获取数据成功",
    //       type: "success",
    //       offset: 300,
    //       center: true,
    //       duration: 1000
    //     });
    //     this.pts = JSON.parse(res.data.respBody).geometry.coordinates;
    //     console.log(this.pts);
    //     console.log(res.data.respBody);
    //     console.log(JSON.parse(res.data.respBody));
    //   })
    //   .then(res => {
    //     this.init();
    //   });
    this.init();
  },
  methods: {
    init() {
      this.map = new BMap.Map("mapview");
      //   , { minZoom: 1, maxZoom: 21 }
      this.map.centerAndZoom(new BMap.Point(116.587829, 35.42533), 11);
      this.map.enableScrollWheelZoom(true);
      console.log(this.pts);

    //   // 测试坐标转换********
    //   for (var i = 0; i < this.pts.length; i++) {
    //     let list = [];
    //     const res = wgs2bd.getbd09xy(this.pts[i][1], this.pts[i][0]);
    //     list.push(res.lng);
    //     list.push(res.lat);
    //     this.pts1.push(list);
    //   }
    //   console.log("打印bd09坐标");
    //   console.log(this.pts1);

    //   // 生成坐标点
    //   let trackPoint1 = [];
    //   for (var i = 0; i < this.pts1.length; i++) {
    //     trackPoint1.push(new BMap.Point(this.pts1[i][0], this.pts1[i][1]));
    //   }
    //   this.polyline1 = new BMap.Polyline(
    //     //   this.pts,
    //     trackPoint1,
    //     { strokeColor: "red", strokeWeight: 6, strokeOpacity: 0.5 }
    //   );
    //   this.map.addOverlay(this.polyline1);

     
      //************************* */

      //   设置地图样式
      //   this.map.setMapStyle({
      //     styleJson: [
      //       {
      //         featureType: "arterial",
      //         elementType: "labels.text.fill",
      //         stylers: {
      //           color: "#ff0000ff",
      //           visibility: "on"
      //         }
      //       },
      //       {
      //         featureType: "highway",
      //         elementType: "all",
      //         stylers: {
      //           visibility: "on"
      //         }
      //       },
      //       {
      //         featureType: "poilabel",
      //         elementType: "all",
      //         stylers: {
      //           visibility: "off"
      //         }
      //       },
      //       {
      //         featureType: "manmade",
      //         elementType: "all",
      //         stylers: {
      //           visibility: "off"
      //         }
      //       },
      //       {
      //         featureType: "building",
      //         elementType: "all",
      //         stylers: {
      //           visibility: "off"
      //         }
      //       }
      //     ]
      //   });

      //   var that = this;
      //   this.drawpoint = function(e) {
      //     console.log(e.point);
      //     that.points.push(e.point);
      //     console.log(that.points);
      //     for (var i = 0; i < that.points.length; i++) {
      //       var point = new BMap.Marker(that.points[i]);
      //       that.map.addOverlay(point);
      //     }
      //   };

      // 搜索方法
      function G(id) {
        return document.getElementById(id);
      }
      var ac = new BMap.Autocomplete({
        input: "suggestId",
        location: this.map
      }); //建立一个自动完成的对象

      ac.addEventListener("onhighlight", function(e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
        G("searchResultPanel").innerHTML = str;
      });

      var myValue;
      ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        G("searchResultPanel").innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          myValue;

        setPlace();
      });

      var that = this;
      function setPlace() {
        // that.map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          that.map.centerAndZoom(pp, 15);
          //   that.map.addOverlay(new BMap.Marker(pp)); //添加标注
        }
        var local = new BMap.LocalSearch(that.map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }

      //   console.log("打印测试");
      //   var res = CoordinateUtil.getWgs84xy(113.153461, 22.645211);
      //   console.log(res);
    },
    // 点击获取经纬度坐标  实现同一个按钮 开启关闭
    drawpoints(e) {
      console.log(e.point);
      this.points.push(e.point);
      console.log(this.points);
      for (var i = 0; i < this.points.length; i++) {
        var point = new BMap.Marker(this.points[i]);
        this.map.addOverlay(point);
      }
    },
    clickSetMark() {
      var that = this;
      if (this.listen == true) {
        console.log("执行的是1");
        this.map.setDefaultCursor("crosshair");
        this.map.addEventListener("click", this.drawpoints);
        this.$message({
          message: "开始选点",
          type: "success",
          offset: 300,
          center: true,
          duration: 1000
        });
      } else {
        console.log(this.listen);
        this.map.removeEventListener("click", this.drawpoints);
        this.map.setDefaultCursor("pointer");
        this.$message({
          message: "关闭选点",
          type: "success",
          offset: 300,
          center: true,
          duration: 1000
        });
      }
      this.listen = !this.listen;
    },

    // 生成路线
    newRoute() {
      if (this.points.length > 0) {
        // 从点击坐标中获取起终点以及途经点并进行驾车规划
        this.start = this.points[0];
        this.end = this.points[this.points.length - 1];
        // 左闭右开
        this.waypoints = this.points.slice(1, this.points.length - 1);
        this.driving = new BMap.DrivingRoute(this.map, {
          renderOptions: { map: this.map, autoViewport: true }
        });
        this.driving.search(this.start, this.end, {
          waypoints: this.waypoints
        });
        var that = this;
        //   搜索完成后的回调函数
        this.driving.setSearchCompleteCallback(function() {
          for (var i = 0; i < that.points.length - 1; i++) {
            var list = (list = that.driving
              .getResults()
              .getPlan(0)
              .getRoute(i)
              .getPath());
            for (var k = 0; k < list.length; k++) {
              that.path.push(list[k]);
            }
          }
          for (var i = 0; i < that.points.length - 1; i++) {
            var len = that.driving
              .getResults()
              .getPlan(0)
              .getRoute(i)
              .getDistance();
            that.length = that.length + len;
          }

          console.log("路线距离");
          console.log(that.length);
          console.log(that.path.length);
          console.log(that.path);
          //   拿到轨迹后进行坐标转换并存入路段里
          for (var i = 0; i < that.path.length; i++) {
            let list = [];
            const res = CoordinateUtil.getWgs84xy(
              that.path[i].lng,
              that.path[i].lat
            );
            list.push(res.lng);
            list.push(res.lat);
            that.eachart.geometry.coordinates.push(list);
          }
        });
        console.log("打印数据");
        console.log(that.eachart.geometry.coordinates);
        // 关闭地图点击
        this.map.removeEventListener("click", this.drawpoint);
        this.map.setDefaultCursor("pointer");
        this.listen = true;
      } else {
        this.$message({
          message: "无数据",
          type: "warning",
          offset: 300,
          center: true,
          duration: 1000
        });
      }
    },
    // 上传数据
    addData() {
      var json = JSON.stringify(this.eachart);
      let data = {
        content: "string",
        inputName: "string",
        inputTime: new Date(),
        roadAddress: json,
        roadId: 0,
        roadName: this.roadName
      };
      insertRoadInfo(data).then(() => {
        this.$message({
          message: "提交成功！",
          type: "success",
          offset: 300,
          center: true,
          duration: 1000
        });
      });
    },
    // 地图侧边栏缩放控制
    toggleA() {
      let domTemp1 = document.getElementById("map");
      let domTemp2 = document.getElementById("controlBar");
      let domTemp3 = document.getElementById("toggleA");
      if (this.toA) {
        domTemp3.style.backgroundImage = 'url("../../../../static/img/侧栏1.png")';
        domTemp2.style.width = "ovw";
        domTemp1.style.width = "82.76vw";
        this.toA = false;
      } else {
        domTemp3.style.backgroundImage = 'url("../../../../static/img/侧栏2.png")';
        domTemp2.style.width = "15vw";
        domTemp1.style.width = "66.021vw";
        this.toA = true;
      }
    },
    // 清除标记
    clear() {
      this.map.clearOverlays();
      (this.path = []),
        (this.points = []),
        (this.waypoints = []),
        (this.start = []),
        (this.end = []);
      this.eachart.geometry.coordinates = [];
      // 关闭地图点击
      this.map.removeEventListener("click", this.drawpoint);
      this.map.setDefaultCursor("pointer");
      this.listen = true;
    }

    // *******************************保存时的坐标转换（bd09-> gcj02 -> wgs84）*-************************
  }
};
</script>

<style lang="scss" scoped>
.all {
  height: 85vh;
  width: 82.76vw;
  overflow: hidden;
  #map {
    position: relative;
    height: 85vh;
    width: 66.021vw;
    float: left;
    border: 0.1vh solid #3dcaf5;
    transition: 0.5s;
    #mapview {
      height: 100%;
      width: 100%;
      cursor: pointer;
    }
    #toggleA {
      position: absolute;
      top: 40%;
      right: 0px;
      height: 13.889vh;
      width: 1.302vw;
      background: url("../../../../static/img/侧栏2.png");
      background-position: center;
      background-size: 1.302vw 13.889vh;
      z-index: 3;
      cursor: pointer;
    }
    #input {
      position: absolute;
      top: 5%;
      left: 50px;
      //   height: 13.889vh;
      //   width: 1.302vw;
      z-index: 3;
    }
  }
  #controlBar {
    position: relative;
    height: 85vh;
    width: 15vw;
    float: right;
    background-image: url("../../../../static/img/icon32-1.png");
    background-position: center;
    background-size: 15vw 85vh;
    transition: 0.5s;
    p {
      height: 4.5vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      margin: 4vh 0vw 0vh 0vw;
    }
    .subTitle {
      color: white;
      margin: 4vh 0vw 1vh 0vw;
      position: relative;
      left: -3vw;
    }
    [id^="select"] {
      text-align: center;
    }
    #select {
      margin-left: 15px;
      margin-top: 30px;
    }
    #info {
      color: white;
      width: 12vw;
      margin-top: 20px;
      margin-left: 15px;
    }
  }
}
.button {
  z-index: 999;
  position: absolute;
  bottom: 7rem;
  margin-left: 2rem;
  padding: 1rem 1rem;
  border-radius: 0.25rem;
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
}
.button2 {
  z-index: 999;
  position: absolute;
  bottom: 7rem;
  margin-left: 7.5rem;
  padding: 1rem 1rem;
  border-radius: 0.25rem;
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
}
.button3 {
  z-index: 999;
  position: absolute;
  bottom: 3.5rem;
  margin-left: 2rem;
  padding: 1rem 1rem;
  border-radius: 0.25rem;
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
}
.button4 {
  z-index: 999;
  position: absolute;
  bottom: 3.5rem;
  margin-left: 7.5rem;
  padding: 1rem 1rem;
  border-radius: 0.25rem;
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
}
canvas {
  width: auto !important;
  max-width: none !important;
}
</style>
