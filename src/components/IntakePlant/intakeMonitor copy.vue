<template>
  <div id="intakeMonitor">
    <div id="leftContent" v-show="isShow">
      <div class="title">
        <span>消纳场基本信息</span>
        <img src="../../../static/img/icon26.png" alt="箭头" />
        <img
          id="img2"
          src="../../../static/img/取消.png"
          alt="取消"
          @click="isShow = false"
          title="退出"
        />
      </div>
      <table class="table">
        <caption>
          基本信息
        </caption>
        <tr>
          <th>消纳场名称</th>
          <td>{{ tableData.name }}</td>
        </tr>
        <tr>
          <th>消纳场序号</th>
          <td>{{ tableData.id }}</td>
        </tr>
        <tr>
          <th>消纳场地址</th>
          <td>{{ tableData.addr }}</td>
        </tr>
      </table>
      <table class="table">
        <caption>
          安全类信息
        </caption>
        <tr>
          <th>建筑垃圾序号</th>
          <td>{{ tableData.conswasteid }}</td>
        </tr>
        <tr>
          <th>建筑垃圾类型</th>
          <td>{{ tableData.type }}</td>
        </tr>
        <tr>
          <th>建筑垃圾面积</th>
          <td>{{ tableData.area }}</td>
        </tr>
        <tr>
          <th>建筑垃圾体量</th>
          <td>{{ tableData.volume }}</td>
        </tr>
        <tr>
          <th>现场图像数据</th>
          <td>{{ tableData.vedio }}</td>
        </tr>
        <tr>
          <th>遥感影像</th>
          <td>点此观看</td>
        </tr>
      </table>
      <table class="table">
        <caption>
          环境类信息
        </caption>
        <tr>
          <th>环境参数序号</th>
          <td>{{ tableData.environparaid }}</td>
        </tr>
        <tr>
          <th>安全风险评价因子</th>
          <td>{{ tableData.safepara }}</td>
        </tr>
        <tr>
          <th>水环境因子</th>
          <td>{{ tableData.waterpara }}</td>
        </tr>
        <tr>
          <th>土壤环境因子</th>
          <td>{{ tableData.solfpara }}</td>
        </tr>
        <tr>
          <th>大气环境因子</th>
          <td>{{ tableData.atmpara }}</td>
        </tr>
        <tr>
          <th>预警阈值</th>
          <td>{{ tableData.warnpara }}</td>
        </tr>
      </table>
      <table class="table">
        <tr>
          <th>3D地图</th>
          <td>
            <button class="select-btu" v-show="changeMap" @click="toEarth">
              点击查看
            </button>
            <button
              class="add-btu"
              v-show="!changeMap"
              @click="changeMap = !changeMap"
            >
              退出查看
            </button>
          </td>
        </tr>
      </table>
    </div>
    <div id="allmap" v-show="changeMap"></div>
    <div id="cesiumContainer" v-show="!changeMap">
      <button class="map3d-clear" @click="changeMap = !changeMap">
        切换地图
      </button>
    </div>
  </div>
</template>

<script>
import { selectIntakeData } from "../../assets/axios/index";

