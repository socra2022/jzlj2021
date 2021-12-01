<template>
  <div id="bar" style="width:100%;height:100%;"></div>
</template>

<script type="text/javascript">
import { sourceBar } from "../../../../assets/axios/index";
export default {
  data() {
    return {
      data: [],
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
      sourceBar()
        .then(res => {
        //   console.log(res.data.respBody);
          let arr = res.data.respBody;
          for (var i = 0; i < arr.length; i++) {
            this.xData.push(arr[i].sourceName);
            this.yData.push(arr[i].wasteTotal);
          }
        //   console.log(this.xData);
        //   console.log(this.yData);
        })
        .then(() => {
          var echarts = require("echarts");
          // 基于准备好的dom，初始化echarts实例
          var myChart = echarts.init(document.getElementById("bar"), "black");
          var option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            xAxis: {
              type: "category",
              data: this.xData,
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
                data: this.yData,
                type: "bar",
                itemStyle: {
                  color: "#00ffff"
                }
              }
            ]
          };
          myChart.setOption(option);
        });

      // 绘制图表
      var option = {
        title: {
          // text: '产生源垃圾总量柱状图',
          // subtext: '数据来源：深圳市'
        },
        legend: {
          textStyle: {
            color: "white"
          }
        },
        tooltip: {},
        dataset: {
          // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
          // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
          // dimensions: ['product', '2015', '2016', '2017'],
          source: [
            ["product", "2015", "2016", "2017"],
            ["工程渣土", 43.3, 85.8, 93.7],
            ["装修垃圾", 83.1, 73.4, 55.1],
            ["拆迁垃圾", 86.4, 65.2, 82.5],
            ["工程泥浆", 72.4, 53.9, 39.1]
          ]
        },
        xAxis: [
          {
            type: "category",
            // {type: 'category', gridIndex: 1}
            axisLabel: {
              textStyle: {
                color: "white" //坐标值得具体的颜色
              }
            }
          }
        ],
        yAxis: [
          {
            axisLabel: {
              textStyle: {
                color: "white" //坐标值得具体的颜色
              }
            }
          }
        ],
        // {gridIndex: 1}

        // grid: [
        //     {bottom: '55%'},
        //     {top: '55%'}
        // ],
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
      };
    }
  }
};
</script>

<style></style>
