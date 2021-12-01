<template>
  <div>
    <div id="content">
      <!-- 左侧三个图 -->
      <div id="left">
        <!-- 图1 -->
        <div id="echart1">
          <div class="left_right_head">各产生源垃圾总量柱状图</div>
          <div class="left_right_con" id="myChart1"></div>
        </div>
        <!-- 图2 -->
        <div id="echart2">
          <div class="left_right_head">产生源垃圾量月变化折线图</div>
          <div class="left_right_con" id="myChart2"></div>
        </div>
        <!-- 图3 -->
        <div id="echart3">
          <div class="left_right_head">产生源经纬度散点图</div>
          <div class="left_right_con" id="myChart3"></div>
        </div>
      </div>
      <div id="centre">
        <!-- 地球大图 -->
        <div id="chart4">
          <div class="cetre_top">主图</div>
          <!-- cesium地球 -->
          <div id="cesiumContainer"></div>
        </div>
        <!-- 中间底部两个图 -->
        <div id="cen_bot">
          <!-- 底部第一个 -->
          <div id="chart5">
            <div class="centre_bot">车辆报警数量折线图</div>
            <div
              class="left_right_con"
              id="myChart5"
              style="padding-left: 2.5vw"
            ></div>
          </div>
          <!-- 底部第二个 -->
          <div id="chart6">
            <div class="centre_bot">车辆报警误报数饼状图</div>
            <div
              class="left_right_con"
              id="myChart6"
              style="padding-left: 2.5vw"
            ></div>
          </div>
        </div>
      </div>
      <!-- 右侧区域 -->
      <div id="right">
        <div id="chart7">
          <div class="left_right_head">消纳场审核状态饼状图</div>
          <div class="left_right_con" id="myChart7"></div>
        </div>
        <div id="chart8">
          <div class="left_right_head">消纳场任务预警图</div>
          <div class="left_right_con" id="myChart8"></div>
        </div>
        <div id="chart9">
          <div class="left_right_head">各资源厂不同类型建筑垃圾量统计</div>
          <div class="left_right_con" id="myChart9"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  sourceBar,
  sourceBarByMonth,
  selectAllSourceData,
  intakeReview,
  alarmCarNumberLineChart,
  proportionOfVehicleCorrectAlarm
} from "../../assets/axios/index";

