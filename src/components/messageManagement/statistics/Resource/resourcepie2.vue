<template>
  <div id="repie" style="width: 100%; height: 100%"></div>
</template>

<script type="text/javascript">
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
      var myChart = echarts.init(document.getElementById("repie"), "white");
      // 绘制图表
      var option = {
        title: {
          // text: '近三年各资源场垃圾总量统计图',
          //subtext: '数据来源：深圳市'
        },
        legend: {
          // orient: 'vertical',
          textStyle: {
            color: "white"
          },
          orient: "vertical",
          x: "left", //可设定图例在左、右、居中
          y: "top" //可设定图例在上、下、居中
        },

        tooltip: {},
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["55%", "75%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1548, name: "渣土" },
              { value: 310, name: "混凝土块" },
              { value: 234, name: "随时块" },
              { value: 135, name: "泥浆" },
              { value: 135, name: "费金属" },
              { value: 260, name: "费竹木" }
            ]
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style></style>
