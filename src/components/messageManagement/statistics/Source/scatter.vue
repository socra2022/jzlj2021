<template>
  <div id="scatter" style="width: 100%;height:100%;"></div>
</template>

<script type="text/javascript">
import axios from "axios";
import { selectAllSourceData } from "../../../../assets/axios/index";
export default {
  data() {
    return {
      data1: [],
      data99: [],
      yes: [],
      no: []
    };
  },

  mounted() {
    this.ready();
  },
  methods: {
    ready: function() {
      selectAllSourceData()
        .then(res => {
          //   console.log(res);
          this.data1 = res.data.respBody.map(x => {
            return [x.sourceLong, x.sourceLat];
          });
        })
        .then(() => {
          var echarts = require("echarts");
          // 基于准备好的dom，初始化echarts实例
          var myChart = echarts.init(
            document.getElementById("scatter"),
            "black"
          );
          // 绘制图表
          var option = {
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
                data: this.data1,
                itemStyle: {
                  color: "#ffff00"
                }
              }
            ]
          };
          myChart.setOption(option);
        });

      // }
      // ).catch(error => console.log(error))
    }
  }
};
</script>

<style></style>