import * as Cesium from "cesium/Cesium";
import "cesium/Widgets/widgets.css";
export default {
  data() {
    return {
      //记录是不是第一次点击
      isFirstClick: 0,
      //当前点
      currentPoint: new Object(),
      //是否打开侧栏
      isShow: false,
      // 表格数据
      tableData: {},
      //所有数据
      data_info: [],

      //地球视图
      viewer: new Object(),
      //切换地图
      changeMap: true,
    };
  },
  mounted() {
    this.ready();

    this.$nextTick(function () {
      // buildModuleUrl.setBaseUrl("../../../static/cesium/Build/Cesium");
      // // 创建viewer实例
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYjAxOWM5NC0wNzJlLTQzYzAtOWYwZi1jNDAxMjI2NDM5NDgiLCJpZCI6MTY1MzYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzA2OTgyNTJ9.ymaufGrpGhy-m5PRVh2Y4T5-OrPuh4Xaf8wta-J5BTs";
      // 矢量底图
      var tdtImagerLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=aacbbcb77eaa21d2af0e4c4b03a2de88",
        layer: "tdtImgAnnoLayer",
        style: "default",
        // format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false,
        // maximumLevel:18
      });
      // 影像底图
      var tdtImagerLayerProvider1 = new Cesium.WebMapTileServiceImageryProvider(
        {
          url:
            "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=aacbbcb77eaa21d2af0e4c4b03a2de88",
          layer: "tdtImgAnnoLayer",
          style: "default",
          // format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: true,
          // maximumLevel:18
        }
      );
      // 标注底图
      var tdtImagerLayerProvider2 = new Cesium.WebMapTileServiceImageryProvider(
        {
          url:
            "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=aacbbcb77eaa21d2af0e4c4b03a2de88",
          layer: "tdtImgAnnoLayer",
          style: "default",
          // format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: true,
          // maximumLevel:18
        }
      );

      //  默认显示区域--中国
      var china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70);
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china;
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        // 需要进行可视化的数据源的集合
        animation: false, // 是否显示动画控件
        shouldAnimate: true,
        homeButton: true, // 是否显示Home按钮
        fullscreenButton: false, // 是否显示全屏按钮
        baseLayerPicker: false, // 是否显示图层选择控件
        geocoder: true, // 是否显示地名查找控件
        timeline: false, // 是否显示时间线控件
        sceneModePicker: false, // 是否显示投影方式控件
        navigationHelpButton: false, // 是否显示帮助信息控件
        selectionIndicator: true,
        infoBox: true, // 是否显示点击要素之后显示的信息
        // requestRenderMode: true, // 启用请求渲染模式
        // scene3DOnly: false, // 每个几何实例将只能以3D渲染以节省GPU内存
        sceneMode: 3, // 初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
        // fullscreenElement: document.body // 全屏时渲染的HTML元素 暂时没发现用处
        // imageryProvider:tdtImagerLayerProvider1,
        // imageryProvider:tdtImagerLayerProvider2,
        terrainProvider: Cesium.createWorldTerrain(),
      });

      // 显示影像图层和注释图层
      this.viewer.imageryLayers.addImageryProvider(tdtImagerLayerProvider1);
      this.viewer.imageryLayers.addImageryProvider(tdtImagerLayerProvider2);

      // 去除版权信息
      this.viewer._cesiumWidget._creditContainer.style.display = "none";
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
    });
  },
  watch: {
    currentPoint: {
      //监听新旧值
      handler(newVal, oldVal) {
        if (this.isFirstClick > 1) {
          var myIcon = new BMap.Icon(
            "../../../static/img/point1.png",
            new BMap.Size(32, 32),
            {
              anchor: new BMap.Size(16, 32),
            }
          );
          oldVal.setIcon(myIcon);
        }
      },
    },
  },
  methods: {
    ready: function () {
      // 百度地图API功能
      var map = new BMap.Map("allmap"); // 创建Map实例
      map.centerAndZoom(new BMap.Point(114.035761, 22.56381), 10); // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [
            BMAP_NORMAL_MAP, //地图
            BMAP_SATELLITE_MAP, //卫星地图
            BMAP_HYBRID_MAP, //混合地图
          ],
        })
      );

      // // 设置地图风格
      // var mapStyle = {
      //   style: "midnight",
      // };
      // map.setMapStyle(mapStyle);
      // 左上角，添加比例尺
      var top_left_control = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
      });
      map.addControl(top_left_control);
      //左上角添加缩放平移控件
      var top_left_navigation = new BMap.NavigationControl();
      map.addControl(top_left_navigation);

      //添加城市列表的控件
      var size = new BMap.Size(10, 20);
      map.addControl(
        new BMap.CityListControl({
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
          offset: size,
        })
      );

      var myIcon = new BMap.Icon(
        "../../../static/img/point1.png",
        new BMap.Size(32, 32),
        {
          // 指定定位位置。
          // 当标注显示在地图上时，其所指向的地理位置距离图标左上
          // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
          // 图标中央下端的尖角位置。
          anchor: new BMap.Size(16, 32),
          // 设置图片偏移。
          // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
          // 需要指定大图的偏移位置，此做法与css sprites技术类似。
          // imageOffset: new BMap.Size(0, 0 - 32), // 设置图片偏移
        }
      );

      var myIcon2 = new BMap.Icon(
        "../../../static/img/point2.png",
        new BMap.Size(32, 32),
        {
          anchor: new BMap.Size(16, 32),
        }
      );

      // 向后端发送请求获取数据
      selectIntakeData()
        .then((response) => {
          this.data_info = response.data.data;
          console.log(this.data_info);
          var markers = [];
          for (var i = 0; i < this.data_info.length; i++) {
            //创建标注点
            var marker = new BMap.Marker(
              new BMap.Point(
                this.data_info[i]["longtitude"],
                this.data_info[i]["latitude"]
              ),
              { icon: myIcon }
            );
            markers.push(marker);
            map.addOverlay(marker); // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //设置点动画
          }

          //监听点击事件
          var _this = this;
          for (var i = 0; i < markers.length; i++) {
            (function () {
              var index = i;
              markers[i].addEventListener("click", function (e) {
                // 保存点击旧的点
                _this.currentPoint = markers[index];
                // console.log(_this.currentPoint);
                // 赋值给表格
                _this.tableData = _this.data_info[index];
                // console.log(_this.tableData);
                // 打开侧栏
                _this.isShow = true;
                //图标变色
                this.setIcon(myIcon2);
                //第一次点击
                _this.isFirstClick += 1;
              });
            })();
          }
        })
        .catch((error) => console.log(error));
      map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      map.enableInertialDragging(); //启用地图惯性拖拽
      map.enableContinuousZoom(); //开启连续缩放效果
    },

    //添加实体的方法
    addEnity(data) {
      //表示消纳场的实体
      var entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          data.longtitude,
          data.latitude,
          50
        ),
        id: data.id,
        name: data.name,
        description: data,
        billboard: {
          image: "../../../static/img/facility.gif",
          width: 50,
          height: 50,
        },
      });
      return entity;
    },

    //三维地图飞到目的地的方法
    flyToDestination() {
      let lon = this.tableData.longtitude;
      let lat = this.tableData.latitude;
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, 1500.0), // 设置位置
        orientation: {
          heading: Cesium.Math.toRadians(20.0), // 方向
          pitch: Cesium.Math.toRadians(-90.0), // 倾斜角度
          roll: 0,
        }, // duration:5, // 设置飞行持续时间，默认会根据距离来计算
        // complete: function () {
        //   // 到达位置后执行的回调函数
        //   console.log("回掉函数执行");
        //   this.showThisWindow = true;
        //   console.log(this.showThisWindow);
        // },
        cancle: function () {
          // 如果取消飞行则会调用此函数
        },
        pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
        maximumHeight: 5000, // 相机最大飞行高度
        flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度(这个，很好用)
      });
    },

    //切换至地图
    toEarth() {
      //切换至三维地图
      this.changeMap = !this.changeMap;
      // console.log(this.tableData);
      //添加实体
      this.addEnity(this.tableData);
      //飞向目的地
      this.flyToDestination();
    },
  },
};
</script>

