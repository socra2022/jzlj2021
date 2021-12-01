<template>
  <div id="pie2" style="width: 100%; height: 100%"></div>
</template>

<script type="text/javascript">
import axios from "axios";
export default {
  data() {
    return {
      data: [],
    };
  },

  props: {},
  mounted() {
    this.ready();
  },
  methods: {
    ready: function () {
      var echarts = require("echarts");
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("pie2"), "white");
      // 绘制图表
      var option = {
        title: {
          subtext: "正常结束电子联单数量：73894(条)",
          left: "right",
          subtextStyle: {
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        color: ["rgb(14,128,240)", "rgb(82,204,102)"],

        legend: {
          orient: "vertical",
          left: "left",
          data: ["24小时未处置", "未到指定消纳场"],
              textStyle: {
            color: "#ffffff",
          },
        },
        series: [
          {
            name: "电子联单详情",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 7000, name: "24小时未处置" },
              { value: 3894, name: "未到指定消纳场" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      myChart.setOption(option);
    },
  },
};
</script>

<style>
</style>
