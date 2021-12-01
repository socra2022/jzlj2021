<template>
  <div id="pie" style="width: 100%; height: 100%"></div>
</template>

<script type="text/javascript">
import axios from "axios";
export default {
  data() {
    return {
      data: []
    };
  },

  props: {},
  mounted() {
    this.ready();
  },
  methods: {
    ready: function() {
      var echarts = require("echarts");
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("pie"), "white");
      // 绘制图表
      var option = {
        title: {
          // subtext: '电子联单数量：123456(条)',
          left: "center",
          subtextStyle: {
            fontSize: 12
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["#9ACD32", "#836FFF", "#8B2500", "#FF4040", "rgb(111,0,100)"],
        legend: {
          orient: "vertical",
          left: "left",
          // data: ['正常电子联单', '异常电子联单']
          textStyle: {
            color: "#ffffff"
          }
        },
        series: [
          {
            // name: '电子联单详情',
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 40, name: "资源场1" },
              { value: 60, name: "资源场2" },
              { value: 100, name: "资源场3" },
              { value: 250, name: "资源场4" }
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
    }
  }
};
</script>

<style></style>