<style lang="scss" scoped>
#intakeMonitor {
  width: 96.875vw;
  height: 87vh;
  // background-color: #fff;
  margin: 2.315vh 0 0 1.563vw;
  display: flex;
  #leftContent {
    width: 25vw;
    height: 87vh;
    margin-right: 1vw;
    border: 0.1vh solid #3dcaf5;
    background: url("../../../static/img/icon32-3.png") no-repeat;
    background-position: center;
    .title {
      height: 4.259vh;
      background: url("../../../static/img/icon27.png") no-repeat;
      background-position: center;
      background-size: 25vw 4.259vh;
      display: flex;
      align-items: center;
      color: #ffffff;
      span {
        margin: 0 1vw 0 1vw;
      }
      #img2 {
        height: 1.2vw;
        height: 1.2vw;
        margin-left: 7.8vw;
      }
    }
    .table {
      width: 95%;
      margin-left: 2.5%;
      margin-top: 2vh;
      border: 0.1vh solid #067ea5;
      color: #ffffff;
      font-family: MicrosoftYaHei;
      caption {
        margin-bottom: 1vh;
      }
      tr {
        border: 0.1vh solid #3dcaf5;
      }
      th {
        // font-weight: bold;
        text-align: center;
        display: table-cell;
        width: 30%;
        height: 4vh;
        text-align: center;
        vertical-align: middle;
      }
      td {
        border: 0.1vh solid #3dcaf5;
        width: 70%;
        text-align: center;
        vertical-align: middle;
      }
    }
    .select-btu {
      width: 4.896vw;
      height: 2.963vh;
      background: #0566b3;
      border-radius: 1.481vh;
      border: none;
      font-size: 1.296vh;
      font-family: Microsoft YaHei;
      // font-weight: bold;
      outline: none;
      color: #ffffff;
    }
    .select-btu:hover,
    .select-btu:active {
      //添加数据按钮鼠标移入和激活样式
      width: 4.896vw;
      height: 2.963vh;
      opacity: 0.5;
    }
    .add-btu {
      width: 4.896vw;
      height: 2.963vh;
      background: #24a04b;
      border-radius: 1.481vh;
      border: none;
      font-size: 1.296vh;
      font-family: Microsoft YaHei;
      // font-weight: bold;
      color: #ffffff;
      outline: none;
    }
    .add-btu:hover,
    .add-btu:active {
      //添加数据按钮鼠标移入和激活样式
      width: 4.896vw;
      height: 2.963vh;
      opacity: 0.5;
    }
  }
  #allmap {
    width: 96.875vw;
    height: 87vh;
    border: 0.1vh solid #3dcaf5;
  }
  #cesiumContainer {
    width: 96.875vw;
    height: 87vh;
    border: 0.1vh solid #3dcaf5;
    .map3d-clear {
      border-radius: 5px;
      height: 32px;
      width: 100px;
      position: absolute;
      right: 2vw;
      top: 16vh;
      background: #303336;
      border: 1px solid #303336;
      background-size: cover;
      z-index: 6;
      cursor: pointer;
      margin-bottom: 20px;
      text-align: center;
      font-size: 16px;
      color: white;
    }
    .map3d-clear:hover {
      color: #fff;
      fill: #fff;
      background: #48b;
      background-size: cover;
      border-color: #aef;
      box-shadow: 0 0 8px #fff;
    }
  }
}
</style>
