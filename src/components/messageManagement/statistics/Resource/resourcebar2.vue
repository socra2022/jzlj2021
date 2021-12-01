<template>
  <div id="snbar" style="width: 100%; height:100%"></div>
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
      var myChart = echarts.init(document.getElementById("snbar"), "white");
      // 绘制图表
      var option = {
        title: {
          // text: '近三年各资源场垃圾总量统计图',
          //subtext: '数据来源：深圳市'
        },
        legend: {
          textStyle: {
            color: "white",
          },
        },
        tooltip: {},
        dataset: {
          // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
          // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
          // dimensions: ['product', '2015', '2016', '2017'],
          source: [
            ["product", "2017", "2018", "2019"],
            ["中华资源场", 4330, 8580, 9370],
            ["神华资源场", 8310, 7340, 5510],
            ["兴隆资源场", 8640, 6520, 8250],
          ],
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              textStyle: {
                color: "white", //坐标值得具体的颜色
              },
            },
          },
          // {type: 'category', gridIndex: 1}
        ],
        grid:{left:"15%"},
        yAxis: {
          axisLabel: {
            textStyle: {
              color: "white", //坐标值得具体的颜色
            },
          },
        },
        // {gridIndex: 1}

        // grid: [
        //     {bottom: '55%'},
        //     {top: '55%'}
        // ],
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style>
</style>