// import "cesium/Build/Cesium/Widgets/widgets.css";
// import * as Cesium from "cesium";
import * as Cesium from "cesium/Cesium";
import "cesium/Widgets/widgets.css";
export default {
  data() {
    return {
      // echats1  柱状图
      xData1: [],
      yData1: [],
      //   图2 产生源折线图
      xData2: [],
      yData2: [],
      //   图3产生源经纬度散点图
      data3: [],
      //   图5 车辆使用图
      xData5: [],
      yData5: [],
      //   图6 误报比率
      xData6: ["正常报警", "误报"],
      yData6: [],
      //   图7 消纳场审核饼图
      data7: []
    };
  },
  created() {
    //   图1  产生源柱状图
    sourceBar()
      .then(res => {
        //   console.log(res.data.respBody);
        let arr = res.data.respBody;
        for (var i = 0; i < arr.length; i++) {
          this.xData1.push(arr[i].sourceName);
          this.yData1.push(arr[i].wasteTotal);
        }
      })
      .then(() => {
        this.initEchart1();
      });
    //   图2 产生源折线图
    sourceBarByMonth()
      .then(res => {
        let arr = res.data.respBody;
        //   console.log(arr)
        for (var i = 0; i < arr.length; i++) {
          this.xData2.push(arr[i].myDate.slice(0, 10));
          this.yData2.push(arr[i].total);
        }
        this.xData2 = this.xData2.reverse();
        this.yData2 = this.yData2.reverse();
      })
      .then(() => {
        this.initEchart2();
      });
    //   图3 产生源经纬度散点图
    selectAllSourceData()
      .then(res => {
        //   console.log(res);
        this.data3 = res.data.respBody.map(x => {
          return [x.sourceLong, x.sourceLat];
        });
      })
      .then(() => {
        this.initEchart3();
      });
    //   图5 车辆使用数量堆型图
    alarmCarNumberLineChart()
      .then(res => {
        let rawData = JSON.parse(JSON.stringify(res.data.respBody));
        for (let i = 0; i < rawData.length; i++) {
          this.xData5.push(rawData[i].alarmDate);
          this.yData5.push(rawData[i].alarmNum);
        }
      })
      .then(() => {
        this.initEchart5();
      });
    //   误报比
    proportionOfVehicleCorrectAlarm()
      .then(res => {
        let rawData = JSON.parse(JSON.stringify(res.data.respBody));
        for (let i = 0; i < rawData.length; i++) {
          if (rawData[i].status == 1) {
            this.yData6[0] = rawData[i].numOfMisinformation;
          } else if (rawData[i].status == 0) {
            this.yData6[1] = rawData[i].numOfMisinformation;
          }
        }
      })
      .then(() => {
        this.initEchart6();
      });
    //   图7 消纳场审核量饼图
    intakeReview()
      .then(res => {
        let allReviewData = JSON.parse(JSON.stringify(res.data.respBody));

        this.data7 = [
          { value: allReviewData[2].number, name: "审核通过" },
          { value: allReviewData[1].number, name: "待审核" }
        ];
      })
      .then(() => {
        this.initEchart7();
      });
  },
  mounted() {
    // cesium配置
    this.$nextTick(function() {
      this.initEchart1();
      this.initEchart2();
      this.initEchart3();
      this.initEchart5();
      this.initEchart6();
      this.initEchart7();
      this.initEchart8();
      this.initEchart9();

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
        show: false
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
          show: true
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
          show: true
          // maximumLevel:18
        }
      );

      //  默认显示区域--中国
      var china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70);
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china;
      let viewer = new Cesium.Viewer("cesiumContainer", {
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
        //用来去掉地球表面的大气效果的黑圈问题
        orderIndependentTranslucency: false,
        contextOptions: {
          webgl: {
            alpha: true
          }
        },
        terrainProvider: Cesium.createWorldTerrain()
      });
      //更换背景颜色
      viewer.scene.sun.show = true; //在Cesium1.6(不确定)之后的版本会显示太阳和月亮，不关闭会影响展示
      viewer.scene.moon.show = true;
      viewer.scene.skyBox.show = true; //关闭天空盒，否则会显示天空颜色
      viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);

      // 显示影像图层和注释图层
      viewer.imageryLayers.addImageryProvider(tdtImagerLayerProvider1);
      viewer.imageryLayers.addImageryProvider(tdtImagerLayerProvider2);

      // 去除版权信息
      viewer._cesiumWidget._creditContainer.style.display = "none";
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
    });
  },
  methods: {
    initEchart1() {
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: "category",
          data: this.xData1,
          name: "工地",
          nameTextStyle: {
            color: "white"
          },
          axisLabel: {
            textStyle: {
              color: "white"
            }
          }
        },
        yAxis: {
          type: "value",
          name: "垃圾总量/万方",
          nameTextStyle: {
            color: "white"
          },
          axisLabel: {
            textStyle: {
              color: "white"
            }
          }
        },
        series: [
          {
            data: this.yData1,
            type: "bar",
            itemStyle: {
              color: "#00ffff"
            }
          }
        ]
      };
      let myChart = this.$echarts.init(document.getElementById("myChart1"));
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    initEchart2() {
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: "category",
          data: this.xData2,
          name: "时间",
          nameTextStyle: {
            color: "white"
          },
          axisLabel: {
            textStyle: {
              color: "white"
            }
          }
        },
        yAxis: {
          type: "value",
          name: "垃圾总量/万方",
          nameTextStyle: {
            color: "white"
          },
          axisLabel: {
            textStyle: {
              color: "white"
            }
          }
        },
        series: [
          {
            data: this.yData2,
            type: "line",
            itemStyle: {
              color: "#00ffff"
            }
          }
        ]
      };
      let myChart = this.$echarts.init(document.getElementById("myChart2"));
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      // window.onresize = myChart.resize;
    },
    initEchart3() {
      let myChart = this.$echarts.init(document.getElementById("myChart3"));
      let option3 = {
        title: {
          // text: '产生源垃圾类型占比饼图',
          // subtext: '数据来源：深圳市'
        },
        legend: {
          textStyle: {
            color: "white"
          }
        },
        grid: { left: "13%", right: "15%" },
        tooltip: {
          //c表示数值
          formatter: "经纬度: ({c})"
        },

        xAxis: {
          type: "value",
          // minInterval: 1,
          name: "经度",
          nameTextStyle: {
            color: "white",
            fontSize: 14
          },
          axisLabel: {
            textStyle: {
              fontSize: 10,
              color: "white" //坐标值得具体的颜色
            }
          },
          min: function(value) {
            return value.min;
          },
          max: function(value) {
            return value.max;
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          name: "纬度",
          nameTextStyle: {
            color: "white",
            fontSize: 14
          },
          axisLabel: {
            textStyle: {
              fontSize: 14,
              color: "white" //坐标值得具体的颜色
            }
          },
          //   min: function(value) {
          //     return value.min;n:
          //   },
          //   max: function(value) {
          //     return value.max;
          //   },
          min: "dataMin",
          max: "dataMax",
          splitLine: {
            show: false
          }
        },
        // dataset:{
        // source:this.data
        //     } ,
        series: [
          {
            symbolSize: 20,
            // name:'垃圾排放状态',
            type: "scatter",
            encode: {
              x: [0],
              y: [1]
            },
            data: this.data3,
            itemStyle: {
              color: "#ffff00"
            }
          }
        ]
      };
      myChart.setOption(option3);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    initEchart5() {
      let myChart = this.$echarts.init(document.getElementById("myChart5"));
      let option3 = {
        title: {},
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: []
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xData5.reverse(),
          axisLabel: {
            textStyle: {
              color: "white" //坐标值得具体的颜色
            }
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "white" //坐标值得具体的颜色
            }
          }
        },
        series: [
          {
            name: "报警数量",
            type: "line",
            stack: "总量",
            data: this.yData5.reverse()
          }
        ]
      };

      myChart.setOption(option3);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    initEchart6() {
      let myChart = this.$echarts.init(document.getElementById("myChart6"));
      let option = {
        color: ["rgb(0, 128, 0)", "rgb(195,53,49)"],
        title: {
          // text: '某站点用户访问来源',
          // subtext: '纯属虚构',
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          // data: ["潼湖区消纳场所1", "大铲湾临时装船点", "1-2全线消纳"],
          data: ["误报", "正常报警"],
          textStyle: {
            color: "#ffffff",
            fontSize: 12
          }
        },
        series: [
          {
            name: "各报警状态车辆数",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: this.yData6[0], name: this.xData6[0] },
              { value: this.yData6[1], name: this.xData6[1] }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      // window.onresize = myChart.resize;
    },
    initEchart7() {
      // myChart.resize();
      let myChart = this.$echarts.init(document.getElementById("myChart7"));
      let option5 = {
        title: {
          // subtext: '电子联单数量：123456(条)',
          // left: 'right',
          // subtextStyle:{
          //     fontSize:12
          // }
        },
        tooltip: {
          trigger: "item"
          // grid:"left",
          // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["rgb(82,204,102)", "rgb(255,170,0)"],
        legend: {
          orient: "vertical",
          left: "left",
          // data: ["潼湖区消纳场所1", "大铲湾临时装船点", "1-2全线消纳"],
          data: ["审核通过", "待审核"],
          textStyle: {
            color: "#ffffff",
            fontSize: 12
          }
        },
        grid: {
          left: "90%"
        },
        series: [
          {
            //name: '电子联单详情',
            type: "pie",
            radius: "55%",
            center: ["47.85%", "60%"],
            data: this.data7,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      myChart.setOption(option5);
      window.addEventListener("resize", () => {
        myChart.resize();
      });

      // window.onresize = myChart.resize;
    },
    initEchart8() {
      let myChart = this.$echarts.init(document.getElementById("myChart8"));
      var fontColor = "#30eee9";
      let option = {
        // backgroundColor:'#11183c',
        // grid: {
        //       left: '5%',
        //         right: '10%',
        //         top:'20%',
        //       bottom: '15%',
        //       containLabel: true
        // },
        tooltip: {
          show: true,
          trigger: "item"
        },
        legend: {
          show: true,
          x: "center",
          y: "35",
          icon: "stack",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#1bb4f6"
          },
          data: ["预警", "剩余容量", "总容量"]
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLabel: {
              color: fontColor
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#397cbc"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#195384"
              }
            },
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "容量",
            min: 0,
            max: 1000,
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                color: "#2ad1d2"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#27b4c2"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#11366e"
              }
            }
          },
          {
            type: "value",
            name: "预警",
            min: 0,
            max: 1000,
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                color: "#186afe"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#186afe"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#11366e"
              }
            }
          }
        ],
        series: [
          {
            name: "预警",
            type: "line",
            stack: "总量",
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: "#0092f6",
                lineStyle: {
                  color: "#0092f6",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,146,246,0.9)"
                    }
                  ])
                }
              }
            },
            markPoint: {
              itemStyle: {
                normal: {
                  color: "red"
                }
              }
            },
            data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330]
          },
          {
            name: "剩余容量",
            type: "line",
            stack: "总量",
            symbol: "circle",
            symbolSize: 8,

            itemStyle: {
              normal: {
                color: "#00d4c7",
                lineStyle: {
                  color: "#00d4c7",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,212,199,0.9)"
                    }
                  ])
                }
              }
            },
            data: [220, 182, 191, 234, 290, 330, 310, 201, 154, 190, 330, 410]
          },
          {
            name: "总容量",
            type: "line",
            stack: "总量",
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: "#aecb56",
                lineStyle: {
                  color: "#aecb56",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(114,144,89,0.9)"
                    }
                  ])
                }
              }
            },
            data: [150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190]
          }
        ]
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      // window.onresize = myChart.resize;
    },
    initEchart9() {
      let myChart = this.$echarts.init(document.getElementById("myChart9"));
      let option3 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: [
            "工程渣土",
            "装修垃圾",
            "拆迁垃圾",
            "工程泥浆",
            "淤泥以及弃料"
          ],
          textStyle: {
            color: "white"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          splitLine: { show: false }, //去除网格线
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          splitLine: { show: false }, //去除网格线
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        dataset: {
          dimensions: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        series: [
          {
            name: "工程渣土",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            // 设置颜色
            itemStyle: {
              normal: {
                color: "#00d4c7"
              }
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: "装修垃圾",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            // 设置颜色
            itemStyle: {
              normal: {
                color: "#aecb56"
              }
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "拆迁垃圾",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            // 设置颜色
            itemStyle: {
              normal: {
                color: "#6666FF"
              }
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "工程泥浆",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            // 设置颜色
            itemStyle: {
              normal: {
                color: "#99CCFF"
              }
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          },
          {
            name: "淤泥以及弃料",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            // 设置颜色
            itemStyle: {
              normal: {
                color: "#0000FF"
              }
            },
            data: [820, 832, 901, 934, 1290, 1330, 1320]
          }
        ]
      };

      myChart.setOption(option3);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#echart1 {
  text-align: center;
}
.left_right_con {
  padding-left: 1vw;
  width: 20vw;
  height: 23.148vh;
}
.left_right_head {
  width: 21.043vw;
  height: 4.63vh;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  //  border: #fff solid 1px;
  background: url("../../../static/img/biaoti2.png") no-repeat;
  background-size: cover;
  font-size: 1.574vh;
  color: #fff;
  font-weight: bold;
  // font-family: 'PingFangSC-Regular';
}
.cetre_top {
  width: 51.25vw;
  height: 4.63vh;
  background: url("../../../static/img/biaoti4.png") no-repeat;
  background-size: cover;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  font-size: 1.574vh;
  color: #fff;
  font-weight: bold;
}
#cesiumContainer {
  margin-left: 0.2vw;
  width: 51vw;
  height: 53.5vh;
}
.centre_bot {
  width: 25vw;
  height: 4.63vh;
  background: url("../../../static/img/biaoti3.png") no-repeat;
  background-size: cover;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  font-size: 1.574vh;
  color: #fff;
  font-weight: bold;
}
#content {
  width: 100%;
  height: 100%;
  #left {
    width: 21.042vw;
    height: 100%;
    margin-left: 2.083vw;
    margin-top: 0.185vh;
    float: left;
    #echart1 {
      width: 21.042vw;
      height: 27.778vh;
      // border: #fff solid 1px;
      background: url("../../../static/img/bg2.png") no-repeat;
      background-size: 21.042vw 27.778vh;
    }
    #echart2 {
      width: 21.042vw;
      height: 27.778vh;
      // margin-left: 2.083vw;
      margin-top: 2.685vh;
      // border: #fff solid 1px;
      background: url("../../../static/img/bg2.png") no-repeat;
      background-size: 21.042vw 27.778vh;
    }
    #echart3 {
      width: 21.042vw;
      height: 27.778vh;
      margin-top: 2.685vh;
      // border: #fff solid 1px;
      background: url("../../../static/img/bg2.png") no-repeat;
      background-size: 21.042vw 27.778vh;
    }
  }
  #centre {
    width: 51.25vw;
    height: 100%;
    margin-left: 1.25vw;
    margin-top: 0.185vh;
    float: left;
    //    border: #fff solid 1px;
    #chart4 {
      width: 51.25vw;
      height: 58.333vh;
      // border: #fff solid 1px;
      //   background: url("../../../static/img/bg4.png") no-repeat;
      //   background-size: 51.25vw 58.333vh;
    }
    #cen_bot {
      width: 51.25vw;
      height: 27.778vh;
      margin-top: 2.685vh;
      // border: #fff solid 1px;
      // float: left;
      #chart5 {
        width: 25vw;
        height: 27.778vh;
        // border: #fff solid 1px;
        float: left;
        background: url("../../../static/img/bg3.png") no-repeat;
        background-size: 25vw 27.778vh;
      }
      #chart6 {
        width: 25vw;
        height: 27.778vh;
        // border: #fff solid 1px;
        // margin-left: 1.22vw;
        float: right;
        background: url("../../../static/img/bg3.png") no-repeat;
        background-size: 25vw 27.778vh;
      }
    }
  }
  #right {
    width: 21.042vw;
    height: 100%;
    margin-left: 1.25vw;
    margin-top: 0.185vh;
    float: left;
    #chart7 {
      width: 21.042vw;
      height: 27.778vh;
      // border: #fff solid 1px;
      background: url("../../../static/img/bg2.png") no-repeat;
      background-size: 21.042vw 27.778vh;
    }
    #chart8 {
      width: 21.042vw;
      height: 27.778vh;
      margin-top: 2.685vh;
      // border: #fff solid 1px;
      background: url("../../../static/img/bg2.png") no-repeat;
      background-size: 21.042vw 27.778vh;
    }
    #chart9 {
      width: 21.042vw;
      height: 27.778vh;
      margin-top: 2.685vh;
      // border: #fff solid 1px;
      background: url("../../../static/img/bg2.png") no-repeat;
      background-size: 21.042vw 27.778vh;
    }
  }
}
</style>
