<template>
  <div id="Billline" style="width: 100%; height: 100%"></div>
</template>

<script type="text/javascript">
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
      var myChart = echarts.init(document.getElementById("Billline"), "white");
      // 绘制图表
      var option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLabel: {
            textStyle: {
              color: "white", //坐标值得具体的颜色
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "white", //坐标值得具体的颜色
            },
          },
        },
         grid:{left:"13%"},
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
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
