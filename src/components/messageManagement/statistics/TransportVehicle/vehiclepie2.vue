<template>
  <div id="snbar" style="width: 100%; height: 100%"></div>
</template>

<script type="text/javascript">
import { proportionOfVehicleCorrectAlarm } from "../../../../assets/axios/index";
export default {
  data() {
    return {
      data: [],
      xData: ["正常报警", "误报"],
      yData: []
    };
  },

  props: {},
  mounted() {
    let _this = this;
    // 请求数据
    proportionOfVehicleCorrectAlarm()
      .then(res => {
        let rawData = JSON.parse(JSON.stringify(res.data.respBody));
        for (let i = 0; i < rawData.length; i++) {
          if (rawData[i].status == 1) {
            _this.yData[0] = rawData[i].numOfMisinformation;
          } else if (rawData[i].status == 0) {
            _this.yData[1] = rawData[i].numOfMisinformation;
          }
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
      var myChart = echarts.init(document.getElementById("snbar"), "white");
      // 绘制图表
      var option = {
        color: ["rgb(0, 128, 0)", "rgb(195,53,49)"],
        title: {
          // text: '某站点用户访问来源',
          // subtext: '纯属虚构',
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [
          {
            name: "各报警状态车辆数",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: _this.yData[0], name: _this.xData[0] },
              { value: _this.yData[1], name: _this.xData[1] }
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
