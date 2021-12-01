<template>
  <div id="intakeMonitor">
    <transition>
      <div id="rightContent" v-show="isShow">
        <div class="title">
          <span>消纳场基本信息</span>
          <img src="../../../static/img/icon26.png" alt="箭头" />
          <img
            id="img2"
            src="../../../static/img/取消.png"
            alt="取消"
            @click="cancel"
            title="退出"
          />
        </div>
        <table class="table">
          <caption>
            基本信息
          </caption>
          <tr>
            <th>消纳场名称</th>
            <td>{{ tableData.intakePlantName }}</td>
          </tr>
          <tr>
            <th>消纳场序号</th>
            <td>{{ tableData.intakePlantId }}</td>
          </tr>
          <tr>
            <th>消纳场地址</th>
            <td>{{ tableData.intakePlantAddress }}</td>
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
      </div>
    </transition>

    <div id="allmap"></div>
  </div>
</template>

<script>
import { selectAllIntakeData } from "../../assets/axios/index";
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
    };
  },
  mounted() {
    this.ready();
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
      map.centerAndZoom(new BMap.Point(116.59910832904944, 35.40759474408141), 10); // 初始化地图,设置中心点坐标和地图级别
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
      selectAllIntakeData(false)
        .then((res) => {
          this.data_info = res.data.respBody;
          console.log(this.data_info);
          var markers = [];
          for (var i = 0; i < this.data_info.length; i++) {
            //创建标注点
            var marker = new BMap.Marker(
              new BMap.Point(
                this.data_info[i]["intakePlantLong"],
                this.data_info[i]["intakePlantLat"]
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

    //取消
    cancel() {
      this.isShow = false;
      var myIcon = new BMap.Icon(
        "../../../static/img/point1.png",
        new BMap.Size(32, 32),
        {
          anchor: new BMap.Size(16, 32),
        }
      );
      this.currentPoint.setIcon(myIcon);
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
}
#allmap {
  width: 96.875vw;
  height: 87vh;
  border: 0.1vh solid #3dcaf5;
}
#rightContent {
  position: absolute;
  right: 2vw;
  top: 15vh;
  width: 18vw;
  height: 76vh;
  border: 0.1vh solid #3dcaf5;
  background: url("../../../static/img/icon32-3.png") no-repeat;
  background-position: center;
  z-index: 1000;
  font-size: 1.667vh;
  .title {
    height: 4vh;
    background: url("../../../static/img/icon27.png") no-repeat;
    background-position: center;
    background-size: 18vw 4vh;
    display: flex;
    align-items: center;
    color: #ffffff;
    span {
      margin: 0 1vw 0 1vw;
    }
    #img2 {
      height: 1vw;
      height: 1vw;
      margin-left: 6vw;
    }
  }
  .table {
    width: 95%;
    margin-left: 2.5%;
    margin-top: 1vh;
    border: 0.1vh solid #3dcaf5;
    color: #ffffff;
    font-family: MicrosoftYaHei;
    font-size: 1.481vh;
    caption {
      margin-bottom: 0.5vh;
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
}

// 设置切换过渡动画
.v-enter {
  opacity: 0;
  transform: translateX(100%);
}
.v-leave-to {
  opacity: 0;
  transform: translateX(100%);
  position: absolute;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.6s ease;
}
</style>
