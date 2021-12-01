<template>
  <div id="stline" style="width: 100%; height: 100%"></div>
</template>

<script type="text/javascript">
import { alarmCarNumberLineChart } from "../../../../assets/axios/index";
export default {
  data() {
    return {
      xData: [],
      yData: []
    };
  },

  props: {},
  mounted() {
    let _this = this;
    // 请求数据
    alarmCarNumberLineChart()
      .then(res => {
        let rawData = JSON.parse(JSON.stringify(res.data.respBody));
        for (let i = 0; i < rawData.length; i++) {
          _this.xData.push(rawData[i].alarmDate);
          _this.yData.push(rawData[i].alarmNum);
        }
      })
      .then(() => {
        this.ready();
      });
  },
  methods: {
    ready: function() {
      let _this = this;
      var echarts = require("echarts");
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("stline"), "white");
      // 绘制图表
      var option = {
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
          data: _this.xData,
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
            data: _this.yData
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style></style>
