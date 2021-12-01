<template>
  <div id="line" style="width: 100%;height:100%;"></div>
</template>

<script type="text/javascript">
import { sourceBarByMonth } from "../../../../assets/axios/index";
export default {
  data() {
    return {
      data: [
        [320, 302, 301, 334, 390, 330, 320],
        [120, 132, 101, 134, 90, 230, 210],
        [220, 182, 191, 234, 290, 330, 310],
        [150, 212, 201, 154, 190, 330, 410],
        [820, 832, 901, 934, 1290, 1330, 1320]
      ],
      xData: [],
      yData: []
    };
  },

  props: {},
  mounted() {
    this.ready();
  },
  methods: {
    ready: function() {
      sourceBarByMonth()
        .then(res => {
          let arr = res.data.respBody;
        //   console.log(arr)
          for (var i = 0; i < arr.length; i++) {
            this.xData.push(arr[i].myDate.slice(0,10));
            this.yData.push(arr[i].total);
          }
          this.xData =this.xData.reverse()
          this.yData =this.yData.reverse()
        //   console.log(this.yData);
        //   console.log(this.xData);
        })
        .then(() => {
          var echarts = require("echarts");
          // 基于准备好的dom，初始化echarts实例
          var myChart = echarts.init(document.getElementById("line"), "black");
          var option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "line" // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            xAxis: {
              type: "category",
              data: this.xData,
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
                data: this.yData,
                type: "line",
                itemStyle:{
                    color:"#00ffff"
                }
              }
            ]
          };
          myChart.setOption(option);
        });

      //   // 绘制图表
      //   var option = {
      //     title: {
      //       // text: '产生源建筑垃圾量变化折线图',
      //       // subtext: '数据来源：深圳市'
      //     },
      //     tooltip: {
      //       trigger: "axis",
      //       axisPointer: {
      //         type: "cross",
      //         label: {
      //           backgroundColor: "#6a7985"
      //         }
      //       }
      //     },
      //     legend: {
      //       data: [
      //         "工程渣土",
      //         "装修垃圾",
      //         "拆迁垃圾",
      //         "工程泥浆",
      //         "淤泥以及弃料"
      //       ],
      //       textStyle: {
      //         color: "white"
      //       }
      //     },
      //     toolbox: {
      //       feature: {
      //         saveAsImage: {}
      //       }
      //     },
      //     grid: {
      //       left: "3%",
      //       right: "4%",
      //       bottom: "3%",
      //       containLabel: true
      //     },
      //     xAxis: [
      //       {
      //         type: "category",
      //         boundaryGap: false,
      //         data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      //         axisLabel: {
      //           textStyle: {
      //             color: "white" //坐标值得具体的颜色
      //           }
      //         }
      //       }
      //     ],
      //     yAxis: [
      //       {
      //         type: "value",
      //         axisLabel: {
      //           textStyle: {
      //             color: "white" //坐标值得具体的颜色
      //           }
      //         }
      //       }
      //     ],
      //     series: [
      //       {
      //         name: "工程渣土",
      //         type: "line",
      //         stack: "总量",
      //         areaStyle: {},
      //         data: [120, 132, 101, 134, 90, 230, 210]
      //       },
      //       {
      //         name: "装修垃圾",
      //         type: "line",
      //         stack: "总量",
      //         areaStyle: {},
      //         data: [220, 182, 191, 234, 290, 330, 310]
      //       },
      //       {
      //         name: "拆迁垃圾",
      //         type: "line",
      //         stack: "总量",
      //         areaStyle: {},
      //         data: [150, 232, 201, 154, 190, 330, 410]
      //       },
      //       {
      //         name: "工程泥浆",
      //         type: "line",
      //         stack: "总量",
      //         areaStyle: { normal: {} },
      //         data: [320, 332, 301, 334, 390, 330, 320]
      //       },
      //       {
      //         name: "淤泥以及弃料",
      //         type: "line",
      //         stack: "总量",
      //         label: {
      //           normal: {
      //             show: true,
      //             position: "top"
      //           }
      //         },
      //         areaStyle: { normal: {} },
      //         data: [820, 932, 901, 934, 1290, 1330, 1320]
      //       }
      //     ]
      //   };
    }
  }
};
</script>

<style></style>
