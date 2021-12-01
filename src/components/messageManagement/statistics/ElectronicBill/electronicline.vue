
<template>
  <!-- <div id="charts" style="width:'100%',height:'35.4rem'"> -->
  <div id="billline" :style="{ width: '100%', height: '100%' }"></div>
  <!-- </div> -->
</template>

<script>
// import echarts from '../../../../node_modules/echarts/dist/echarts.js'

export default {
  name: "lineChart",
  data() {
    return {};
  },
  components: {},
  computed: {},
  methods: {},
  mounted() {
    /*ECharts图表*/
    var echarts = require("echarts");
    var myChart = echarts.init(document.getElementById("billline"));
    myChart.setOption({
      title: {
        // text: '堆叠区域图'
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        // data:['中华资源厂','神华资源厂','兴隆资源厂'],
        textStyle: {
          //图例文字的样式
          color: "white",
          fontSize: 13,
        },
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          axisLine: {
            lineStyle: {
              color: "white",
            },
          },
          axisLabel: {
            textStyle: {
              color: "white", //坐标值得具体的颜色
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "white",
            },
          },
          axisLabel: {
            textStyle: {
              color: "white", //坐标值得具体的颜色
            },
          },
        },
      ],

      series: [
        {
          //name:'中华资源厂',
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: [1200, 3200, 1000, 1300, 4000, 2300, 2100],
        },
        // {
        //     name:'神华资源厂',
        //     type:'line',
        //     stack: '总量',
        //     areaStyle: {},
        //     data:[22, 18, 19, 23, 29, 33, 31]
        // },
        // {
        //     name:'兴隆资源厂',
        //     type:'line',
        //     stack: '总量',
        //     areaStyle: {},
        //     data:[15, 23, 20, 15, 19, 33, 41]
        // },
      ],
    });

    /* window.addEventListener("resize",function(){
    myChart.resize();
  }); */
  },
};
</script>


<style scoped>
#lineChart {
  margin-top: -6px;
}
</style>
